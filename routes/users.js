const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const auth = require("../middlewares/auth")

router.use(auth)

// protected routes
router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);




module.exports = router;
