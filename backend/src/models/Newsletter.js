const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },

    subscribed: {
      type: Boolean,
      default: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: [
        "website",
        "homepage",
        "blog",
        "contact",
        "landing-page",
        "admin",
        "other",
      ],
      default: "website",
    },

    verificationToken: {
      type: String,
      default: "",
    },

    unsubscribeToken: {
      type: String,
      default: "",
    },

    unsubscribedAt: {
      type: Date,
      default: null,
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */

// newsletterSchema.index({
//   email: 1,
// });

newsletterSchema.index({
  subscribed: 1,
  verified: 1,
});

module.exports = mongoose.model(
  "Newsletter",
  newsletterSchema
);