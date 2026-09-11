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

router
  .route("/")
  .get(getCourses)
  .post(protect, adminOnly, saveCourse);

  router.post(
  "/:id/enroll",
  protect,
  enrollCourse
);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

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

module.exports = router;