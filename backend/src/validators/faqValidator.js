const { body } = require("express-validator");

const createFAQValidator = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("Question is required."),

  body("answer")
    .trim()
    .notEmpty()
    .withMessage("Answer is required."),

  body("category")
    .optional()
    .trim(),

  body("order")
    .optional()
    .isNumeric(),

  body("featured")
    .optional()
    .isBoolean(),

  body("active")
    .optional()
    .isBoolean(),
];

const updateFAQValidator = [
  body("question").optional().trim(),

  body("answer").optional().trim(),

  body("category").optional().trim(),

  body("order").optional().isNumeric(),

  body("featured").optional().isBoolean(),

  body("active").optional().isBoolean(),
];

module.exports = {
  createFAQValidator,
  updateFAQValidator,
};