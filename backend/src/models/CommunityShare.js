const mongoose = require("mongoose");

const communityShareSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    platform: {
      type: String,
      enum: [
        "copy",
        "native",
        "whatsapp",
        "facebook",
        "linkedin",
        "x",
        "other",
      ],
      default: "copy",
    },
  },
  {
    timestamps: true,
  }
);

communityShareSchema.index({
  post: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "CommunityShare",
  communityShareSchema
);
