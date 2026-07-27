const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

const validate = require("../validators/validate");

const {
  createTestimonialValidator,
  updateTestimonialValidator,
} = require("../validators/testimonialValidator");

const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials,
} = require("../controllers/testimonialController");

// Public
router.get("/", getTestimonials);
router.get("/featured", getFeaturedTestimonials);
router.get("/:id", getTestimonial);

// Admin
router.post(
  "/",
  protect,
  admin,
  createTestimonialValidator,
  validate,
  createTestimonial
);

router.put(
  "/:id",
  protect,
  admin,
  updateTestimonialValidator,
  validate,
  updateTestimonial
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteTestimonial
);

module.exports = router;