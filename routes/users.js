
const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

// starts with /users

router.get("/", getUsers);
// GET request to /users/:userid    http://localhost:3001/users/f2j3fj23fj2jf382f2f82 req.params = {userId: f2j3fj23fj2jf382f2f82}
router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;
