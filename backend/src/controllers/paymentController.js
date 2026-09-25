const asyncHandler = require("express-async-handler");

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const PaymentMethod = require("../models/PaymentMethod");
const BillingProfile = require("../models/BillingProfile");
const Invoice = require("../models/Invoice");
const User = require("../models/User");

const {
  createOrder,
  createCourseOrder,
  createPaymentRecord,
  markPaymentSuccessful,
  generatePaymentReference,
  initializePaystackTransaction,
  verifyPaystackTransaction,
  finalizePaystackPayment,
} = require("../services/paymentService");

const getUserId = (req) => req.user?._id || req.user?.id;

/* ==========================================
   HELPERS
========================================== */

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

const getPaystackCallbackUrl = () => {
  if (process.env.PAYSTACK_CALLBACK_URL) {
    return process.env.PAYSTACK_CALLBACK_URL;
  }

  const clientUrl = (process.env.CLIENT_URL || "")
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");

  if (!clientUrl) {
    throw new Error(
      "PAYSTACK_CALLBACK_URL or CLIENT_URL must be configured."
    );
  }

  return `${clientUrl}/payments/paystack/callback`;
};

/* ==========================================
   PAYMENT OVERVIEW
========================================== */

const getPaymentOverview = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const [orders, payments, invoices] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }),
    Payment.find({ user: userId }).sort({ createdAt: -1 }),
    Invoice.find({ user: userId }).sort({ createdAt: -1 }),
  ]);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "successful"
  );

  const totalPaid = successfulPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return res.json({
    success: true,
    data: {
      totalOrders: orders.length,
      totalPayments: payments.length,
      totalInvoices: invoices.length,
      successfulPayments: successfulPayments.length,
      totalPaid,
      currency: successfulPayments[0]?.currency || "NGN",
    },
  });
});

/* ==========================================
   TRANSACTIONS
========================================== */

const getTransactions = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    status,
    provider,
    page = 1,
    limit = 20,
  } = req.query;

  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  if (provider) {
    query.provider = provider;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("order", "orderNumber items total currency status")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Payment.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: {
      transactions: payments,
      payments,
    },
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/* ==========================================
   ORDERS
========================================== */

const getOrders = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    status,
    page = 1,
    limit = 20,
  } = req.query;

  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Order.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: {
      orders: orders.map(formatOrder),
    },
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const order = await Order.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  return res.json({
    success: true,
    data: {
      order: formatOrder(order),
    },
  });
});

/* ==========================================
   CREATE PREMIUM COURSE ORDER
========================================== */

const createPremiumCourseOrder = asyncHandler(async (req, res) => {
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
    affiliateReferral: affiliateReferral || null,
  });

  return res.status(201).json({
    success: true,
    message: "Premium course order created successfully.",
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
   CREATE GENERAL ORDER
========================================== */

const createNewOrder = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    items,
    currency,
    discount,
    affiliateReferral,
  } = req.body;

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
   PAYSTACK — INITIALIZE COURSE PAYMENT
========================================== */

const initializePaystackCoursePayment = asyncHandler(
  async (req, res) => {
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

    const user = await User.findById(userId).select(
      "email firstName lastName"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const result = await createCourseOrder({
      userId,
      courseId,
      affiliateReferral: affiliateReferral || null,
    });

    const order = result.order;
    const course = result.course;

    const reference = generatePaymentReference();

    let payment;

    try {
      payment = await createPaymentRecord({
        userId,
        orderId: order._id,
        amount: order.total,
        currency: order.currency,
        provider: "paystack",
        providerReference: reference,
        paymentMethod: "paystack",
        metadata: {
          orderId: String(order._id),
          courseId: String(course._id),
          userId: String(userId),
          customerEmail: user.email,
          customerName: [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" "),
        },
      });

      order.paymentProvider = "paystack";
      order.paymentReference = reference;
      await order.save();

      const paystack = await initializePaystackTransaction({
        email: user.email,
        amount: order.total,
        currency: order.currency,
        reference,
        callbackUrl: getPaystackCallbackUrl(),
        metadata: {
          orderId: String(order._id),
          paymentId: String(payment._id),
          courseId: String(course._id),
          userId: String(userId),
          customerEmail: user.email,
          customerName: [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" "),
        },
      });

      payment.metadata = {
        ...(payment.metadata || {}),
        paystack: {
          authorizationUrl: paystack.authorization_url,
          accessCode: paystack.access_code,
          initializedAt: new Date(),
        },
      };

      await payment.save();

      return res.status(201).json({
        success: true,
        message:
          "Secure Paystack checkout initialized successfully.",
        data: {
          order: formatOrder(order),
          payment: {
            _id: payment._id,
            reference: payment.providerReference,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
          },
          paystack: {
            authorization_url: paystack.authorization_url,
            access_code: paystack.access_code,
            reference: paystack.reference,
          },
        },
      });
    } catch (error) {
      if (payment) {
        payment.status = "failed";
        payment.failedAt = new Date();
        payment.failureReason =
          error?.message || "Paystack initialization failed.";

        await payment.save().catch(() => {});
      }

      order.status = "failed";
      await order.save().catch(() => {});

      throw error;
    }
  }
);

/* ==========================================
   PAYSTACK — VERIFY PAYMENT
========================================== */

const verifyPaystackPayment = asyncHandler(
  async (req, res) => {
    const userId = getUserId(req);

    const reference = String(req.params.reference || "").trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const paystackTransaction =
      await verifyPaystackTransaction(reference);

    const result = await finalizePaystackPayment({
      reference,
      paystackTransaction,
      userId,
    });

    return res.json({
      success: true,
      message: "Paystack payment verified successfully.",
      data: result,
    });
  }
);

/* ==========================================
   PAYSTACK — WEBHOOK
========================================== */

const paystackWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-paystack-signature"];

  if (!signature) {
    return res.status(401).json({
      success: false,
      message: "Missing Paystack signature.",
    });
  }

  const rawBody = req.rawBody;

  if (!rawBody) {
    return res.status(400).json({
      success: false,
      message: "Webhook raw body is unavailable.",
    });
  }

  const {
    verifyPaystackWebhookSignature,
    verifyPaystackTransaction,
  } = require("../services/paymentService");

  const validSignature =
    verifyPaystackWebhookSignature(rawBody, signature);

  if (!validSignature) {
    return res.status(401).json({
      success: false,
      message: "Invalid Paystack webhook signature.",
    });
  }

  let payload;

  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook payload.",
    });
  }

  if (payload.event !== "charge.success") {
    return res.status(200).json({
      success: true,
      received: true,
      processed: false,
    });
  }

  const reference = payload?.data?.reference;

  if (!reference) {
    return res.status(200).json({
      success: true,
      received: true,
      processed: false,
    });
  }

  const paystackTransaction =
    await verifyPaystackTransaction(reference);

  try {
    const result = await finalizePaystackPayment({
      reference,
      paystackTransaction,
      userId: null,
    });

    return res.status(200).json({
      success: true,
      received: true,
      processed: true,
      data: {
        paymentId: result.payment?._id || null,
        orderId: result.order?._id || null,
      },
    });
  } catch (error) {
    /*
      Paystack retries failed webhook deliveries.
      Returning a non-2xx response allows Paystack to retry
      when local processing fails.
    */
    throw error;
  }
});

/* ==========================================
   PAYMENT METHODS
========================================== */

const getPaymentMethods = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const methods = await PaymentMethod.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return res.json({
    success: true,
    data: {
      methods,
    },
  });
});

const addPaymentMethod = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    type,
    provider,
    providerCustomerReference,
    label,
    last4,
    expiryMonth,
    expiryYear,
    isDefault,
  } = req.body;

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Payment method type is required.",
    });
  }

  const paymentMethod = await PaymentMethod.create({
    user: userId,
    type,
    provider,
    providerCustomerReference,
    label,
    last4,
    expiryMonth,
    expiryYear,
    isDefault: Boolean(isDefault),
  });

  return res.status(201).json({
    success: true,
    message: "Payment method added successfully.",
    data: paymentMethod,
  });
});

const removePaymentMethod = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const paymentMethod = await PaymentMethod.findOneAndDelete({
    _id: req.params.id,
    user: userId,
  });

  if (!paymentMethod) {
    return res.status(404).json({
      success: false,
      message: "Payment method not found.",
    });
  }

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
  });

  return res.json({
    success: true,
    data: {
      billingProfile: profile,
    },
  });
});

const updateBillingProfile = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const profile = await BillingProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        ...req.body,
        user: userId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return res.json({
    success: true,
    message: "Billing profile updated successfully.",
    data: {
      billingProfile: profile,
    },
  });
});

/* ==========================================
   INVOICES
========================================== */

const getInvoices = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  const {
    status,
    page = 1,
    limit = 20,
  } = req.query;

  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate(
        "order",
        "orderNumber items total currency status"
      )
      .populate(
        "payment",
        "provider providerReference amount currency status paidAt"
      )
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Invoice.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: {
      invoices,
    },
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
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
    .populate("payment");

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: "Invoice not found.",
    });
  }

  return res.json({
    success: true,
    data: {
      invoice,
    },
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

  initializePaystackCoursePayment,
  verifyPaystackPayment,
  paystackWebhook,

  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getBillingProfile,
  updateBillingProfile,
  getInvoices,
  getInvoice,
};