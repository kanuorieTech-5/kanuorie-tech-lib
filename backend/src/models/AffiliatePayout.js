const mongoose = require("mongoose");

const affiliatePayoutSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "processing",
        "paid",
        "rejected",
        "cancelled",
      ],
      default: "requested",
      index: true,
    },

    payoutMethod: {
      type: String,
      enum: [
        "bank_transfer",
        "paypal",
        "other",
      ],
      required: true,
    },

    payoutDetails: {
      accountName: {
        type: String,
        trim: true,
        default: "",
      },

      accountNumber: {
        type: String,
        trim: true,
        default: "",
      },

      bankName: {
        type: String,
        trim: true,
        default: "",
      },

      bankCode: {
        type: String,
        trim: true,
        default: "",
      },

      paypalEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
    },

    reference: {
      type: String,
      trim: true,
      default: "",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

affiliatePayoutSchema.index({
  affiliate: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "AffiliatePayout",
  affiliatePayoutSchema
);
