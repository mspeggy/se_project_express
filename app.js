const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  
require('dotenv').config();

const {errors} = require("celebrate")
const errorHandler = require("./middlewares/error-handler")
const {requestLogger,errorLogger} = require("./middlewares/logger")
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");



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

// ---------- Crash Test Route ----------
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Auth middleware
app.use(auth);

/* ------------------------------
   Protected Routes
--------------------------------*/

// Main application routes
// --------------------
app.use("/", mainRouter);

/* ------------------------------ */


// Error handling middleware
// ----------------------
app.use(errorLogger)
app.use(errors())
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});