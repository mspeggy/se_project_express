const router = require("express").Router();
const clothingItemRouter = require("./clothingItem");

const {NOT_FOUND_STATUS_CODE} = require("../utils/constants")

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Route not found" });
});

module.exports = router;
