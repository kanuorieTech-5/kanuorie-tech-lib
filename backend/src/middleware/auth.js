const jwt = require("jsonwebtoken");

const User = require("../models/User");

const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return next(
        new ApiError(
          401,
          "Not authorized. No token provided."
        )
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password")
      .lean();

    if (!user) {
      return next(
        new ApiError(401, "User not found.")
      );
    }

    if (user.isBlocked) {
      return next(
        new ApiError(
          403,
          "Your account has been blocked."
        )
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      process.env.NODE_ENV !== "production"
    ) {
      console.error(error);
    }

    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Token has expired.")
      );
    }

    if (error.name === "JsonWebTokenError") {
      return next(
        new ApiError(401, "Invalid token.")
      );
    }

    return next(
      new ApiError(
        401,
        "Authentication failed."
      )
    );
  }
};

module.exports = protect;