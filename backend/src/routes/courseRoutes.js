const express = require("express");
const router = express.Router();

const {
  saveCourse,
  getCourses,
  deleteCourse,
  updateProgress,
  updateNotes,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");

// ➕ Save course
router.post("/", protect, saveCourse);

// 📥 Get user courses
router.get("/", protect, getCourses);

// ❌ Delete course
router.delete("/:id", protect, deleteCourse);

// 🔄 Update progress
router.put("/:id/progress", protect, updateProgress);

// 📝 Update notes
router.put("/:id/notes", protect, updateNotes);

module.exports = router;