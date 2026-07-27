const Contact = require("../models/Contact");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE CONTACT MESSAGE
========================================== */

const createMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
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

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  markAsUnread,
  deleteMessage,
  getContactStats,
};