const User = require("../models/User");
const Notification = require("../models/Notification");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE NOTIFICATION
========================================== */

const createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message, type } = req.body;

  const user = await User.findById(recipient);

  if (!user) {
    throw new ApiError(404, "Recipient not found.");
  }

  const notification = await Notification.create({
    recipient,
    sender: req.user._id,
    title,
    message,
    type: type || "system",
  });

  const io = req.app.get("io");

  if (io) {
    io.to(`user_${recipient}`).emit(
      "notification",
      notification
    );
  }

  return ApiResponse.success(
    res,
    notification,
    "Notification created successfully.",
    201
  );
});

/* ==========================================
   GET USER NOTIFICATIONS
========================================== */

const getNotifications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {
    recipient: req.user._id,
  };

  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Notification.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    notifications,
    "Notifications retrieved successfully.",
    200,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  );
});

/* ==========================================
   GET SINGLE NOTIFICATION
========================================== */

const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  }).populate("sender", "name email");

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found."
    );
  }

  return ApiResponse.success(
    res,
    notification,
    "Notification retrieved successfully."
  );
});

/* ==========================================
   MARK AS READ
========================================== */

const markAsRead = asyncHandler(async (req, res) => {
  const notification =
    await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found."
    );
  }

  return ApiResponse.success(
    res,
    notification,
    "Notification marked as read."
  );
});

/* ==========================================
   MARK ALL AS READ
========================================== */

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      recipient: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  return ApiResponse.success(
    res,
    null,
    "All notifications marked as read."
  );
});

/* ==========================================
   DELETE NOTIFICATION
========================================== */

const deleteNotification = asyncHandler(async (req, res) => {
  const notification =
    await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found."
    );
  }

  await notification.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Notification deleted successfully."
  );
});

/* ==========================================
   CLEAR ALL NOTIFICATIONS
========================================== */

const clearNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({
    recipient: req.user._id,
  });

  return ApiResponse.success(
    res,
    null,
    "Notifications cleared successfully."
  );
});

/* ==========================================
   GET UNREAD COUNT
========================================== */

const getUnreadCount = asyncHandler(async (req, res) => {
  const count =
    await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

  return ApiResponse.success(
    res,
    {
      unread: count,
    },
    "Unread count retrieved successfully."
  );
});

/* ==========================================
   BROADCAST TO ALL USERS
========================================== */

const broadcastNotification =
  asyncHandler(async (req, res) => {
    const { title, message, type } = req.body;

    const users = await User.find({}, "_id");

    const notifications = users.map((user) => ({
      recipient: user._id,
      sender: req.user._id,
      title,
      message,
      type: type || "announcement",
    }));

    const created =
      await Notification.insertMany(
        notifications
      );

    const io = req.app.get("io");

    if (io) {
      created.forEach((notification) => {
        io.to(
          `user_${notification.recipient}`
        ).emit(
          "notification",
          notification
        );
      });
    }

    return ApiResponse.success(
      res,
      {
        sent: created.length,
      },
      "Broadcast notification sent successfully."
    );
  });

  /* ==========================================
   GET ALL NOTIFICATIONS - ADMIN
========================================== */
const getAdminNotifications = asyncHandler(
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.isRead !== undefined) {
      filter.isRead =
        req.query.isRead === "true";
    }

    const [notifications, total] =
      await Promise.all([
        Notification.find(filter)
          .populate(
            "recipient",
            "name email"
          )
          .populate(
            "sender",
            "name email"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        Notification.countDocuments(filter),
      ]);

    return ApiResponse.success(
      res,
      notifications,
      "Admin notifications retrieved successfully.",
      200,
      {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    );
  }
);

/* ==========================================
   DELETE NOTIFICATION - ADMIN
========================================== */

const deleteAdminNotification = asyncHandler(
  async (req, res) => {
    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    await notification.deleteOne();

    return ApiResponse.success(
      res,
      null,
      "Notification deleted successfully."
    );
  }
);

/* ==========================================
   CLEAR ALL NOTIFICATIONS - ADMIN
========================================== */

const clearAdminNotifications = asyncHandler(
  async (req, res) => {
    const result = await Notification.deleteMany({});

    return ApiResponse.success(
      res,
      {
        deleted: result.deletedCount,
      },
      "All notifications cleared successfully."
    );
  }
);

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  getUnreadCount,
  broadcastNotification,
  getAdminNotifications,
  deleteAdminNotification,
  clearAdminNotifications,
};