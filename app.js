const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  
require('dotenv').config();

const errorHandler = require("./middlewares/error-handler")
const {requestLogger,errorLogger} = require("./middlewares/logger")
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const {errors} = require("celebrate")
const { login, createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(cors())

app.use(requestLogger)
/* ----------------------------------
   Public Routes (NO auth required)
----------------------------------- */

app.post("/signin", login);
app.post("/signup", createUser);


/* ------------------------------
   Protected Routes
--------------------------------*/
app.use(auth); // <-- Auth now applies to everything below

app.use("/", mainRouter);

/* ------------------------------ */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use(errorLogger)
app.use(errors())
app.use(errorHandler);