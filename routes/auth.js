const express = require("express");
const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
module.exports = router;
