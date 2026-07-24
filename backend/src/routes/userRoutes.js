const express = require("express");
const router = express.Router();

const {
  updateUser,
  updateSettings,
  getFullUserProfile,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

// 👤 Get full profile (with relations)
router.get("/:id/full", protect, getFullUserProfile);

// 👤 Profile update
router.put("/:id", protect, updateUser);

// ⚙️ Settings update
router.put("/:id/settings", protect, updateSettings);

module.exports = router;