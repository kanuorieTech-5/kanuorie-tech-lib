const mongoose = require("mongoose");

const communityCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: [true, "Comment content is required."],
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["published", "hidden", "deleted"],
      default: "published",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

communityCommentSchema.index({
  post: 1,
  status: 1,
  createdAt: 1,
});

module.exports = mongoose.model(
  "CommunityComment",
  communityCommentSchema
);
