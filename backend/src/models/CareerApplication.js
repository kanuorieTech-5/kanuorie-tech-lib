const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },

    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Reviewing",
        "Shortlisted",
        "Interview",
        "Accepted",
        "Rejected",
      ],
      default: "New",
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
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

/* ==========================================
   INDEXES
========================================== */

careerApplicationSchema.index({
  status: 1,
  createdAt: -1,
});

careerApplicationSchema.index({
  isRead: 1,
  createdAt: -1,
});

careerApplicationSchema.index({
  email: 1,
});

careerApplicationSchema.index({
  position: 1,
});

module.exports = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);
