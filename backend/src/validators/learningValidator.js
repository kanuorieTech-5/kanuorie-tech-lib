const { body } = require("express-validator");

/* =========================
   CREATE LEARNING RESOURCE
========================= */

const createLearningValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Title must be between 3 and 200 characters."
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 20 })
    .withMessage(
      "Description must be at least 20 characters."
    ),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("author")
    .optional()
    .trim(),

  body("image")
    .optional()
    .isURL()
    .withMessage(
      "Image must be a valid URL."
    ),

  body("pdf")
    .optional()
    .isURL()
    .withMessage(
      "PDF must be a valid URL."
    ),

  body("link")
    .optional()
    .isURL()
    .withMessage(
      "Link must be a valid URL."
    ),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "Price must be a positive number."
    ),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage(
      "Featured must be true or false."
    ),

  body("premium")
    .optional()
    .isBoolean()
    .withMessage(
      "Premium must be true or false."
    ),

  body("published")
    .optional()
    .isBoolean()
    .withMessage(
      "Published must be true or false."
    ),
];

/* =========================
   UPDATE LEARNING RESOURCE
========================= */

const updateLearningValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Title must be between 3 and 200 characters."
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage(
      "Description must be at least 20 characters."
    ),

  body("category")
    .optional()
    .trim(),

  body("author")
    .optional()
    .trim(),

  body("image")
    .optional()
    .isURL()
    .withMessage(
      "Image must be a valid URL."
    ),

  body("pdf")
    .optional()
    .isURL()
    .withMessage(
      "PDF must be a valid URL."
    ),

  body("link")
    .optional()
    .isURL()
    .withMessage(
      "Link must be a valid URL."
    ),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "Price must be a positive number."
    ),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage(
      "Featured must be true or false."
    ),

  body("premium")
    .optional()
    .isBoolean()
    .withMessage(
      "Premium must be true or false."
    ),

  body("published")
    .optional()
    .isBoolean()
    .withMessage(
      "Published must be true or false."
    ),
];

module.exports = {
  createLearningValidator,
  updateLearningValidator,
};