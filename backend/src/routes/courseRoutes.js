const express = require("express");

const {
  saveCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateProgress,
  updateNotes,
} = require("../controllers/courseController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   COURSE CATALOG
========================================== */

router
  .route("/")
  .get(getCourses)
  .post(protect, adminOnly, saveCourse);

/* ==========================================
   ENROLL IN COURSE
========================================== */

router.post("/:id/enroll", protect, enrollCourse);

/* ==========================================
   COURSE DETAILS
   ENROLLED USERS ONLY
========================================== */

router
  .route("/:id")
  .get(protect, getCourse)
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

/* ==========================================
   COURSE PROGRESS
========================================== */

router.put("/:id/progress", protect, updateProgress);

/* ==========================================
   COURSE NOTES
========================================== */

router.put("/:id/notes", protect, updateNotes);

module.exports = router;