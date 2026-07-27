const mongoose = require("mongoose");
const createSlug = require("../helpers/slugify");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "Unknown",
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    pdf: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    preview: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
      },
    ],

    difficulty: {
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

    pages: {
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

    downloads: {
      type: Number,
      default: 0,
    },

    views: {
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    isbn: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   GENERATE SLUG
========================= */

bookSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createSlug(this.title);
  }

  next();
});

module.exports = mongoose.model("Book", bookSchema);