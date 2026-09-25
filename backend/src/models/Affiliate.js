const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "suspended",
        "inactive",
      ],
      default: "pending",
      index: true,
    },

    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    payoutMethod: {
      type: String,
      enum: [
        "bank_transfer",
        "paypal",
        "other",
      ],
      default: null,
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

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

affiliateSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Affiliate",
  affiliateSchema
);
