const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const Affiliate = require("../models/Affiliate");
const AffiliateReferral = require("../models/AffiliateReferral");

const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    userType,
    interests,
    generalInterests,
    discoverySource,
    discoverySourceOther,
    learningLevel,
    learningGoals,
    businessType,
    businessNeeds,
    projectTimeline,
    careerGoal,
    experienceLevel,
    preferredOpportunities,
    techStack,
    collaborationInterests,
    otherInterest,
    marketingConsent,
  } = req.body;

  // Validate required fields
  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !password
  ) {
    throw new ApiError(
      400,
      "First name, last name, email and password are required."
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check whether the email already exists
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists.");
  }

  // Safely normalize multiple-choice answers
  const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // Create the user and save registration preferences to MongoDB
  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password,

    userType: [
      "student",
      "business_owner",
      "career_seeker",
      "developer",
      "partner",
      "general",
    ].includes(userType)
      ? userType
      : "general",

    interests: normalizeArray(interests),
    generalInterests: normalizeArray(generalInterests),

    discoverySource:
      typeof discoverySource === "string"
        ? discoverySource.trim()
        : "",

    discoverySourceOther:
      discoverySource === "other" &&
      typeof discoverySourceOther === "string"
        ? discoverySourceOther.trim()
        : "",

    learningLevel:
      typeof learningLevel === "string"
        ? learningLevel.trim()
        : "",

    learningGoals: normalizeArray(learningGoals),

    businessType:
      typeof businessType === "string"
        ? businessType.trim()
        : "",

    businessNeeds: normalizeArray(businessNeeds),

    projectTimeline:
      typeof projectTimeline === "string"
        ? projectTimeline.trim()
        : "",

    careerGoal:
      typeof careerGoal === "string"
        ? careerGoal.trim()
        : "",

    experienceLevel:
      typeof experienceLevel === "string"
        ? experienceLevel.trim()
        : "",

    preferredOpportunities: normalizeArray(
      preferredOpportunities
    ),

    techStack:
      typeof techStack === "string"
        ? techStack.trim()
        : "",

    collaborationInterests: normalizeArray(
      collaborationInterests
    ),

    otherInterest:
      typeof otherInterest === "string"
        ? otherInterest.trim()
        : "",

    marketingConsent: marketingConsent === true,
  });

  /* ==========================================
     RECORD AFFILIATE REGISTRATION
  ========================================== */

  const referralCode = String(
    req.body.referralCode || ""
  )
    .trim()
    .toUpperCase();

  if (referralCode) {
    try {
      const affiliate = await Affiliate.findOne({
        referralCode,
        status: "active",
      });

      if (
        affiliate &&
        affiliate.user.toString() !== user._id.toString()
      ) {
        // A user can only be attributed to one affiliate.
        const existingReferral =
          await AffiliateReferral.findOne({
            referredUser: user._id,
          });

        if (!existingReferral) {
          await AffiliateReferral.create({
            affiliate: affiliate._id,
            referralCode: affiliate.referralCode,
            referredUser: user._id,
            status: "registered",
          });
        }
      }
    } catch (error) {
      // Affiliate tracking must not prevent account creation.
      console.error(
        "Affiliate registration tracking error:",
        error.message
      );
    }
  }

  // Generate authentication token
  const token = generateToken(user._id);

  return ApiResponse.success(
    res,
    {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || "",
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,

        // Saved registration preferences
        userType: user.userType,
        interests: user.interests,
        generalInterests: user.generalInterests,
        discoverySource: user.discoverySource,
        discoverySourceOther: user.discoverySourceOther,
        learningLevel: user.learningLevel,
        learningGoals: user.learningGoals,
        businessType: user.businessType,
        businessNeeds: user.businessNeeds,
        projectTimeline: user.projectTimeline,
        careerGoal: user.careerGoal,
        experienceLevel: user.experienceLevel,
        preferredOpportunities: user.preferredOpportunities,
        techStack: user.techStack,
        collaborationInterests: user.collaborationInterests,
        otherInterest: user.otherInterest,
        marketingConsent: user.marketingConsent,
      },
    },
    "Account created successfully.",
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    throw new ApiError(
      400,
      "Email and password are required."
    );
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  const isMatch = await user.matchPassword(
    password
  );

  if (!isMatch) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  user.lastLogin = new Date();
  user.loginCount =
    (user.loginCount || 0) + 1;

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
        username: user.username || "",
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
      },
    },
    "Login successful."
  );
});

/* ==========================================
   GET CURRENT USER
========================================== */

const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return ApiResponse.success(
      res,
      user,
      "User retrieved successfully."
    );
  }
);

/* ==========================================
   UPDATE PROFILE
========================================== */

const updateProfile = asyncHandler(
  async (req, res) => {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const {
      firstName,
      lastName,
      email,
      avatar,
      phone,
      bio,
      settings,
    } = req.body;

    /* ----------------------------------------
       EMAIL
    ---------------------------------------- */

    if (email?.trim()) {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const existingEmail =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existingEmail) {
        throw new ApiError(
          409,
          "Email already exists."
        );
      }

      user.email = normalizedEmail;
    }

    /* ----------------------------------------
       BASIC PROFILE
    ---------------------------------------- */

    if (firstName?.trim()) {
      user.firstName =
        firstName.trim();
    }

    if (lastName?.trim()) {
      user.lastName =
        lastName.trim();
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

    /* ----------------------------------------
      SETTINGS
    ---------------------------------------- */

    if (settings !== undefined) {
      if (settings.theme !== undefined) {
        if (
          !["light", "dark", "system"].includes(
            settings.theme
          )
        ) {
          throw new ApiError(
            400,
            "Invalid theme."
          );
        }

        user.settings.theme =
          settings.theme;
      }

      if (settings.language !== undefined) {
        user.settings.language =
          settings.language;
      }

      /* --------------------------------------
        NOTIFICATION PREFERENCES
      -------------------------------------- */

      if (settings.notifications) {
        const allowedNotifications = [
          "courses",
          "resources",
          "products",
          "account",
          "promotions",
        ];

        allowedNotifications.forEach(
          (key) => {
            if (
              settings.notifications[key] !==
              undefined
            ) {
              user.settings.notifications[key] =
                Boolean(
                  settings.notifications[key]
                );
            }
          }
        );
      }

      /* --------------------------------------
        EMAIL PREFERENCES
      -------------------------------------- */

      if (settings.emailPreferences) {
        const allowedEmailPreferences = [
          "security",
          "courses",
          "resources",
          "products",
          "newsletter",
          "promotions",
        ];

        allowedEmailPreferences.forEach(
          (key) => {
            if (
              settings.emailPreferences[key] !==
              undefined
            ) {
              user.settings.emailPreferences[
                key
              ] = Boolean(
                settings.emailPreferences[key]
              );
            }
          }
        );
      }
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
        settings: user.settings,
      },
      "Profile updated successfully."
    );
  }
);

/* ==========================================
   CHANGE PASSWORD
========================================== */

const changePassword = asyncHandler(
  async (req, res) => {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      throw new ApiError(
        400,
        "Current password and new password are required."
      );
    }

    const user = await User.findById(
      req.user._id
    ).select("+password");

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const isMatch =
      await user.matchPassword(
        currentPassword
      );

    if (!isMatch) {
      throw new ApiError(
        401,
        "Current password is incorrect."
      );
    }

    user.password = newPassword;

    await user.save();

    return ApiResponse.success(
      res,
      null,
      "Password changed successfully."
    );
  }
);
/* ==========================================
   FORGOT PASSWORD
========================================== */

const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  const user = await User.findOne({ email });

  // Avoid revealing whether an account exists.
  if (!user) {
    return ApiResponse.success(
      res,
      null,
      "If an account exists for that email, password reset instructions will be sent."
    );
  }

  // Generate a cryptographically secure reset token.
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store only the hash of the token in the database.
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires after 10 minutes.
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const frontendUrl = (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    ""
  )
    .split(",")[0]
    .trim()
    .replace(/\/+$/, "");

  if (!frontendUrl) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      500,
      "Password reset is not configured correctly."
    );
  }

  const resetUrl =
    `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Your KanuorieTech Password",
      text: [
        `Hello ${user.firstName},`,
        "",
        "We received a request to reset your KanuorieTech password.",
        "",
        `Open this link to choose a new password: ${resetUrl}`,
        "",
        "This link expires in 10 minutes.",
        "If you did not request a password reset, you can ignore this email.",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#0f172a">
          <h2 style="color:#2563eb">KanuorieTech</h2>
          <h3>Reset Your Password</h3>
          <p>Hello ${escapeHtml(user.firstName)},</p>
          <p>We received a request to reset your KanuorieTech password.</p>
          <p style="margin:28px 0">
            <a href="${resetUrl}"
               style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:10px;display:inline-block">
              Reset Password
            </a>
          </p>
          <p>This link expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:28px 0" />
          <p style="font-size:12px;color:#64748b">KanuorieTech Account Security</p>
        </div>
      `,
    });
  } catch (error) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save({ validateBeforeSave: false });

    console.error("Password reset email delivery failed:", error.message);

    throw new ApiError(
      500,
      "Unable to send the password reset email. Please try again later."
    );
  }

  return ApiResponse.success(
    res,
    null,
    "If an account exists for that email, password reset instructions will be sent."
  );
});

/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

/* ==========================================
   RESET PASSWORD
========================================== */

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password) {
    throw new ApiError(
      400,
      "Reset token and new password are required."
    );
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long."
    );
  }

  if (password.length > 128) {
    throw new ApiError(
      400,
      "Password cannot exceed 128 characters."
    );
  }

  if (
    confirmPassword !== undefined &&
    password !== confirmPassword
  ) {
    throw new ApiError(400, "Passwords do not match.");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password");

  if (!user) {
    throw new ApiError(
      400,
      "This password reset link is invalid or has expired."
    );
  }

  // User.js already hashes modified passwords in its pre-save hook.
  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save();

  return ApiResponse.success(
    res,
    null,
    "Password reset successfully. You can now log in with your new password."
  );
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
