const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      // index: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    inquiryType: {
      type: String,
      enum: [
        "General",
        "Web Development",
        "Mobile App",
        "UI/UX Design",
        "Branding",
        "Software Development",
        "Support",
        "Partnership",
        "Investment",
      ],
      default: "General",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    replied: {
      type: Boolean,
      default: false,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    ipAddress: {
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

contactSchema.index({
  isRead: 1,
  createdAt: -1,
});

contactSchema.index({
  inquiryType: 1,
});

module.exports = mongoose.model("Contact", contactSchema);