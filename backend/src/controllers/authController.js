const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

/* ==========================================
   REGISTER USER
========================================== */
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, "Please provide all required fields.");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists.");
  }

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
  });

  const token = generateToken(user._id);

  return ApiResponse.success(
    res,
    {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    },
    "Account created successfully.",
    201
  );
});

/* ==========================================
   LOGIN USER
========================================== */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  user.lastLogin = new Date();
  user.loginCount += 1;

  await user.save();

  const token = generateToken(user._id);

  return ApiResponse.success(
    res,
    {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    },
    "Login successful."
  );
});

/* ==========================================
   GET CURRENT USER
========================================== */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

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
   UPDATE PROFILE
========================================== */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (req.body.email) {
    const existingEmail = await User.findOne({
      email: req.body.email.toLowerCase(),
      _id: { $ne: user._id },
    });

    if (existingEmail) {
      throw new ApiError(409, "Email already exists.");
    }

    user.email = req.body.email.toLowerCase();
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.avatar = req.body.avatar || user.avatar;
  user.phone = req.body.phone || user.phone;
  user.bio = req.body.bio || user.bio;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  return ApiResponse.success(
    res,
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      role: user.role,
    },
    "Profile updated successfully."
  );
});

/* ==========================================
   CHANGE PASSWORD
========================================== */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;

  await user.save();

  return ApiResponse.success(
    res,
    null,
    "Password changed successfully."
  );
});

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
};