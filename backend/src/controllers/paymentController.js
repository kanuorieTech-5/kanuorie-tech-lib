const asyncHandler = require("express-async-handler");

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const PaymentMethod = require("../models/PaymentMethod");
const BillingProfile = require("../models/BillingProfile");
const Invoice = require("../models/Invoice");

const {
  createOrder,
  createCourseOrder,
  createPaymentRecord,
  markPaymentSuccessful,
} = require("../services/paymentService");

/* ==========================================
   HELPERS
========================================== */

const getUserId = (req) => req.user?._id || req.user?.id;

const formatOrder = (order) => ({
  _id: order._id,
  orderNumber: order.orderNumber,
  items: order.items,
  subtotal: order.subtotal,
  discount: order.discount,
  total: order.total,
  currency: order.currency,
  status: order.status,
  paymentProvider: order.paymentProvider,
  paymentReference: order.paymentReference,
  paidAt: order.paidAt,
  createdAt: order.createdAt,
});

/* ==========================================
   PAYMENT OVERVIEW
========================================== */

const getPaymentOverview = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const [orders, payments, invoiceCount] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    Invoice.countDocuments({ user: userId }),
  ]);

  const totals = await Order.aggregate([
    {
      $match: {
        user: userId,
        status: {
          $in: ["paid", "partially_refunded"],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$total" },
        orderCount: { $sum: 1 },
      },
    },
  ]);

  const summary = totals[0] || {
    totalSpent: 0,
    orderCount: 0,
  };

  return res.json({
    success: true,
    data: {
      totalSpent: summary.totalSpent,
      orderCount: summary.orderCount,
      invoiceCount,
      recentOrders: orders.map(formatOrder),
      recentPayments: payments,
    },
  });
});

/* ==========================================
   TRANSACTIONS
========================================== */

const getTransactions = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.query.limit) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find({ user: userId })
      .populate("order", "orderNumber items total currency status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Payment.countDocuments({ user: userId }),
  ]);

  return res.json({
    success: true,
    data: payments,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/* ==========================================
   ORDERS
========================================== */

const getOrders = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.query.limit) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments({ user: userId }),
  ]);

  return res.json({
    success: true,
    data: orders.map(formatOrder),
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const order = await Order.findOne({
    _id: req.params.id,
    user: userId,
  }).lean();

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  return res.json({
    success: true,
    data: formatOrder(order),
  });
});

/* ==========================================
   CREATE PREMIUM COURSE ORDER
========================================== */

const createPremiumCourseOrder =
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const {
      courseId,
      affiliateReferral,
    } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const result = await createCourseOrder({
      userId,
      courseId,
      affiliateReferral:
        affiliateReferral || null,
    });

    return res.status(201).json({
      success: true,
      message:
        "Premium course order created successfully.",
      data: {
        order: formatOrder(result.order),
        course: {
          _id: result.course._id,
          title: result.course.title,
          premium: result.course.premium,
          price: result.course.price,
          currency: result.course.currency,
        },
      },
    });
  });

/* ==========================================
   CREATE ORDER
========================================== */

const createNewOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const { items, currency, discount, affiliateReferral } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one order item is required.",
    });
  }

  const order = await createOrder({
    userId,
    items,
    currency,
    discount,
    affiliateReferral: affiliateReferral || null,
  });

  return res.status(201).json({
    success: true,
    message: "Order created successfully.",
    data: formatOrder(order),
  });
});

/* ==========================================
   CREATE PAYMENT RECORD
========================================== */

const createNewPayment = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    orderId,
    provider,
    providerReference,
    paymentMethod,
    metadata,
  } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required.",
    });
  }

  if (!provider) {
    return res.status(400).json({
      success: false,
      message: "Payment provider is required.",
    });
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  if (order.status === "paid") {
    return res.status(400).json({
      success: false,
      message: "This order has already been paid.",
    });
  }

  const payment = await createPaymentRecord({
    userId,
    orderId: order._id,
    amount: order.total,
    currency: order.currency,
    provider,
    providerReference,
    paymentMethod,
    metadata,
  });

  return res.status(201).json({
    success: true,
    message: "Payment record created.",
    data: payment,
  });
});

/* ==========================================
   PAYMENT SUCCESS
========================================== */

const confirmPaymentSuccess = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const payment = await Payment.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found.",
    });
  }

  if (payment.status === "successful") {
    const order = await Order.findById(payment.order);
    const invoice = await Invoice.findOne({ payment: payment._id });

    return res.json({
      success: true,
      message: "Payment was already confirmed.",
      data: {
        payment,
        order,
        invoice,
      },
    });
  }

  const result = await markPaymentSuccessful({
    payment,
  });

  return res.json({
    success: true,
    message: "Payment confirmed successfully.",
    data: result,
  });
});

/* ==========================================
   PAYMENT METHODS
========================================== */

const getPaymentMethods = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const methods = await PaymentMethod.find({
    user: userId,
    isActive: true,
  })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();

  return res.json({
    success: true,
    data: methods,
  });
});

const addPaymentMethod = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    provider,
    type,
    brand,
    last4,
    expiryMonth,
    expiryYear,
    providerMethodId,
    providerCustomerId,
    isDefault,
  } = req.body;

  if (!provider || !type) {
    return res.status(400).json({
      success: false,
      message: "Provider and payment method type are required.",
    });
  }

  if (isDefault) {
    await PaymentMethod.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );
  }

  const method = await PaymentMethod.create({
    user: userId,
    provider,
    type,
    brand,
    last4,
    expiryMonth,
    expiryYear,
    providerMethodId,
    providerCustomerId,
    isDefault: Boolean(isDefault),
  });

  return res.status(201).json({
    success: true,
    message: "Payment method added successfully.",
    data: method,
  });
});

const removePaymentMethod = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const method = await PaymentMethod.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!method) {
    return res.status(404).json({
      success: false,
      message: "Payment method not found.",
    });
  }

  method.isActive = false;
  method.isDefault = false;

  await method.save();

  return res.json({
    success: true,
    message: "Payment method removed successfully.",
  });
});

/* ==========================================
   BILLING PROFILE
========================================== */

const getBillingProfile = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const profile = await BillingProfile.findOne({
    user: userId,
  }).lean();

  return res.json({
    success: true,
    data: profile,
  });
});

const updateBillingProfile = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const allowedFields = [
    "fullName",
    "companyName",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
    "taxId",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const profile = await BillingProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: updates,
      $setOnInsert: {
        user: userId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  ).lean();

  return res.json({
    success: true,
    message: "Billing information updated successfully.",
    data: profile,
  });
});

/* ==========================================
   INVOICES
========================================== */

const getInvoices = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.query.limit) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find({ user: userId })
      .populate("order", "orderNumber items total currency")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Invoice.countDocuments({ user: userId }),
  ]);

  return res.json({
    success: true,
    data: invoices,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getInvoice = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const invoice = await Invoice.findOne({
    _id: req.params.id,
    user: userId,
  })
    .populate("order")
    .populate("payment")
    .lean();

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: "Invoice not found.",
    });
  }

  return res.json({
    success: true,
    data: invoice,
  });
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  getPaymentOverview,
  getTransactions,
  getOrders,
  getOrder,
  createNewOrder,
  createPremiumCourseOrder,
  createNewPayment,
  confirmPaymentSuccess,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getBillingProfile,
  updateBillingProfile,
  getInvoices,
  getInvoice,
};
