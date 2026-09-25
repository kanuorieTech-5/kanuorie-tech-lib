const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    providerReference: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
        "pending",
        "successful",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      trim: true,
      default: "",
    },

    providerCustomerReference: {
      type: String,
      trim: true,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  user: 1,
  createdAt: -1,
});

paymentSchema.index({
  order: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);
