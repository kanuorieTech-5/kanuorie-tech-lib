const mongoose = require("mongoose");
const createSlug = require("../helpers/slugify");

const productSchema = new mongoose.Schema(
  {
    /* ==========================================
       BASIC INFORMATION
    ========================================== */

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
      trim: true,
    },

    gallery: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ==========================================
       CATEGORY
    ========================================== */

    category: {
      type: String,
      enum: [
        "Development",
        "AI",
        "Database",
        "Design",
        "DevOps",
        "Productivity",
        "Business",
        "Cloud",
        "Security",
        "API",
        "Other",
      ],
      default: "Other",
      index: true,
    },

    /* ==========================================
       PRODUCT LINKS
    ========================================== */

    websiteUrl: {
      type: String,
      default: "",
      trim: true,
    },

    documentationUrl: {
      type: String,
      default: "",
      trim: true,
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    /* ==========================================
       PRICING
    ========================================== */

    pricingType: {
      type: String,
      enum: [
        "Free",
        "Freemium",
        "Paid",
        "Open Source",
      ],
      default: "Free",
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

    /* ==========================================
       CLASSIFICATION
    ========================================== */

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ==========================================
       PUBLISHING
    ========================================== */

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

    /* ==========================================
       ANALYTICS
    ========================================== */

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

    /* ==========================================
       OWNERSHIP / CURATION
    ========================================== */

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
   SEARCH INDEX
========================================== */

productSchema.index({
  name: "text",
  description: "text",
  excerpt: "text",
});

/* ==========================================
   FILTER / SORT INDEX
========================================== */

productSchema.index({
  featured: 1,
  category: 1,
  published: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Product", productSchema);