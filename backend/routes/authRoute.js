const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getMe, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.route("/me")
  .get(protect, getMe)
  .put(protect, updateUserProfile);

module.exports = router;