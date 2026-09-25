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
  confirmPaymentSuccess,
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
   PAYMENT OVERVIEW
========================================== */

router.get("/", protect, getPaymentOverview);

/* ==========================================
   TRANSACTIONS
========================================== */

router.get("/transactions", protect, getTransactions);

/* ==========================================
   ORDERS
========================================== */

router.get("/orders", protect, getOrders);
router.get("/orders/:id", protect, getOrder);
router.post("/orders", protect, createNewOrder);
router.post("/orders/course", protect, createPremiumCourseOrder);
/* ==========================================
   PAYMENTS
========================================== */

router.post("/payments", protect, createNewPayment);
router.post("/payments/:id/success", protect, confirmPaymentSuccess);

/* ==========================================
   PAYMENT METHODS
========================================== */

router.get("/methods", protect, getPaymentMethods);
router.post("/methods", protect, addPaymentMethod);
router.delete("/methods/:id", protect, removePaymentMethod);

/* ==========================================
   BILLING
========================================== */

router.get("/billing", protect, getBillingProfile);
router.put("/billing", protect, updateBillingProfile);

/* ==========================================
   INVOICES
========================================== */

router.get("/invoices", protect, getInvoices);
router.get("/invoices/:id", protect, getInvoice);

module.exports = router;
