const { User, Notification } = require("../models");

/* =========================
   ➕ CREATE NOTIFICATION (SINGLE USER)
========================= */
const createNotification = async (req, res) => {
  try {
    const io = req.app.get("io");

    const { userId, title, message, type } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || "user",
      isRead: false,
    });

    // 🔥 REAL-TIME PUSH
    io.to(`user_${userId}`).emit("notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   📥 GET USER NOTIFICATIONS
========================= */
const getNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
      console.log("PARAM ID:", req.params.id);
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ✅ MARK AS READ
========================= */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   🗑 CLEAR ALL NOTIFICATIONS
========================= */
const clearNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.params.userId },
    });

    res.json({ message: "Cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   🔢 GET UNREAD COUNT
========================= */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        userId: req.params.userId,
        isRead: false,
      },
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   📢 BROADCAST TO ALL USERS
========================= */
const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const users = await User.findAll();

    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      message,
      type: type || "broadcast",
      isRead: false,
    }));

    // 💾 Save all
    const createdNotifications = await Notification.bulkCreate(notifications);

    // ⚡ Emit real-time
    const io = req.app.get("io");

    createdNotifications.forEach((note) => {
      io.to(`user_${note.userId}`).emit("notification", note);
    });

    res.json({ message: "Broadcast sent to all users ✅" });
  } catch (err) {
    console.error("Broadcast Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  clearNotifications,
  getUnreadCount,
  broadcastNotification,
};