import API from "./axiosApi";

/* ==========================================
   PAYMENT OVERVIEW
========================================== */

export const getPaymentOverview = async () => {
  const { data } = await API.get("/payments");
  return data;
};

/* ==========================================
   TRANSACTIONS
========================================== */

export const getTransactions = async (params = {}) => {
  const { data } = await API.get("/payments/transactions", {
    params,
  });

  return data;
};

/* ==========================================
   ORDERS
========================================== */

export const getOrders = async (params = {}) => {
  const { data } = await API.get("/payments/orders", {
    params,
  });

  return data;
};

export const getOrder = async (id) => {
  const { data } = await API.get(`/payments/orders/${id}`);
  return data;
};

export const createOrder = async (orderData) => {
  const { data } = await API.post("/payments/orders", orderData);
  return data;
};

export const createPremiumCourseOrder = async (courseId) => {
  const { data } = await API.post("/payments/orders/course", {
    courseId,
  });

  return data;
};

/* ==========================================
   PAYMENTS
========================================== */

export const createPayment = async (paymentData) => {
  const { data } = await API.post(
    "/payments/payments",
    paymentData
  );

  return data;
};

/* ==========================================
   PAYSTACK COURSE CHECKOUT
========================================== */

export const initializePaystackCoursePayment = async (
  courseId,
  affiliateReferral = null
) => {
  const { data } = await API.post(
    "/payments/paystack/initialize",
    {
      courseId,
      affiliateReferral,
    }
  );

  return data;
};

export const verifyPaystackPayment = async (reference) => {
  const { data } = await API.get(
    `/payments/paystack/verify/${encodeURIComponent(reference)}`
  );

  return data;
};

/* ==========================================
   PAYMENT METHODS
========================================== */

export const getPaymentMethods = async () => {
  const { data } = await API.get("/payments/methods");
  return data;
};

export const addPaymentMethod = async (paymentMethod) => {
  const { data } = await API.post(
    "/payments/methods",
    paymentMethod
  );

  return data;
};

export const removePaymentMethod = async (id) => {
  const { data } = await API.delete(
    `/payments/methods/${id}`
  );

  return data;
};

/* ==========================================
   BILLING
========================================== */

export const getBillingProfile = async () => {
  const { data } = await API.get("/payments/billing");
  return data;
};

export const updateBillingProfile = async (billingData) => {
  const { data } = await API.put(
    "/payments/billing",
    billingData
  );

  return data;
};

/* ==========================================
   INVOICES
========================================== */

export const getInvoices = async (params = {}) => {
  const { data } = await API.get("/payments/invoices", {
    params,
  });

  return data;
};

export const getInvoice = async (id) => {
  const { data } = await API.get(
    `/payments/invoices/${id}`
  );

  return data;
};

/* ==========================================
   DEFAULT EXPORT
========================================== */

export default {
  getPaymentOverview,
  getTransactions,
  getOrders,
  getOrder,
  createOrder,
  createPremiumCourseOrder,
  createPayment,
  initializePaystackCoursePayment,
  verifyPaystackPayment,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getBillingProfile,
  updateBillingProfile,
  getInvoices,
  getInvoice,
};
