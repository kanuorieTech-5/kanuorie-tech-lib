const mongoose = require("mongoose");

const communityLikeSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

communityLikeSchema.index(
  { post: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "CommunityLike",
  communityLikeSchema
);
