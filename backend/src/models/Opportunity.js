const mongoose = require("mongoose");
const slugify = require("../helpers/slugify");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Opportunity title is required."],
      trim: true,
      maxlength: 180,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    organization: {
      type: String,
      required: [true, "Organization is required."],
      trim: true,
      maxlength: 180,
    },

    type: {
      type: String,
      enum: [
        "job",
        "internship",
        "scholarship",
        "grant",
        "fellowship",
        "event",
        "volunteer",
        "competition",
        "other",
      ],
      default: "other",
      required: true,
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    location: {
      type: String,
      trim: true,
      default: "Not specified",
    },

    workMode: {
      type: String,
      enum: ["remote", "onsite", "hybrid", "not-applicable"],
      default: "not-applicable",
    },

    description: {
      type: String,
      required: [true, "Opportunity description is required."],
      trim: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    applicationUrl: {
      type: String,
      trim: true,
      default: "",
    },

    applicationEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    deadline: {
      type: Date,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    sourceUrl: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

opportunitySchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }

  next();
});

opportunitySchema.index({
  title: "text",
  organization: "text",
  description: "text",
});

opportunitySchema.index({
  published: 1,
  status: 1,
  deadline: 1,
});

module.exports = mongoose.model("Opportunity", opportunitySchema);