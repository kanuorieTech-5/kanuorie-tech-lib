const mongoose = require("mongoose");
const createSlug = require("../helpers/slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
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

    excerpt: {
      type: String,
      default: "",
      maxlength: 250,
      trim: true,
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

    category: {
      type: String,
      enum: [
        "Template",
        "Software",
        "Course",
        "Ebook",
        "Service",
        "API",
        "Other",
      ],
      default: "Other",
      index: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    published: {
      type: Boolean,
      default: true,
      index: true,
    },

    downloadUrl: {
      type: String,
      default: "",
      trim: true,
    },

    demoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },

    views: {
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

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = createSlug(this.name);
  }

  next();
});

/* ==========================================
   INDEXES
========================================== */

productSchema.index({
  name: "text",
  description: "text",
  excerpt: "text",
});

productSchema.index({
  featured: 1,
  category: 1,
  published: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Product", productSchema);