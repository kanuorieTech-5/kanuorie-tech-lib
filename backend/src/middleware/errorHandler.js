const ApiResponse = require("../utils/ApiResponse");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode;

  if (!statusCode || statusCode === 200) {
    statusCode = 500;
  }

  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  /* ==========================================
     MONGOOSE INVALID OBJECT ID
  ========================================== */

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID.";
  }

  /* ==========================================
     MONGOOSE VALIDATION ERROR
  ========================================== */

  if (err.name === "ValidationError") {
    statusCode = 400;

    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    message = "Validation failed.";
  }

  /* ==========================================
     DUPLICATE KEY
  ========================================== */

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists.`;
  }

  /* ==========================================
     JWT ERRORS
  ========================================== */

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  /* ==========================================
     LOG ERROR
  ========================================== */

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;