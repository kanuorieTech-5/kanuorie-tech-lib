const { body } = require("express-validator");

/* =========================
   CREATE BOOK
========================= */

const createBookValidator = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters."),

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

  body("author")
    .optional()
    .trim(),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("file")
    .optional()
    .isURL()
    .withMessage("Book file must be a valid URL."),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

];

/* =========================
   UPDATE BOOK
========================= */

const updateBookValidator = [

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters."),

  body("category")
    .optional()
    .trim(),

  body("author")
    .optional()
    .trim(),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("file")
    .optional()
    .isURL()
    .withMessage("Book file must be a valid URL."),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

];

module.exports = {
  createBookValidator,
  updateBookValidator,
};