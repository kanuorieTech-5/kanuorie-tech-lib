const { body } = require("express-validator");

const createTestimonialValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required."),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  body("featured")
    .optional()
    .isBoolean(),

  body("active")
    .optional()
    .isBoolean(),

  body("order")
    .optional()
    .isNumeric(),

];

const updateTestimonialValidator = [

  body("name").optional(),

  body("message").optional(),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 }),

];

module.exports = {
  createTestimonialValidator,
  updateTestimonialValidator,
};