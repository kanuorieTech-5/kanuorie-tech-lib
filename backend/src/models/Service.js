const mongoose = require("mongoose");
const createSlug = require("../helpers/slugify");

const serviceSchema = new mongoose.Schema(
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

    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    technologies: [
      {
        type: String,
      },
    ],

    benefits: [
      {
        type: String,
      },
    ],

    price: {
      type: String,
      default: "",
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

serviceSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = createSlug(this.title);
  }

  next();
});

/* =========================
   INDEXES
========================= */

serviceSchema.index({
  featured: 1,
  active: 1,
  order: 1,
});

module.exports = mongoose.model(
  "Service",
  serviceSchema
);