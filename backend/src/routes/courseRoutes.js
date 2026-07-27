const express = require("express");

const {
  saveCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  updateProgress,
  updateNotes,
} = require("../controllers/courseController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

router
  .route("/")
  .get(getCourses)
  .post(protect, adminOnly, saveCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

/* ==========================================
   USER PROGRESS
========================================== */

router.put(
  "/:id/progress",
  protect,
  updateProgress
);

router.put(
  "/:id/notes",
  protect,
  updateNotes
);

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;