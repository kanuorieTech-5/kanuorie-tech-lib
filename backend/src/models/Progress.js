const mongoose = require("mongoose");

/* ==========================================
   NOTE SCHEMA
========================================== */
const noteSchema = new mongoose.Schema(
  {
    lesson: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================
   PROGRESS SCHEMA
========================================== */
const progressSchema = new mongoose.Schema(
  {
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

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "completed",
      ],
      default: "not_started",
    },

    currentLesson: {
      type: Number,
      default: 0,
    },

    completedLessons: [
      {
        type: Number,
      },
    ],

    bookmarkedLessons: [
      {
        type: Number,
      },
    ],

    watchTime: {
      type: Number,
      default: 0,
    },

    quizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    notes: [noteSchema],

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastAccessed: {
      type: Date,
      default: Date.now,
    },

    lastProgressUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================
   ONE RECORD PER USER PER COURSE
========================================== */
progressSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

/* ==========================================
   UPDATE STATUS AUTOMATICALLY
========================================== */
progressSchema.pre("save", function (next) {
  this.lastProgressUpdate = new Date();

  this.percentage = Math.min(
    Math.max(this.percentage, 0),
    100
  );

  if (this.percentage >= 100) {
    this.completed = true;
    this.status = "completed";

    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else if (this.percentage > 0) {
    this.completed = false;
    this.status = "in_progress";
    this.completedAt = null;
  } else {
    this.completed = false;
    this.status = "not_started";
    this.completedAt = null;
  }

  next();
});

module.exports = mongoose.model(
  "Progress",
  progressSchema
);