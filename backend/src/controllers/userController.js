const mongoose = require("mongoose");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const User = require("../models/User");
const Book = require("../models/Book");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const Progress = require("../models/Progress");

/* ==========================================
   GET CURRENT USER PROFILE
========================================== */

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return ApiResponse.success(
    res,
    user,
    "Profile retrieved successfully."
  );
});

/* ==========================================
   UPDATE CURRENT USER PROFILE
========================================== */

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (
    req.body.email &&
    req.body.email.toLowerCase() !== user.email
  ) {
    const exists = await User.findOne({
      email: req.body.email.toLowerCase(),
      _id: { $ne: user._id },
    });

    if (exists) {
      throw new ApiError(
        409,
        "Email already exists."
      );
    }

    user.email = req.body.email.toLowerCase();
  }

  const editableFields = [
    "firstName",
    "lastName",
    "phone",
    "bio",
    "avatar",
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  return ApiResponse.success(
    res,
    user.toJSON(),
    "Profile updated successfully."
  );
});

/* ==========================================
   USER DASHBOARD
========================================== */

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [
    user,
    books,
    courses,
    notifications,
    unreadNotifications,
    completedCourses,
    progress,
  ] = await Promise.all([
    User.findById(userId)
      .select(
        "firstName lastName email avatar role"
      )
      .lean(),

    Book.countDocuments({
      createdBy: userId,
    }),

    Course.countDocuments({
      createdBy: userId,
    }),

    Notification.countDocuments({
      user: userId,
    }),

    Notification.countDocuments({
      user: userId,
      isRead: false,
    }),

    Progress.countDocuments({
      user: userId,
      completed: true,
    }),

    Progress.find({
      user: userId,
    })
      .populate("course")
      .lean(),
  ]);

  return ApiResponse.success(
    res,
    {
      user,

      summary: {
        books,
        courses,
        notifications,
        unreadNotifications,
        completedCourses,
      },

      progress,
    },
    "Dashboard retrieved successfully."
  );
});

/* ==========================================
   GET USER (ADMIN)
========================================== */

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  const user = await User.findById(id)
    .select("-password")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return ApiResponse.success(
    res,
    user,
    "User retrieved successfully."
  );
});

/* ==========================================
   GET ALL USERS (ADMIN)
========================================== */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({
      createdAt: -1,
    })
    .lean();

  return ApiResponse.success(
    res,
    {
      count: users.length,
      users,
    },
    "Users retrieved successfully."
  );
});

/* ==========================================
   UPDATE USER ROLE (ADMIN)
========================================== */

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  if (!["user", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role.");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.role = role;

  await user.save();

  return ApiResponse.success(
    res,
    user.toJSON(),
    "User role updated successfully."
  );
});

/* ==========================================
   DELETE USER (ADMIN)
========================================== */

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  if (req.user._id.toString() === id) {
    throw new ApiError(
      400,
      "You cannot delete your own account."
    );
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await Promise.all([
    Book.deleteMany({
      createdBy: id,
    }),

    Course.deleteMany({
      createdBy: id,
    }),

    Progress.deleteMany({
      user: id,
    }),

    Notification.deleteMany({
      user: id,
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
   EXPORTS
========================================== */

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
};