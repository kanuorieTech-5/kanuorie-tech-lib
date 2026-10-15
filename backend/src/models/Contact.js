const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // Contact details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    // General contact fields
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    inquiryType: {
      type: String,
      enum: [
        "General",
        "Web Development",
        "Mobile App",
        "Mobile App Development",
        "UI/UX Design",
        "Branding",
        "Software Development",
        "Support",
        "Partnership",
        "Investment",
        "Consulting",
        "Technology Consulting",
        "E-commerce Website",
        "Website Redesign",
        "API Integration",
        "Website Maintenance & Support",
        "Other",
      ],
      default: "General",
    },

    isServiceInquiry: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Service enquiry details
    service: {
      type: String,
      trim: true,
      default: "",
    },

    projectType: {
      type: String,
      trim: true,
      default: "",
    },

    budget: {
      type: String,
      trim: true,
      default: "",
    },

    timeline: {
      type: String,
      trim: true,
      default: "",
    },

    preferredContact: {
      type: String,
      enum: ["email", "whatsapp", "phone"],
      default: "email",
    },

    referenceUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    additionalRequirements: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    projectRequirements: {
      type: [String],
      default: [],
    },

    // Conditional answers based on selected service
    platform: {
      type: String,
      trim: true,
      default: "",
    },

    designType: {
      type: String,
      trim: true,
      default: "",
    },

    apiDetails: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    maintenanceNeeds: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    websiteType: {
      type: String,
      trim: true,
      default: "",
    },

    // Admin management
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "completed", "cancelled"],
      default: "new",
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    replied: {
      type: Boolean,
      default: false,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
contactSchema.index({ isRead: 1, createdAt: -1 });
contactSchema.index({ inquiryType: 1 });
contactSchema.index({ isServiceInquiry: 1, createdAt: -1 });
contactSchema.index({ isServiceInquiry: 1, status: 1 });

module.exports = mongoose.model("Contact", contactSchema);