const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const testimonialService = require("../services/testimonialService");

/* ==========================================
   CREATE TESTIMONIAL
========================================== */

const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.create(req.body);

  return ApiResponse.success(
    res,
    testimonial,
    "Testimonial created successfully.",
    201
  );
});

/* ==========================================
   GET ALL TESTIMONIALS
========================================== */

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getAll(req.query);

  return ApiResponse.success(
    res,
    testimonials,
    "Testimonials retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE TESTIMONIAL
========================================== */

const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.getById(req.params.id);

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found.");
  }

  return ApiResponse.success(
    res,
    testimonial,
    "Testimonial retrieved successfully."
  );
});

/* ==========================================
   UPDATE TESTIMONIAL
========================================== */

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.update(
    req.params.id,
    req.body
  );

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found.");
  }

  return ApiResponse.success(
    res,
    testimonial,
    "Testimonial updated successfully."
  );
});

/* ==========================================
   DELETE TESTIMONIAL
========================================== */

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.delete(req.params.id);

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found.");
  }

  return ApiResponse.success(
    res,
    null,
    "Testimonial deleted successfully."
  );
});

/* ==========================================
   FEATURED TESTIMONIALS
========================================== */

const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.featured();

  return ApiResponse.success(
    res,
    testimonials,
    "Featured testimonials retrieved successfully."
  );
});

/* ==========================================
   ACTIVE TESTIMONIALS
========================================== */

const getActiveTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.active();

  return ApiResponse.success(
    res,
    testimonials,
    "Active testimonials retrieved successfully."
  );
});

/* ==========================================
   TESTIMONIAL STATISTICS
========================================== */

const getTestimonialStats = asyncHandler(async (req, res) => {
  const stats = await testimonialService.stats();

  return ApiResponse.success(
    res,
    stats,
    "Testimonial statistics retrieved successfully."
  );
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials,
  getActiveTestimonials,
  getTestimonialStats,
};