const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "system",
        "course",
        "book",
        "product",
        "announcement",
        "success",
        "warning",
        "error",
      ],
      default: "system",
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    actionUrl: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);