const crypto = require("crypto");

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

const {
  enrollUserInCourse,
} = require("./courseEnrollmentService");

/* ==========================================
   CONSTANTS
========================================== */

const PAYSTACK_API_URL =
  "https://api.paystack.co";

/* ==========================================
   GENERATE ORDER NUMBER
========================================== */

const generateOrderNumber = () => {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `KT-${timestamp}-${random}`;
};

/* ==========================================
   GENERATE INVOICE NUMBER
========================================== */

const generateInvoiceNumber = () => {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase();

  return `INV-${timestamp}-${random}`;
};

/* ==========================================
   GENERATE PAYMENT REFERENCE
========================================== */

const generatePaymentReference = () => {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `PAY-${timestamp}-${random}`;
};

/* ==========================================
   CREATE ORDER
   SERVER-TRUSTED PRICING
========================================== */

const createOrder = async ({
  userId,
  items,
  currency = "USD",
  discount = 0,
  affiliateReferral = null,
}) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "At least one order item is required."
    );
  }

  const normalizedItems = [];

  for (const item of items) {
    const quantity = Math.max(
      Number(item.quantity) || 1,
      1
    );

    if (!item.itemType) {
      throw new Error(
        "Order item type is required."
      );
    }

    if (!item.itemId) {
      throw new Error(
        "Order item ID is required."
      );
    }

    /* ----------------------------------------
       COURSE
    ---------------------------------------- */

    if (item.itemType === "course") {
      const course = await Course.findById(
        item.itemId
      );

      if (!course) {
        throw new Error(
          "Course not found."
        );
      }

      if (!course.published) {
        throw new Error(
          "This course is not currently available."
        );
      }

      if (!course.premium) {
        throw new Error(
          "This course does not require payment."
        );
      }

      const unitPrice = Math.max(
        Number(course.price) || 0,
        0
      );

      if (unitPrice <= 0) {
        throw new Error(
          "This premium course does not have a valid price."
        );
      }

      normalizedItems.push({
        itemType: "course",
        itemId: course._id,
        title: course.title,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        currency:
          course.currency || currency,
      });

      continue;
    }

    /* ----------------------------------------
       OTHER ORDER ITEMS
    ---------------------------------------- */

    const unitPrice = Math.max(
      Number(item.unitPrice) || 0,
      0
    );

    normalizedItems.push({
      itemType: item.itemType,
      itemId: item.itemId,
      title: item.title,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      currency,
    });
  }

  const subtotal = normalizedItems.reduce(
    (total, item) =>
      total + item.totalPrice,
    0
  );

  const safeDiscount = Math.min(
    Math.max(Number(discount) || 0, 0),
    subtotal
  );

  const total =
    subtotal - safeDiscount;

  return Order.create({
    orderNumber: generateOrderNumber(),
    user: userId,
    items: normalizedItems,
    subtotal,
    discount: safeDiscount,
    total,
    currency,
    affiliateReferral,
  });
};

/* ==========================================
   CREATE PAYMENT RECORD
========================================== */

const createPaymentRecord = async ({
  userId,
  orderId,
  amount,
  currency = "USD",
  provider,
  providerReference,
  paymentMethod = "",
  metadata = {},
}) => {
  return Payment.create({
    user: userId,
    order: orderId,
    amount,
    currency,
    provider,
    providerReference:
      providerReference ||
      generatePaymentReference(),
    paymentMethod,
    metadata,
  });
};

/* ==========================================
   CREATE COURSE ORDER
   SERVER-TRUSTED COURSE PRICING
========================================== */

const createCourseOrder = async ({
  userId,
  courseId,
  affiliateReferral = null,
}) => {
  if (!courseId) {
    throw new Error(
      "Course ID is required."
    );
  }

  const course = await Course.findById(
    courseId
  );

  if (!course) {
    throw new Error("Course not found.");
  }

  if (!course.published) {
    throw new Error(
      "This course is not currently available."
    );
  }

  if (!course.premium) {
    throw new Error(
      "This course is free. Use the normal enrollment flow."
    );
  }

  const existingProgress =
    await Progress.findOne({
      user: userId,
      course: course._id,
    });

  if (existingProgress) {
    const error = new Error(
      "You are already enrolled in this course."
    );

    error.statusCode = 409;

    throw error;
  }

  const price = Math.max(
    Number(course.price) || 0,
    0
  );

  if (price <= 0) {
    throw new Error(
      "This premium course does not have a valid price."
    );
  }

  const currency = (
    course.currency || "NGN"
  ).toUpperCase();

  if (currency !== "NGN") {
    throw new Error(
      "Paystack course checkout currently supports NGN courses only."
    );
  }

  const order = await createOrder({
    userId,
    items: [
      {
        itemType: "course",
        itemId: course._id,
        quantity: 1,
      },
    ],
    currency,
    discount: 0,
    affiliateReferral,
  });

  return {
    order,
    course,
  };
};

/* ==========================================
   INITIALIZE PAYSTACK TRANSACTION
========================================== */

const initializePaystackTransaction = async ({
  email,
  amount,
  currency,
  reference,
  callbackUrl,
  metadata = {},
}) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured."
    );
  }

  const response = await fetch(
    `${PAYSTACK_API_URL}/transaction/initialize`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        amount: String(
          Math.round(Number(amount) * 100)
        ),
        currency,
        reference,
        callback_url: callbackUrl,
        metadata,
      }),
    }
  );

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error(
      "Paystack returned an invalid response."
    );
  }

  if (
    !response.ok ||
    !payload?.status
  ) {
    throw new Error(
      payload?.message ||
        "Unable to initialize Paystack transaction."
    );
  }

  if (
    !payload?.data?.authorization_url ||
    !payload?.data?.reference
  ) {
    throw new Error(
      "Paystack did not return a valid checkout URL."
    );
  }

  return payload.data;
};

/* ==========================================
   VERIFY PAYSTACK TRANSACTION
========================================== */

const verifyPaystackTransaction =
  async (reference) => {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured."
      );
    }

    if (!reference) {
      throw new Error(
        "Paystack transaction reference is required."
      );
    }

    const response = await fetch(
      `${PAYSTACK_API_URL}/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    let payload;

    try {
      payload = await response.json();
    } catch {
      throw new Error(
        "Paystack returned an invalid verification response."
      );
    }

    if (
      !response.ok ||
      !payload?.status
    ) {
      throw new Error(
        payload?.message ||
          "Unable to verify Paystack transaction."
      );
    }

    return payload.data;
  };

/* ==========================================
   VERIFY PAYSTACK WEBHOOK SIGNATURE
========================================== */

const verifyPaystackWebhookSignature =
  (rawBody, signature) => {
    if (
      !rawBody ||
      !signature ||
      !process.env.PAYSTACK_SECRET_KEY
    ) {
      return false;
    }

    const expectedSignature =
      crypto
        .createHmac(
          "sha512",
          process.env.PAYSTACK_SECRET_KEY
        )
        .update(rawBody)
        .digest("hex");

    const expectedBuffer =
      Buffer.from(expectedSignature);

    const receivedBuffer =
      Buffer.from(String(signature));

    if (
      expectedBuffer.length !==
      receivedBuffer.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      expectedBuffer,
      receivedBuffer
    );
  };

/* ==========================================
   FIND PAYMENT BY REFERENCE
========================================== */

const findPaymentByReference =
  async (reference) => {
    return Payment.findOne({
      providerReference: reference,
      provider: "paystack",
    });
  };

/* ==========================================
   MARK PAYMENT SUCCESSFUL
========================================== */

const markPaymentSuccessful = async ({
  payment,
}) => {
  /* ----------------------------------------
     PREVENT DUPLICATE PROCESSING
  ---------------------------------------- */

  if (payment.status === "successful") {
    const order = await Order.findById(
      payment.order
    );

    const invoice =
      await Invoice.findOne({
        payment: payment._id,
      });

    return {
      payment,
      order,
      invoice,
      enrollments: [],
    };
  }

  payment.status = "successful";
  payment.paidAt = new Date();
  payment.failedAt = null;
  payment.failureReason = "";

  await payment.save();

  /* ----------------------------------------
     FIND ORDER
  ---------------------------------------- */

  const order = await Order.findById(
    payment.order
  );

  if (!order) {
    throw new Error(
      "Order associated with payment was not found."
    );
  }

  /* ----------------------------------------
     MARK ORDER PAID
  ---------------------------------------- */

  order.status = "paid";
  order.paymentProvider =
    payment.provider;
  order.paymentReference =
    payment.providerReference;
  order.paidAt = payment.paidAt;

  await order.save();

  /* ----------------------------------------
     CREATE / UPDATE INVOICE
  ---------------------------------------- */

  let invoice =
    await Invoice.findOne({
      order: order._id,
    });

  if (!invoice) {
    invoice = await Invoice.create({
      invoiceNumber:
        generateInvoiceNumber(),
      user: order.user,
      order: order._id,
      payment: payment._id,
      amount: order.total,
      currency: order.currency,
      status: "paid",
      paidAt: payment.paidAt,
    });
  } else {
    invoice.payment =
      payment._id;

    invoice.status = "paid";
    invoice.paidAt =
      payment.paidAt;

    await invoice.save();
  }

  /* ----------------------------------------
     ENROLL PAID COURSES
  ---------------------------------------- */

  const enrollments = [];

  for (const item of order.items) {
    if (
      item.itemType !== "course"
    ) {
      continue;
    }

    const course =
      await Course.findById(
        item.itemId
      );

    if (!course) {
      continue;
    }

    if (!course.premium) {
      continue;
    }

    try {
      const enrollment =
        await enrollUserInCourse({
          userId: order.user,
          courseId: course._id,
        });

      enrollments.push({
        course:
          enrollment.course,
        progress:
          enrollment.progress,
      });
    } catch (error) {
      if (
        error.statusCode === 409 ||
        error.message ===
          "You are already enrolled in this course."
      ) {
        continue;
      }

      throw error;
    }
  }

  return {
    payment,
    order,
    invoice,
    enrollments,
  };
};

/* ==========================================
   FINALIZE VERIFIED PAYSTACK PAYMENT
========================================== */

const finalizePaystackPayment =
  async ({
    reference,
    paystackTransaction,
    userId = null,
  }) => {
    if (!reference) {
      throw new Error(
        "Payment reference is required."
      );
    }

    const payment =
      await findPaymentByReference(
        reference
      );

    if (!payment) {
      const error = new Error(
        "Payment record for this transaction was not found."
      );

      error.statusCode = 404;

      throw error;
    }

    /* ----------------------------------------
       USER OWNERSHIP
       Only enforced when called from an
       authenticated frontend verification.
    ---------------------------------------- */

    if (
      userId &&
      String(payment.user) !==
        String(userId)
    ) {
      const error = new Error(
        "You are not authorized to verify this payment."
      );

      error.statusCode = 403;

      throw error;
    }

    /* ----------------------------------------
       ALREADY SUCCESSFUL
    ---------------------------------------- */

    if (
      payment.status === "successful"
    ) {
      return markPaymentSuccessful({
        payment,
      });
    }

    /* ----------------------------------------
       PAYSTACK STATUS
    ---------------------------------------- */

    if (
      paystackTransaction?.status !==
      "success"
    ) {
      throw new Error(
        "Paystack transaction has not been completed successfully."
      );
    }

    /* ----------------------------------------
       REFERENCE MATCH
    ---------------------------------------- */

    if (
      String(
        paystackTransaction.reference
      ) !== String(reference)
    ) {
      throw new Error(
        "Paystack transaction reference does not match the payment."
      );
    }

    /* ----------------------------------------
       ORDER
    ---------------------------------------- */

    const order =
      await Order.findById(
        payment.order
      );

    if (!order) {
      throw new Error(
        "Order associated with payment was not found."
      );
    }

    /* ----------------------------------------
       AMOUNT VALIDATION
       Local amount is major currency unit.
       Paystack amount is subunit.
    ---------------------------------------- */

    const expectedAmount = Math.round(
      Number(payment.amount) * 100
    );

    const paidAmount = Number(
      paystackTransaction.amount
    );

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount !== expectedAmount
    ) {
      throw new Error(
        "Paystack payment amount does not match the order."
      );
    }

    /* ----------------------------------------
       CURRENCY VALIDATION
    ---------------------------------------- */

    const expectedCurrency =
      String(
        payment.currency || ""
      ).toUpperCase();

    const paidCurrency =
      String(
        paystackTransaction.currency ||
          ""
      ).toUpperCase();

    if (
      expectedCurrency !==
      paidCurrency
    ) {
      throw new Error(
        "Paystack payment currency does not match the order."
      );
    }

    /* ----------------------------------------
       EMAIL VALIDATION
    ---------------------------------------- */

    if (
      paystackTransaction.customer?.email &&
      payment.metadata?.customerEmail &&
      String(
        paystackTransaction.customer.email
      ).toLowerCase() !==
        String(
          payment.metadata.customerEmail
        ).toLowerCase()
    ) {
      throw new Error(
        "Paystack customer email does not match the payment."
      );
    }

    /* ----------------------------------------
       STORE PROVIDER DETAILS
    ---------------------------------------- */

    payment.providerCustomerReference =
      paystackTransaction.customer?.customer_code ||
      "";

    payment.metadata = {
      ...(payment.metadata || {}),
      paystackTransactionId:
        paystackTransaction.id || null,
      paystackStatus:
        paystackTransaction.status,
      paystackGatewayResponse:
        paystackTransaction.gateway_response ||
        "",
      paystackChannel:
        paystackTransaction.channel ||
        "",
      paystackPaidAt:
        paystackTransaction.paid_at ||
        null,
      paystackVerifiedAt:
        new Date(),
    };

    await payment.save();

    /* ----------------------------------------
       FINAL FULFILLMENT
    ---------------------------------------- */

    return markPaymentSuccessful({
      payment,
    });
  };

module.exports = {
  generateOrderNumber,
  generateInvoiceNumber,
  generatePaymentReference,
  createOrder,
  createCourseOrder,
  createPaymentRecord,
  initializePaystackTransaction,
  verifyPaystackTransaction,
  verifyPaystackWebhookSignature,
  findPaymentByReference,
  finalizePaystackPayment,
  markPaymentSuccessful,
};