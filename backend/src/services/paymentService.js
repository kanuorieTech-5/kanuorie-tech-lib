const crypto = require("crypto");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const Course = require("../models/Course");
const {
  enrollUserInCourse,
} = require("./courseEnrollmentService");

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
        currency: course.currency || currency,
      });

      continue;
    }

    /* ----------------------------------------
       OTHER ORDER ITEMS
       TEMPORARILY RETAIN EXISTING BEHAVIOR
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

    const invoice = await Invoice.findOne({
      payment: payment._id,
    });

    return {
      payment,
      order,
      invoice,
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

  let invoice = await Invoice.findOne({
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
    invoice.payment = payment._id;
    invoice.status = "paid";
    invoice.paidAt = payment.paidAt;

    await invoice.save();
  }

  /* ----------------------------------------
     ENROLL PAID COURSE(S)
  ---------------------------------------- */

  const enrollments = [];

  for (const item of order.items) {
    if (item.itemType !== "course") {
      continue;
    }

    const course = await Course.findById(
      item.itemId
    );

    if (!course) {
      continue;
    }

    /*
     * Only premium courses should reach
     * this payment enrollment path.
     */

    if (!course.premium) {
      continue;
    }

    /*
     * enrollUserInCourse() already prevents
     * duplicate Progress records.
     */

    try {
      const enrollment =
        await enrollUserInCourse({
          userId: order.user,
          courseId: course._id,
        });

      enrollments.push({
        course: enrollment.course,
        progress: enrollment.progress,
      });
    } catch (error) {
      /*
       * If the learner is already enrolled,
       * don't make payment confirmation fail.
       */

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
   CREATE COURSE ORDER
   SERVER-TRUSTED COURSE PRICING
========================================== */

const createCourseOrder = async ({
  userId,
  courseId,
  affiliateReferral = null,
}) => {
  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const Course = require("../models/Course");
  const Progress = require("../models/Progress");

  const course = await Course.findById(courseId);

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

  const existingProgress = await Progress.findOne({
    user: userId,
    course: course._id,
  });

  if (existingProgress) {
    throw new Error(
      "You are already enrolled in this course."
    );
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

  const order = await createOrder({
    userId,
    items: [
      {
        itemType: "course",
        itemId: course._id,
        quantity: 1,
      },
    ],
    currency: course.currency || "USD",
    discount: 0,
    affiliateReferral,
  });

  return {
    order,
    course,
  };
};
module.exports = {
  generateOrderNumber,
  generateInvoiceNumber,
  generatePaymentReference,
  createOrder,
  createCourseOrder,
  createPaymentRecord,
  markPaymentSuccessful,
};