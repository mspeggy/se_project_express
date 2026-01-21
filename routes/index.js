const express = require("express");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_STATUS_CODE } = require("../utils/constants");

const router = express.Router();

// ---------- Crash Test Route ----------
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});


// Protected/other routes
router.use("/users", userRouter);         
router.use("/items", clothingItemRouter);

// 404 handler
router.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Route not found" });
});

module.exports = router;