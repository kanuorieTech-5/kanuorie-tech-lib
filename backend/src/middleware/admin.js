const ApiError = require("../utils/ApiError");

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(
      new ApiError(401, "Unauthorized.")
    );
  }

  if (req.user.role !== "admin") {
    return next(
      new ApiError(
        403,
        "Admin access required."
      )
    );
  }

  next();
};

module.exports = adminOnly;