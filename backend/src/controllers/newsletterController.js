const newsletterService = require("../services/newsletterService");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   SUBSCRIBE
========================================== */

const subscribe = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.subscribe(
    req.body.email
  );

  return ApiResponse.success(
    res,
    subscriber,
    "Successfully subscribed.",
    201
  );
});

/* ==========================================
   UNSUBSCRIBE
========================================== */

const unsubscribe = asyncHandler(async (req, res) => {
  const subscriber =
    await newsletterService.unsubscribe(
      req.body.email
    );

  if (!subscriber) {
    throw new ApiError(
      404,
      "Subscriber not found."
    );
  }

  return ApiResponse.success(
    res,
    subscriber,
    "Successfully unsubscribed."
  );
});

/* ==========================================
   GET ALL SUBSCRIBERS
========================================== */

const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers =
    await newsletterService.getSubscribers(
      req.query
    );

  return ApiResponse.success(
    res,
    subscribers,
    "Subscribers retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE SUBSCRIBER
========================================== */

const getSubscriber = asyncHandler(async (req, res) => {
  const subscriber =
    await newsletterService.getById(
      req.params.id
    );

  if (!subscriber) {
    throw new ApiError(
      404,
      "Subscriber not found."
    );
  }

  return ApiResponse.success(
    res,
    subscriber,
    "Subscriber retrieved successfully."
  );
});

/* ==========================================
   DELETE SUBSCRIBER
========================================== */

const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber =
    await newsletterService.delete(
      req.params.id
    );

  if (!subscriber) {
    throw new ApiError(
      404,
      "Subscriber not found."
    );
  }

  return ApiResponse.success(
    res,
    null,
    "Subscriber deleted successfully."
  );
});

/* ==========================================
   NEWSLETTER STATISTICS
========================================== */

const getStats = asyncHandler(async (req, res) => {
  const stats =
    await newsletterService.getStats();

  return ApiResponse.success(
    res,
    stats,
    "Newsletter statistics retrieved successfully."
  );
});

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
  getSubscriber,
  deleteSubscriber,
  getStats,
};