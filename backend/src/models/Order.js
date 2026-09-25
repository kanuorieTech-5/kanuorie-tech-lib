const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: [
        "course",
        "product",
        "book",
        "service",
      ],
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
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
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,
        message: "An order must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
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
        "paid",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
      index: true,
    },

    paymentProvider: {
      type: String,
      trim: true,
      default: "",
    },

    paymentReference: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    affiliateReferral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateReferral",
      default: null,
      index: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Order",
  orderSchema
);
