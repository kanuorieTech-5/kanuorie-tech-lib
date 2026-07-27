const { body } = require("express-validator");

const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be numeric."),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),
];

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty(),

  body("description")
    .optional()
    .trim(),

  body("category")
    .optional()
    .trim(),

  body("price")
    .optional()
    .isNumeric(),

  body("image")
    .optional()
    .isURL(),

  body("featured")
    .optional()
    .isBoolean(),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};