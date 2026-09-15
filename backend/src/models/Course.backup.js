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
      trim: true,
    },

    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },

    resources: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: true,
  }
);

/* ==========================================
   MODULE SCHEMA
========================================== */

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },

    lessons: {
      type: [lessonSchema],
      default: [],
    },
  },
  {
    _id: true,
  }
);

/* ==========================================
   COURSE SCHEMA
========================================== */

const courseSchema = new mongoose.Schema(
  {
    /* ----------------------------------------
       BASIC INFORMATION
    ---------------------------------------- */

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
      trim: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    instructor: {
      type: String,
      default: "KanuorieTech",
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    language: {
      type: String,
      default: "English",
      trim: true,
    },

    /*
     * Course duration is stored in HOURS.
     *
     * Example:
     * 20 = 20 hours
     */
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------
       PUBLISHING & SETTINGS
    ---------------------------------------- */

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

    /* ----------------------------------------
       COURSE STATISTICS
    ---------------------------------------- */

    enrollments: {
      type: Number,
      default: 0,
      min: 0,
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
      min: 0,
    },

    /* ----------------------------------------
       COURSE METADATA
    ---------------------------------------- */

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

    /* ----------------------------------------
       COURSE CURRICULUM

       Course
         └── Modules
               └── Lessons
    ---------------------------------------- */

    modules: {
      type: [moduleSchema],
      default: [],
    },

    /* ----------------------------------------
       COURSE OWNER / CREATOR
    ---------------------------------------- */

    createdBy: {
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

/* ==========================================
   GENERATE SLUG BEFORE SAVE
========================================== */

courseSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }

  next();
});

/* ==========================================
   GENERATE SLUG BEFORE UPDATE
========================================== */

courseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) {
    return next();
  }

  /*
   * Support both:
   *
   * { title: "New Course" }
   *
   * and:
   *
   * { $set: { title: "New Course" } }
   */

  const title =
    update.title ||
    (update.$set && update.$set.title);

  if (title) {
    const newSlug = slugify(title);

    if (update.$set) {
      update.$set.slug = newSlug;
    } else {
      update.slug = newSlug;
    }
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

/* ==========================================
   EXPORT MODEL
========================================== */

module.exports = mongoose.model("Course", courseSchema);