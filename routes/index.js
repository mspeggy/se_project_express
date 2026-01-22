const express = require("express");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const  NotFoundError = require("../errors/notfound-error");


const router = express.Router();

// Public auth routes
router.post("/signin", login);
router.post("/signup", createUser);


// Protected/other routes
router.use("/users", userRouter);         
router.use("/items", clothingItemRouter);

// 404 handler
router.use(( next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;