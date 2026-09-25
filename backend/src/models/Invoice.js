const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
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

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
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
        "issued",
        "paid",
        "void",
        "refunded",
      ],
      default: "issued",
      index: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    receiptUrl: {
      type: String,
      trim: true,
      default: "",
    },

    invoiceUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Invoice",
  invoiceSchema
);
