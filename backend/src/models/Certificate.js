const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    progress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Progress",
      required: true,
    },

    recipientName: {
      type: String,
      required: true,
      trim: true,
    },

    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: String,
      default: "KanuorieTech",
      trim: true,
    },

    completionDate: {
      type: Date,
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["issued", "revoked"],
      default: "issued",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * A learner can receive only one certificate
 * for a particular course.
 */
certificateSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);
