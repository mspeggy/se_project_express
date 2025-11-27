const express = require("express");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_STATUS_CODE } = require("../utils/constants");

const router = express.Router();

// Public auth routes
router.post("/signup", createUser);
router.post("/signin", login);




// Protected/other routes
router.use("/users", userRouter);         
router.use("/items", clothingItemRouter);

// 404 handler
router.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Route not found" });
});

module.exports = router;