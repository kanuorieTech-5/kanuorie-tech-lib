const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs:
    Number(process.env.RATE_LIMIT_WINDOW || 15) *
    60 *
    1000,

  max:
    process.env.NODE_ENV === "production"
      ? Number(process.env.RATE_LIMIT_MAX || 100)
      : 1000,

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many requests. Please try again later.",
    });
  },
});

module.exports = apiLimiter;