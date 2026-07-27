const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const User = require("../models/User");
const Course = require("../models/Course");
const Book = require("../models/Book");
const Progress = require("../models/Progress");

/* ==========================================
   GET ADMIN DASHBOARD
========================================== */
const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCourses,
    totalBooks,
    totalProgress,
    verifiedUsers,
    blockedUsers,
    featuredBooks,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Book.countDocuments(),
    Progress.countDocuments(),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isBlocked: true }),
    Book.countDocuments({ featured: true }),
  ]);

  /* ==========================================
     USER GROWTH (LAST 7 DAYS)
  ========================================== */

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sevenDaysAgo,
        },
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
        users: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  /* ==========================================
     BOOK TREND
  ========================================== */

  const bookTrend = await Book.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        books: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  /* ==========================================
     COURSE ENGAGEMENT
  ========================================== */

  const courseEngagement = await Progress.aggregate([
    {
      $group: {
        _id: "$course",
        activity: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        activity: -1,
      },
    },
  ]);

  /* ==========================================
     RECENT USERS & BOOKS
  ========================================== */

  const [latestUsers, latestBooks] = await Promise.all([
    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5),

    Book.find()
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return ApiResponse.success(
    res,
    {
      totals: {
        users: totalUsers,
        courses: totalCourses,
        books: totalBooks,
        progress: totalProgress,
      },

      summary: {
        verifiedUsers,
        blockedUsers,
        featuredBooks,
      },

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