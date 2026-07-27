const { body } = require("express-validator");

const serviceValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required."),

  body("order")
    .optional()
    .isNumeric()
    .withMessage("Order must be a number."),
];

module.exports = serviceValidator;