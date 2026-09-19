const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const {
  getUserProgress,
  getCourseProgress,
} = require("../controllers/progressController");

/* ==========================================
   GET ALL PROGRESS FOR LOGGED-IN USER
   GET /api/v1/progress
========================================== */

router.get("/", protect, getUserProgress);

/* ==========================================
   GET PROGRESS FOR ONE COURSE
   GET /api/v1/progress/:id
========================================== */

router.get("/:id", protect, getCourseProgress);

module.exports = router;
