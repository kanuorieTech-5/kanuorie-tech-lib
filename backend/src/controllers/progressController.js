const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const progressService = require("../services/progressService");

/* ==========================================
   GET CURRENT USER'S PROGRESS
   Returns only courses the authenticated
   user has enrolled in.
========================================== */

const getUserProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.getUserProgress(
    req.user._id
  );

  return ApiResponse.success(
    res,
    progress,
    "Learning progress retrieved successfully."
  );
});

/* ==========================================
   GET PROGRESS FOR ONE COURSE
========================================== */

const getCourseProgress = asyncHandler(async (req, res) => {
  const progress =
    await progressService.getCourseProgress(
      req.user._id,
      req.params.id
    );

  if (!progress) {
    throw new ApiError(
      404,
      "Progress record not found."
    );
  }

  return ApiResponse.success(
    res,
    progress,
    "Course progress retrieved successfully."
  );
});

module.exports = {
  getUserProgress,
  getCourseProgress,
};
