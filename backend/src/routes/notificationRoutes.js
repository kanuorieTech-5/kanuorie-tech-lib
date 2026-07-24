const express = require("express");
const router = express.Router();
const { createNotification, getNotifications, markAsRead, clearNotifications, getUnreadCount,} = require("../controllers/notificationController");
const { broadcastNotification } = require("../controllers/notificationController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/notifications/:userId", getNotifications);
router.get("/notifications/:userId/unread", getUnreadCount);
router.post("/notifications", createNotification);
router.put("/notifications/:id/read", markAsRead);
router.delete("/notifications/:userId", clearNotifications);
router.post("/notifications/broadcast", protect, adminOnly, broadcastNotification);

module.exports = router;