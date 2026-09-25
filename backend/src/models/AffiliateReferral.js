const mongoose = require("mongoose");

const affiliateReferralSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
      index: true,
    },

    referralCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "clicked",
        "registered",
        "qualified",
        "converted",
        "rejected",
      ],
      default: "clicked",
      index: true,
    },

    commissionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commissionCurrency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    commissionStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "paid",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    convertedAt: {
      type: Date,
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

affiliateReferralSchema.index({
  affiliate: 1,
  createdAt: -1,
});

affiliateReferralSchema.index({
  affiliate: 1,
  status: 1,
});

affiliateReferralSchema.index({
  affiliate: 1,
  commissionStatus: 1,
});

module.exports = mongoose.model(
  "AffiliateReferral",
  affiliateReferralSchema
);
