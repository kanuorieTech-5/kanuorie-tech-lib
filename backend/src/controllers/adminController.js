const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const User = require("../models/User");
const Course = require("../models/Course");
const Learning = require("../models/Learning");
const Progress = require("..\/models\/Progress");
const Team = require("../models/Team");
const Affiliate = require("../models/Affiliate");
const AffiliateReferral = require("../models/AffiliateReferral");
const AffiliatePayout = require("../models/AffiliatePayout");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const Certificate = require("../models/Certificate");
const Contact = require("../models/Contact");
const CommunityReport = require("../models/CommunityReport");
const Testimonial = require("../models/Testimonial");

/* ==========================================
   GET ADMIN DASHBOARD
========================================== */

const getStats = asyncHandler(async (req, res) => {
  /* ==========================================
     DATE RANGES
  ========================================== */

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  /* ==========================================
     BASIC PLATFORM STATS
  ========================================== */

  const [
    totalUsers,
    totalCourses,
    totalBooks,
    totalProgress,
    verifiedUsers,
    blockedUsers,
    featuredBooks,

    /* TEAM */
    totalTeam,
    activeTeam,

    /* AFFILIATES */
    totalAffiliates,
    activeAffiliates,
    pendingPayouts,
    paidPayouts,

    /* ENROLLMENTS */
    totalEnrollments,
    completedEnrollments,
    inProgressEnrollments,

    /* CERTIFICATES */
    totalCertificates,
    certificatesThisMonth,
    pendingCertificates,

    /* PAYMENTS */
    totalPayments,
    successfulPayments,
    pendingPayments,
    failedPayments,
    refundedPayments,

    /* INVESTORS / PARTNERS */
    investorInquiries,
    partnerInquiries,
    repliedInvestorInquiries,
    repliedPartnerInquiries,

    /* ISSUES */
    totalIssues,
    openIssues,
    resolvedIssues,

    /* FEEDBACK */
    totalTestimonials,
    newTestimonials,
    positiveTestimonials,
    contactsNeedingResponse,

    /* ORDERS */
    totalOrders,
    paidOrders,
  ] = await Promise.all([
    /* PLATFORM */
    User.countDocuments(),
    Course.countDocuments(),
    Learning.countDocuments(),
    Progress.countDocuments(),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isBlocked: true }),
    Learning.countDocuments({ featured: true }),

    /* TEAM */
    Team.countDocuments(),
    Team.countDocuments({ active: true }),

    /* AFFILIATES */
    Affiliate.countDocuments(),
    Affiliate.countDocuments({ status: "active" }),
    AffiliatePayout.countDocuments({
      status: { $in: ["requested", "processing"] },
    }),
    AffiliatePayout.countDocuments({
      status: "paid",
    }),

    /* ENROLLMENTS */
    Progress.countDocuments(),
    Progress.countDocuments({
      status: "completed",
    }),
    Progress.countDocuments({
      status: "in_progress",
    }),

    /* CERTIFICATES */
    Certificate.countDocuments({
      status: "issued",
    }),
    Certificate.countDocuments({
      status: "issued",
      issuedAt: { $gte: startOfMonth },
    }),
    Progress.countDocuments({
      status: "completed",
      certificateIssued: false,
    }),

    /* PAYMENTS */
    Payment.countDocuments(),
    Payment.countDocuments({
      status: "successful",
    }),
    Payment.countDocuments({
      status: "pending",
    }),
    Payment.countDocuments({
      status: "failed",
    }),
    Payment.countDocuments({
      status: "refunded",
    }),

    /* INVESTORS */
    Contact.countDocuments({
      inquiryType: "Investment",
    }),
    Contact.countDocuments({
      inquiryType: "Partnership",
    }),
    Contact.countDocuments({
      inquiryType: "Investment",
      replied: true,
    }),
    Contact.countDocuments({
      inquiryType: "Partnership",
      replied: true,
    }),

    /* ISSUES */
    CommunityReport.countDocuments(),
    CommunityReport.countDocuments({
      status: "pending",
    }),
    CommunityReport.countDocuments({
      status: {
        $in: ["reviewed", "dismissed", "actioned"],
      },
    }),

    /* FEEDBACK */
    Testimonial.countDocuments(),
    Testimonial.countDocuments({
      createdAt: { $gte: startOfMonth },
    }),
    Testimonial.countDocuments({
      rating: { $gte: 4 },
      active: true,
    }),
    Contact.countDocuments({
      replied: false,
    }),

    /* ORDERS */
    Order.countDocuments(),
    Order.countDocuments({
      status: "paid",
    }),
  ]);

  /* ==========================================
     AFFILIATE COMMISSIONS
  ========================================== */

  const [
    totalCommissionRows,
    pendingCommissionRows,
  ] = await Promise.all([
    AffiliateReferral.aggregate([
      {
        $match: {
          commissionAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$commissionCurrency",
          amount: { $sum: "$commissionAmount" },
        },
      },
    ]),

    AffiliateReferral.aggregate([
      {
        $match: {
          commissionStatus: "pending",
          commissionAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$commissionCurrency",
          amount: { $sum: "$commissionAmount" },
        },
      },
    ]),
  ]);

  const formatCurrencyTotals = (rows) => {
    if (!rows || rows.length === 0) {
      return 0;
    }

    if (rows.length === 1) {
      return rows[0].amount;
    }

    return rows.reduce((result, row) => {
      result[row._id || "UNKNOWN"] = row.amount;
      return result;
    }, {});
  };

  const totalCommission =
    formatCurrencyTotals(totalCommissionRows);

  const pendingCommission =
    formatCurrencyTotals(pendingCommissionRows);

  /* ==========================================
     PAYMENT VOLUME BY CURRENCY
  ========================================== */

  const paymentVolumeRows = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: "$currency",
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const paymentVolume =
    formatCurrencyTotals(paymentVolumeRows);

  /* ==========================================
     REVENUE
  ========================================== */

  const [
    revenueTodayRows,
    revenueMonthRows,
    revenuePreviousMonthRows,
  ] = await Promise.all([
    Payment.aggregate([
      {
        $match: {
          status: "successful",
          paidAt: { $gte: startOfToday },
        },
      },
      {
        $group: {
          _id: "$currency",
          amount: { $sum: "$amount" },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          status: "successful",
          paidAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$currency",
          amount: { $sum: "$amount" },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          status: "successful",
          paidAt: {
            $gte: startOfPreviousMonth,
            $lt: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$currency",
          amount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const revenueToday =
    formatCurrencyTotals(revenueTodayRows);

  const revenueMonth =
    formatCurrencyTotals(revenueMonthRows);

  const revenuePreviousMonth =
    formatCurrencyTotals(revenuePreviousMonthRows);

  let revenueGrowth = 0;

  if (
    typeof revenueMonth === "number" &&
    typeof revenuePreviousMonth === "number"
  ) {
    if (revenuePreviousMonth > 0) {
      revenueGrowth =
        ((revenueMonth - revenuePreviousMonth) /
          revenuePreviousMonth) *
        100;
    } else if (revenueMonth > 0) {
      revenueGrowth = 100;
    }
  }

  /* ==========================================
     SALES
  ========================================== */

  const [
    salesToday,
    salesMonth,
    salesPreviousMonth,
  ] = await Promise.all([
    Order.countDocuments({
      status: "paid",
      paidAt: { $gte: startOfToday },
    }),

    Order.countDocuments({
      status: "paid",
      paidAt: { $gte: startOfMonth },
    }),

    Order.countDocuments({
      status: "paid",
      paidAt: {
        $gte: startOfPreviousMonth,
        $lt: startOfMonth,
      },
    }),
  ]);

  let salesGrowth = 0;

  if (salesPreviousMonth > 0) {
    salesGrowth =
      ((salesMonth - salesPreviousMonth) /
        salesPreviousMonth) *
      100;
  } else if (salesMonth > 0) {
    salesGrowth = 100;
  }

  /* ==========================================
     USER GROWTH
  ========================================== */

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        users: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  /* ==========================================
     BOOK TREND
  ========================================== */

  const bookTrend = await Learning.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        books: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  /* ==========================================
     COURSE ENGAGEMENT
  ========================================== */

  const courseEngagement = await Progress.aggregate([
    {
      $group: {
        _id: "$course",
        activity: { $sum: 1 },
      },
    },
    {
      $sort: { activity: -1 },
    },
  ]);

  /* ==========================================
     RECENT DATA
  ========================================== */

  const [latestUsers, latestBooks] =
    await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5),

      Learning.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  /* ==========================================
     OPERATIONS
  ========================================== */

  const operations = {
    team: {
      total: totalTeam,
      active: activeTeam,
      inactive: totalTeam - activeTeam,
    },

    affiliates: {
      total: totalAffiliates,
      active: activeAffiliates,
      pendingPayouts,
      paidPayouts,
      totalCommission,
      pendingCommission,
    },

    investorsPartners: {
      investors: investorInquiries,
      partners: partnerInquiries,

      active:
        repliedInvestorInquiries +
        repliedPartnerInquiries,

      pending:
        (investorInquiries - repliedInvestorInquiries) +
        (partnerInquiries - repliedPartnerInquiries),
    },

    enrollments: {
      total: totalEnrollments,

      active:
        totalEnrollments -
        completedEnrollments,

      completed: completedEnrollments,
      inProgress: inProgressEnrollments,
    },

    certificates: {
      total: totalCertificates,
      thisMonth: certificatesThisMonth,
      pending: pendingCertificates,
    },

    payments: {
      total: totalPayments,
      successful: successfulPayments,
      pending: pendingPayments,
      failed: failedPayments,
      refunded: refundedPayments,
      volume: paymentVolume,
    },

    compliance: {
      configured: false,
      total: null,
      compliant: null,
      pending: null,
      issues: null,
    },

    issues: {
      total: totalIssues,
      open: openIssues,
      resolved: resolvedIssues,
    },

    feedback: {
      total: totalTestimonials,
      new: newTestimonials,
      positive: positiveTestimonials,
      needsResponse: contactsNeedingResponse,
    },
  };

  /* ==========================================
     RESPONSE
  ========================================== */

  const stats = {
    users: totalUsers,
    courses: totalCourses,
    books: totalBooks,
    progress: totalProgress,
  };

  return ApiResponse.success(
    res,
    {
      stats,

      totals: stats,

      summary: {
        verifiedUsers,
        blockedUsers,
        featuredBooks,
      },

      revenue: {
        total: paymentVolume,
        today: revenueToday,
        month: revenueMonth,
        previousMonth: revenuePreviousMonth,
        growth: revenueGrowth,
        byCurrency: paymentVolumeRows,
      },

      sales: {
        total: paidOrders,
        today: salesToday,
        month: salesMonth,
        previousMonth: salesPreviousMonth,
        orders: totalOrders,
        growth: salesGrowth,
      },

      operations,

      team: operations.team,
      affiliates: operations.affiliates,
      investorsPartners: operations.investorsPartners,
      enrollments: operations.enrollments,
      certificates: operations.certificates,
      payments: operations.payments,
      compliance: operations.compliance,
      issues: operations.issues,
      feedback: operations.feedback,

      charts: {
        userGrowth,
        bookTrend,
        courseEngagement,
      },

      latestUsers,
      latestBooks,
    },
    "Dashboard statistics retrieved successfully."
  );
});

/* ==========================================
   GET ALL USERS
========================================== */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  return ApiResponse.success(
    res,
    users,
    "Users retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE USER
========================================== */

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const [courses, progress] = await Promise.all([
    Course.find({
      createdBy: user._id,
    }),

    Progress.find({
      user: user._id,
    }).populate("course"),
  ]);

  return ApiResponse.success(
    res,
    {
      user,
      courses,
      progress,
    },
    "User retrieved successfully."
  );
});

/* ==========================================
   DELETE USER
========================================== */

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(
      400,
      "You cannot delete your own account."
    );
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await Promise.all([
    Course.deleteMany({
      createdBy: user._id,
    }),

    Progress.deleteMany({
      user: user._id,
    }),

    user.deleteOne(),
  ]);

  return ApiResponse.success(
    res,
    null,
    "User deleted successfully."
  );
});

/* ==========================================
   BLOCK / UNBLOCK USER
========================================== */

const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.isBlocked = !user.isBlocked;

  await user.save();

  return ApiResponse.success(
    res,
    user,
    user.isBlocked
      ? "User blocked successfully."
      : "User unblocked successfully."
  );
});

module.exports = {
  getStats,
  getUsers,
  getUser,
  deleteUser,
  toggleBlockUser,
};



