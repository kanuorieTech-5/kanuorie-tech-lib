const mongoose = require("mongoose");

/* ==========================================
   SAVED RESOURCE SCHEMA
========================================== */

const savedResourceSchema = new mongoose.Schema(
  {
    /* ========================================
       OWNER
    ======================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ========================================
       RESOURCE
       
       resourceId is stored as a STRING because
       resources can come from:
       - MongoDB courses
       - MongoDB books
       - Static external resources
    ======================================== */

    resourceId: {
      type: String,
      required: true,
      trim: true,
    },

    resourceType: {
      type: String,
      enum: ["course", "book", "external"],
      required: true,
      lowercase: true,
      trim: true,
    },

    /* ========================================
       SNAPSHOT DATA

       These fields allow the Library to display
       saved resources even if the original
       resource changes later.

       Course curriculum/modules are NOT stored
       here. Course progress remains in Progress.
    ======================================== */

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

    category: {
      type: String,
      default: "General",
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

/* ==========================================
   PREVENT DUPLICATE SAVES

   The same user can save the same resource
   only once.

   resourceType is included so that:
   course "123" and external resource "123"
   can both exist independently.
========================================== */

savedResourceSchema.index(
  {
    user: 1,
    resourceId: 1,
    resourceType: 1,
  },
  {
    unique: true,
  }
);

/* ==========================================
   DEFAULT SORTING

   Newest saved resources first.
========================================== */

savedResourceSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "SavedResource",
  savedResourceSchema
);