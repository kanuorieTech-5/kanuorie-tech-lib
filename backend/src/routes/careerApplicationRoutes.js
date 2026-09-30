const express = require("express");

const {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  markAsRead,
  markAsUnread,
  deleteApplication,
  getApplicationStats,
} = require("../controllers/careerApplicationController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   PUBLIC
========================================== */

router.post(
  "/",
  createApplication
);

/* ==========================================
   ADMIN
========================================== */

router.get(
  "/stats",
  protect,
  adminOnly,
  getApplicationStats
);

router.get(
  "/",
  protect,
  adminOnly,
  getApplications
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getApplication
);

router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);

router.put(
  "/:id/notes",
  protect,
  adminOnly,
  updateApplicationNotes
);

router.put(
  "/:id/read",
  protect,
  adminOnly,
  markAsRead
);

router.put(
  "/:id/unread",
  protect,
  adminOnly,
  markAsUnread
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteApplication
);

module.exports = router;
