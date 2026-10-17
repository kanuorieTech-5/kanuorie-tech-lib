const mongoose = require("mongoose");

const Contact = require("../models/Contact");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const Payment = require("../models/Payment");
const CommunityReport = require("../models/CommunityReport");
const Testimonial = require("../models/Testimonial");

/* ==========================================
   HELPERS
========================================== */

const sendSuccess = (res, message, items) =>
  res.status(200).json({
    success: true,
    message,
    data: {
      items,
      count: items.length,
    },
  });

const validateId = (id) => mongoose.isValidObjectId(id);

/* ==========================================
   INVESTORS & PARTNERS
========================================== */

const getOperationsInquiries = async (req, res, next) => {
  try {
    const filter = {
      inquiryType: {
        $in: ["Investment", "Partnership"],
      },
      isServiceInquiry: { $ne: true },
    };

    if (req.query.type === "Investment") {
      filter.inquiryType = "Investment";
    } else if (req.query.type === "Partnership") {
      filter.inquiryType = "Partnership";
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const items = await Contact.find(filter)
      .select(
        "name email phone company subject message inquiryType status replied repliedAt isRead createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return sendSuccess(
      res,
      "Investor and partner inquiries retrieved successfully.",
      items
    );
  } catch (error) {
    next(error);
  }
};

const updateOperationsInquiryStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!validateId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry status.",
      });
    }

    const inquiry = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
        inquiryType: { $in: ["Investment", "Partnership"] },
        isServiceInquiry: { $ne: true },
      },
      { $set: { status } },
      { new: true, runValidators: true }
    ).select(
      "name email phone company subject message inquiryType status replied repliedAt isRead createdAt updatedAt"
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Investor or partner inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully.",
      data: { inquiry },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   ENROLLMENTS
========================================== */

const getOperationsEnrollments = async (req, res, next) => {
  try {
    const items = await Progress.find()
      .populate("user", "firstName lastName email")
      .populate("course", "title category level")
      .select(
        "user course percentage status completed completedAt certificateIssued createdAt updatedAt"
      )
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean();

    return sendSuccess(
      res,
      "Course enrollments retrieved successfully.",
      items
    );
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   CERTIFICATES
========================================== */

const getOperationsCertificates = async (
  req,
  res,
  next
) => {
  try {
    const items = await Certificate.find()
      .populate("user", "firstName lastName email")
      .populate("course", "title")
      .select(
        "certificateId recipientName courseTitle completionDate issuedAt status user course createdAt"
      )
      .sort({ issuedAt: -1 })
      .limit(200)
      .lean();

    return sendSuccess(
      res,
      "Certificates retrieved successfully.",
      items
    );
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   PAYMENTS — READ ONLY
========================================== */

const getOperationsPayments = async (req, res, next) => {
  try {
    const filter = {};

    const allowedStatuses = [
      "pending",
      "successful",
      "failed",
      "cancelled",
      "refunded",
    ];

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status filter.",
        });
      }

      filter.status = req.query.status;
    }

    const items = await Payment.find(filter)
      .select(
        "user order provider providerReference amount currency status paymentMethod paidAt failedAt failureReason createdAt updatedAt"
      )
      .populate("user", "firstName lastName email")
      .populate("order", "orderNumber total currency status")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return sendSuccess(
      res,
      "Payment records retrieved successfully.",
      items
    );
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   ISSUES — COMMUNITY REPORTS
========================================== */

const getOperationsIssues = async (req, res, next) => {
  try {
    const filter = {};

    const allowedStatuses = [
      "pending",
      "reviewed",
      "dismissed",
      "actioned",
    ];

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid issue status filter.",
        });
      }

      filter.status = req.query.status;
    }

    const items = await CommunityReport.find(filter)
      .populate("reporter", "firstName lastName email")
      .populate("post", "title content category status")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return sendSuccess(
      res,
      "Community issues retrieved successfully.",
      items
    );
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   FEEDBACK — READ ONLY
========================================== */

const getOperationsFeedback = async (req, res, next) => {
  try {
    const items = await Testimonial.find()
      .select(
        "name company position message rating featured active createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return sendSuccess(
      res,
      "Feedback records retrieved successfully.",
      items
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperationsInquiries,
  updateOperationsInquiryStatus,
  getOperationsEnrollments,
  getOperationsCertificates,
  getOperationsPayments,
  getOperationsIssues,
  getOperationsFeedback,
};