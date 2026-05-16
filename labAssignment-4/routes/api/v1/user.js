const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const { verifyToken } = require("../../../middlewares/apiAuthMiddleware");

// @route   GET /api/v1/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
