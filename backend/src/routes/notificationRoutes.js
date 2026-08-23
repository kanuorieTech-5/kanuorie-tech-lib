const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  getUnreadCount,
  broadcastNotification,
  getAdminNotifications,
  deleteAdminNotification,
} = require("../controllers/notificationController");
const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ==========================================
   USER ROUTES
========================================== */

router
  .route("/")
  .get(protect, getNotifications)
  .delete(protect, clearNotifications);

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

router.put(
  "/read-all",
  protect,
  markAllAsRead
);

router.put(
  "/:id/read",
  protect,
  markAsRead
);

router.delete(
  "/:id",
  protect,
  deleteNotification
);

/* ==========================================
   ADMIN ROUTES
========================================== */
router.get(
  "/admin",
  protect,
  admin,
  getAdminNotifications
);

router.post(
  "/",
  protect,
  admin,
  createNotification
);

router.post(
  "/broadcast",
  protect,
  admin,
  broadcastNotification
);

router.delete(
  "/admin/:id",
  protect,
  admin,
  deleteAdminNotification
);

module.exports = router;