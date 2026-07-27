const { body } = require("express-validator");

const createBlogValidator = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters."),

  body("excerpt")
    .trim()
    .notEmpty()
    .withMessage("Excerpt is required.")
    .isLength({ min: 20, max: 300 })
    .withMessage("Excerpt must be between 20 and 300 characters."),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required.")
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters."),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be true or false."),

  body("category")
    .optional()
    .trim(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array."),

];

const updateBlogValidator = [

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters."),

  body("excerpt")
    .optional()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage("Excerpt must be between 20 and 300 characters."),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters."),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("featured")
    .optional()
    .isBoolean(),

  body("published")
    .optional()
    .isBoolean(),

  body("category")
    .optional()
    .trim(),

  body("tags")
    .optional()
    .isArray(),

];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
};