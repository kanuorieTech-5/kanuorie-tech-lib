const express = require("express");

const {
  saveCourse,
  getCourses,
  getAdminCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  completeLesson,
  updateCurrentLesson,
  updateProgress,
  updateNotes,
} = require("../controllers/courseController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   PUBLIC COURSE CATALOG
========================================== */

router
  .route("/")
  .get(getCourses)
  .post(protect, adminOnly, saveCourse);

/* ==========================================
   ADMIN COURSE CATALOG
   Full curriculum available to admins.
   MUST COME BEFORE /:id
========================================== */

router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminCourses
);

/* ==========================================
   ENROLL IN COURSE
========================================== */

router.post(
  "/:id/enroll",
  protect,
  enrollCourse
);

/* ==========================================
   COMPLETE LESSON
========================================== */

router.put(
  "/:id/lessons/:lessonId",
  protect,
  completeLesson
);
/* ==========================================
   UPDATE CURRENT LESSON
========================================== */

router.put(
  "/:id/current-lesson/:lessonId",
  protect,
  updateCurrentLesson
);

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

router.put(
  "/:id/progress",
  protect,
  updateProgress
);

/* ==========================================
   COURSE NOTES
========================================== */

router.put(
  "/:id/notes",
  protect,
  updateNotes
);

module.exports = router;