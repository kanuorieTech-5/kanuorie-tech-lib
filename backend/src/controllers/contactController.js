const Contact = require("../models/Contact");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE CONTACT MESSAGE
========================================== */

const createMessage = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").trim();
  const company = String(req.body.company || "").trim();
  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();
  const inquiryType = req.body.inquiryType || "General";

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Please complete all required fields.");
  }

  if (
    name.length > 100 ||
    email.length > 254 ||
    subject.length > 200 ||
    message.length > 5000
  ) {
    throw new ApiError(400, "One or more fields exceed the allowed length.");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    company,
    subject,
    message,
    inquiryType,
    isServiceInquiry: false,
    isReport: false,
    status: "new",
    isRead: false,
  });

  return ApiResponse.success(
    res,
    contact,
    "Message sent successfully.",
    201
  );
});

/* ==========================================
   GET ALL MESSAGES
========================================== */

const getMessages = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === "true";
  }

  if (req.query.inquiryType) {
    filter.inquiryType = req.query.inquiryType;
  }

  if (req.query.search) {
    filter.$or = [
      {
        name: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        subject: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        message: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }

  const [messages, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Contact.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    messages,
    "Messages retrieved successfully.",
    200,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  );
});

/* ==========================================
   GET SINGLE MESSAGE
========================================== */

const getMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, "Message not found.");
  }

  return ApiResponse.success(
    res,
    message,
    "Message retrieved successfully."
  );
});

/* ==========================================
   MARK AS READ
========================================== */

const markAsRead = asyncHandler(async (req, res) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      isRead: true,
    },
    {
      new: true,
    }
  );

  if (!message) {
    throw new ApiError(404, "Message not found.");
  }

  return ApiResponse.success(
    res,
    message,
    "Message marked as read."
  );
});

/* ==========================================
   MARK AS UNREAD
========================================== */

const markAsUnread = asyncHandler(async (req, res) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      isRead: false,
    },
    {
      new: true,
    }
  );

  if (!message) {
    throw new ApiError(404, "Message not found.");
  }

  return ApiResponse.success(
    res,
    message,
    "Message marked as unread."
  );
});

/* ==========================================
   DELETE MESSAGE
========================================== */

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, "Message not found.");
  }

  await message.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Message deleted successfully."
  );
});

/* ==========================================
   CONTACT STATISTICS
========================================== */

const getContactStats = asyncHandler(async (req, res) => {
  const [
    total,
    unread,
    read,
    general,
    support,
    partnership,
  ] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({
      isRead: false,
    }),
    Contact.countDocuments({
      isRead: true,
    }),
    Contact.countDocuments({
      inquiryType: "General",
    }),
    Contact.countDocuments({
      inquiryType: "Support",
    }),
    Contact.countDocuments({
      inquiryType: "Partnership",
    }),
  ]);

  return ApiResponse.success(
    res,
    {
      total,
      unread,
      read,
      inquiryTypes: {
        general,
        support,
        partnership,
      },
    },
    "Contact statistics retrieved successfully."
  );
});

const createReport = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const category = String(req.body.category || "").trim();
  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Please complete all required fields.");
  }

  if (
    name.length > 100 ||
    email.length > 254 ||
    subject.length > 200 ||
    message.length > 5000
  ) {
    throw new ApiError(400, "One or more fields exceed the allowed length.");
  }

  const allowedCategories = ["Complaint", "Compliance", "Feedback"];

  if (!allowedCategories.includes(category)) {
    throw new ApiError(400, "Please select a valid report category.");
  }

  const report = await Contact.create({
    name,
    email,
    subject,
    message,
    inquiryType: "General",
    isServiceInquiry: false,
    isReport: true,
    reportCategory: category,
    status: "new",
    isRead: false,
  });

  return ApiResponse.success(
    res,
    report,
    "Your submission has been received successfully.",
    201
  );
});

module.exports = {
  createMessage,
  createReport,
  getMessages,
  getMessage,
  markAsRead,
  markAsUnread,
  deleteMessage,
  getContactStats,
};