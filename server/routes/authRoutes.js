const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

});

const { registerUser,
  loginUser, logoutUser } = require("../controllers/authControllers");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
module.exports = router;