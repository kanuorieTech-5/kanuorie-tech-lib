const mongoose = require("mongoose");
const slugify = require("../helpers/slugify");

/* ==========================================
   LESSON SCHEMA
========================================== */
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },

    resources: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  }
);

/* ==========================================
   COURSE SCHEMA
========================================== */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    instructor: {
      type: String,
      default: "KanuorieTech",
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    language: {
      type: String,
      default: "English",
    },

    duration: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    premium: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    enrollments: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],

    outcomes: [
      {
        type: String,
        trim: true,
      },
    ],

    lessons: [lessonSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================
   GENERATE SLUG
========================================== */
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  next();
});

/* ==========================================
   INDEXES
========================================== */
courseSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

module.exports = mongoose.model("Course", courseSchema);