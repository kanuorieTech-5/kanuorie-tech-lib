const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
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

  const {
    firstName,
    lastName,
    username,
    email,
    avatar,
    phone,
    bio,
    settings,
  } = req.body;

  if (email?.trim()) {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (normalizedEmail !== user.email) {
      const exists = await User.findOne({
        email: normalizedEmail,
        _id: {
          $ne: user._id,
        },
      });

      if (exists) {
        throw new ApiError(
          409,
          "Email already exists."
        );
      }

      user.email = normalizedEmail;
    }
  }

  if (firstName?.trim()) {
    user.firstName = firstName.trim();
  }

  if (lastName?.trim()) {
    user.lastName = lastName.trim();
  }

    /* ----------------------------------------
    USERNAME
  ---------------------------------------- */

  if (username !== undefined) {
    const normalizedUsername = username
      .trim()
      .toLowerCase();

    if (!normalizedUsername) {
      throw new ApiError(
        400,
        "Username cannot be empty."
      );
    }

    if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
      throw new ApiError(
        400,
        "Username can only contain letters, numbers, and underscores."
      );
    }

    if (normalizedUsername !== user.username) {
      const existingUsername =
        await User.findOne({
          username: normalizedUsername,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUsername) {
        throw new ApiError(
          409,
          "Username already exists."
        );
      }

      user.username = normalizedUsername;
    }
  }

  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  if (phone !== undefined) {
    user.phone = phone;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  if (settings !== undefined) {

    /* Theme */

    if (
      settings.theme !== undefined &&
      ["light", "dark", "system"].includes(
        settings.theme
      )
    ) {
      user.settings.theme = settings.theme;
    }

    /* Language */

    if (settings.language !== undefined) {
      user.settings.language =
        settings.language;
    }

    /* Notifications */

    if (settings.notifications) {
      const notificationKeys = [
        "courses",
        "resources",
        "products",
        "account",
        "promotions",
      ];

      notificationKeys.forEach((key) => {
        if (
          settings.notifications[key] !==
          undefined
        ) {
          user.settings.notifications[key] =
            Boolean(
              settings.notifications[key]
            );
        }
      });
    }

    /* Email Preferences */

    if (settings.emailPreferences) {
      const emailPreferenceKeys = [
        "security",
        "courses",
        "resources",
        "products",
        "newsletter",
        "promotions",
      ];

      emailPreferenceKeys.forEach((key) => {
        if (
          settings.emailPreferences[key] !==
          undefined
        ) {
          /*
           * Security emails should always
           * remain enabled.
           */
          if (key === "security") {
            user.settings.emailPreferences[
              key
            ] = true;
          } else {
            user.settings.emailPreferences[
              key
            ] = Boolean(
              settings.emailPreferences[key]
            );
          }
        }
      });
    }
  }

  await user.save();

  return ApiResponse.success(
    res,
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username || "",
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      role: user.role,
      isVerified: user.isVerified,
      settings: user.settings,
    },
    "Profile updated successfully."
  );
});

/* ==========================================
   UPLOAD AVATAR
========================================== */

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(
      400,
      "Please select an image to upload."
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
    "base64"
  )}`;

  const result = await cloudinary.uploader.upload(
    dataURI,
    {
      folder: "kanuorietech/avatars",
      resource_type: "image",
      transformation: [
        {
          width: 500,
          height: 500,
          crop: "fill",
          gravity: "face",
        },
        {
          quality: "auto",
        },
        {
          fetch_format: "auto",
        },
      ],
    }
  );

  user.avatar = result.secure_url;

  await user.save();

  return ApiResponse.success(
    res,
    {
      avatar: user.avatar,
      publicId: result.public_id,
    },
    "Avatar uploaded successfully."
  );
});

/* ==========================================
   DELETE AVATAR
========================================== */

const deleteAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.avatar = "";

  await user.save();

  return ApiResponse.success(
    res,
    null,
    "Avatar removed successfully."
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
  uploadAvatar, 
  deleteAvatar, 
  getDashboard, 
  getUsers, 
  getUser, 
  updateUserRole, 
  deleteUser, 
};