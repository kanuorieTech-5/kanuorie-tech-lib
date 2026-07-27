const mongoose = require("mongoose");
const createSlug = require("../helpers/slugify");

const projectSchema = new mongoose.Schema(
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

    image: {
      type: String,
      default: "",
    },

    gallery: [
      {
        type: String,
      },
    ],

    technologies: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      default: "Web Development",
    },

    client: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    liveDemo: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   GENERATE SLUG
========================= */

projectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createSlug(this.title);
  }

  next();
});

/* =========================
   INDEXES
========================= */

projectSchema.index({
  featured: 1,
  category: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Project",
  projectSchema
);