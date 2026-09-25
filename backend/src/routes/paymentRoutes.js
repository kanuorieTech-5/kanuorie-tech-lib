const express = require("express");
const protect = require("../middleware/auth");

const {
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
} = require("../controllers/paymentController");

const router = express.Router();

/* ==========================================
   PAYSTACK WEBHOOK
   IMPORTANT:
   This route must NOT use authentication.
   Paystack authenticates the webhook using
   x-paystack-signature.
========================================== */

router.post("/paystack/webhook", paystackWebhook);

/* ==========================================
   PAYSTACK CHECKOUT
========================================== */

router.post(
  "/paystack/initialize",
  protect,
  initializePaystackCoursePayment
);

router.get(
  "/paystack/verify/:reference",
  protect,
  verifyPaystackPayment
);

/* ==========================================
   PAYMENT OVERVIEW
========================================== */

router.get("/", protect, getPaymentOverview);

/* ==========================================
   TRANSACTIONS
========================================== */

router.get(
  "/transactions",
  protect,
  getTransactions
);

/* ==========================================
   ORDERS
========================================== */

router.get(
  "/orders",
  protect,
  getOrders
);

router.get(
  "/orders/:id",
  protect,
  getOrder
);

router.post(
  "/orders",
  protect,
  createNewOrder
);

router.post(
  "/orders/course",
  protect,
  createPremiumCourseOrder
);

/* ==========================================
   PAYMENT RECORDS
========================================== */

router.post(
  "/payments",
  protect,
  createNewPayment
);

/*
  IMPORTANT:
  The old development-only endpoint:

  POST /payments/:id/success

  has intentionally been removed.

  Payment success must now come from Paystack
  verification/webhook processing.
*/

/* ==========================================
   PAYMENT METHODS
========================================== */

router.get(
  "/methods",
  protect,
  getPaymentMethods
);

router.post(
  "/methods",
  protect,
  addPaymentMethod
);

router.delete(
  "/methods/:id",
  protect,
  removePaymentMethod
);

/* ==========================================
   BILLING
========================================== */

router.get(
  "/billing",
  protect,
  getBillingProfile
);

router.put(
  "/billing",
  protect,
  updateBillingProfile
);

/* ==========================================
   INVOICES
========================================== */

router.get(
  "/invoices",
  protect,
  getInvoices
);

router.get(
  "/invoices/:id",
  protect,
  getInvoice
);

module.exports = router;