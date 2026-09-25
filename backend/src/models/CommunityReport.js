const mongoose = require("mongoose");

const communityReportSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
      index: true,
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: [
        "spam",
        "harassment",
        "inappropriate",
        "misinformation",
        "copyright",
        "other",
      ],
      required: true,
    },

    details: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "actioned"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

communityReportSchema.index(
  { post: 1, reporter: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "CommunityReport",
  communityReportSchema
);
