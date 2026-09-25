const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "card",
        "bank",
        "mobile_money",
        "paypal",
        "other",
      ],
      required: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    last4: {
      type: String,
      trim: true,
      maxlength: 4,
      default: "",
    },

    expiryMonth: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },

    expiryYear: {
      type: Number,
      min: 2000,
      default: null,
    },

    providerMethodId: {
      type: String,
      trim: true,
      default: "",
    },

    providerCustomerId: {
      type: String,
      trim: true,
      default: "",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentMethodSchema.index({
  user: 1,
  isActive: 1,
});

module.exports = mongoose.model(
  "PaymentMethod",
  paymentMethodSchema
);
