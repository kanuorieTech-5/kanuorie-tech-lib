const express = require("express");

const router = express.Router();

const {
  updateProgress,
  updateNotes,
} = require("../controllers/courseController");

const protect = require("../middleware/auth");

/* ==========================================
   COURSE PROGRESS ROUTES
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

module.exports = router;