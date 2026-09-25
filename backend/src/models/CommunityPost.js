const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Post title is required."],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    content: {
      type: String,
      required: [true, "Post content is required."],
      trim: true,
      minlength: 3,
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: [
        "Announcements",
        "Questions & Help",
        "Web Development",
        "Career & Jobs",
        "Projects & Ideas",
      ],
      default: "Questions & Help",
      trim: true,
    },

    status: {
      type: String,
      enum: ["published", "hidden", "deleted"],
      default: "published",
      index: true,
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

communityPostSchema.index({
  status: 1,
  category: 1,
  createdAt: -1,
});

communityPostSchema.index({
  author: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "CommunityPost",
  communityPostSchema
);