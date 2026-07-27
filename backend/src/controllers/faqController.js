const faqService = require("../services/faqService");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/* ==========================================
   CREATE FAQ
========================================== */

const createFAQ = asyncHandler(async (req, res) => {
  const faq = await faqService.create(req.body);

  return ApiResponse.success(
    res,
    faq,
    "FAQ created successfully.",
    201
  );
});

/* ==========================================
   GET ALL FAQs
========================================== */

const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await faqService.getAll(req.query);

  return ApiResponse.success(
    res,
    faqs,
    "FAQs retrieved successfully."
  );
});

/* ==========================================
   GET FEATURED FAQs
========================================== */

const getFeaturedFAQs = asyncHandler(async (req, res) => {
  const faqs = await faqService.featured();

  return ApiResponse.success(
    res,
    faqs,
    "Featured FAQs retrieved successfully."
  );
});

/* ==========================================
   GET FAQ
========================================== */

const getFAQ = asyncHandler(async (req, res) => {
  const faq = await faqService.getById(req.params.id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found.");
  }

  return ApiResponse.success(
    res,
    faq,
    "FAQ retrieved successfully."
  );
});

/* ==========================================
   UPDATE FAQ
========================================== */

const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await faqService.update(
    req.params.id,
    req.body
  );

  if (!faq) {
    throw new ApiError(404, "FAQ not found.");
  }

  return ApiResponse.success(
    res,
    faq,
    "FAQ updated successfully."
  );
});

/* ==========================================
   DELETE FAQ
========================================== */

const deleteFAQ = asyncHandler(async (req, res) => {
  const deleted = await faqService.delete(req.params.id);

  if (!deleted) {
    throw new ApiError(404, "FAQ not found.");
  }

  return ApiResponse.success(
    res,
    null,
    "FAQ deleted successfully."
  );
});

/* ==========================================
   GET FAQ CATEGORIES
========================================== */

const getCategories = asyncHandler(async (req, res) => {
  const categories = await faqService.getCategories();

  return ApiResponse.success(
    res,
    categories,
    "FAQ categories retrieved successfully."
  );
});

/* ==========================================
   TOGGLE FAQ ACTIVE STATUS
========================================== */

const toggleActive = asyncHandler(async (req, res) => {
  const faq = await faqService.toggleActive(req.params.id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found.");
  }

  return ApiResponse.success(
    res,
    faq,
    faq.active
      ? "FAQ activated successfully."
      : "FAQ deactivated successfully."
  );
});

module.exports = {
  createFAQ,
  getFAQs,
  getFeaturedFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ,
  getCategories,
  toggleActive,
};