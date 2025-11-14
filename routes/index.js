const router = require("express").Router();
const clothingItemRouter = require("./clothingItem");

const userRouter = require("./users");
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require("../utils/constants");


router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Router not found" });
});

module.exports = router;
