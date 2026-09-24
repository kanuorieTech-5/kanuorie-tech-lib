const mongoose = require("mongoose");

/* ==========================================
   COMMUNITY POST SCHEMA
========================================== */

const communityPostSchema = new mongoose.Schema(
  {
    /* ========================================
       AUTHOR
    ======================================== */

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ========================================
       POST CONTENT
    ======================================== */

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

    /* ========================================
       MODERATION
    ======================================== */

    status: {
      type: String,
      enum: ["published", "hidden", "deleted"],
      default: "published",
      index: true,
    },

    /* ========================================
       ENGAGEMENT
       
       These will be expanded when we add
       likes/comments.
    ======================================== */

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
  },
  {
    timestamps: true,
  }
);

/* ==========================================
   INDEXES
========================================== */

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