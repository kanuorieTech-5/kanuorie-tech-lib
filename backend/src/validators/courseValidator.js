const { body } = require("express-validator");

const createCourseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Course title must be between 3 and 100 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("link")
    .optional()
    .isURL()
    .withMessage("Course link must be a valid URL."),
];

const updateCourseValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20 }),

  body("category")
    .optional()
    .trim(),

  body("image")
    .optional()
    .isURL(),

  body("link")
    .optional()
    .isURL(),
];

module.exports = {
  createCourseValidator,
  updateCourseValidator,
};