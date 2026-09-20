const { body } = require("express-validator");

const CATEGORIES = [
  "Development",
  "AI",
  "Database",
  "Design",
  "DevOps",
  "Productivity",
  "Business",
  "Cloud",
  "Security",
  "API",
  "Other",
];

const PRICING_TYPES = [
  "Free",
  "Freemium",
  "Paid",
  "Open Source",
];

/* ==========================================
   OPTIONAL URL VALIDATOR
========================================== */

const optionalUrl = (field, message) =>
  body(field)
    .optional({ values: "falsy" })
    .isURL()
    .withMessage(message);

/* ==========================================
   CREATE PRODUCT
========================================== */

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
    .withMessage("Category is required.")
    .isIn(CATEGORIES)
    .withMessage("Invalid product category."),

  body("pricingType")
    .optional()
    .trim()
    .isIn(PRICING_TYPES)
    .withMessage("Invalid pricing type."),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be numeric.")
    .custom((value) => Number(value) >= 0)
    .withMessage("Price cannot be negative."),

  optionalUrl(
    "image",
    "Image must be a valid URL."
  ),

  optionalUrl(
    "websiteUrl",
    "Website URL must be valid."
  ),

  optionalUrl(
    "documentationUrl",
    "Documentation URL must be valid."
  ),

  optionalUrl(
    "githubUrl",
    "GitHub URL must be valid."
  ),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be true or false."),
];

/* ==========================================
   UPDATE PRODUCT
========================================== */

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty."),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),

  body("category")
    .optional()
    .trim()
    .isIn(CATEGORIES)
    .withMessage("Invalid product category."),

  body("pricingType")
    .optional()
    .trim()
    .isIn(PRICING_TYPES)
    .withMessage("Invalid pricing type."),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be numeric.")
    .custom((value) => Number(value) >= 0)
    .withMessage("Price cannot be negative."),

  optionalUrl(
    "image",
    "Image must be a valid URL."
  ),

  optionalUrl(
    "websiteUrl",
    "Website URL must be valid."
  ),

  optionalUrl(
    "documentationUrl",
    "Documentation URL must be valid."
  ),

  optionalUrl(
    "githubUrl",
    "GitHub URL must be valid."
  ),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be true or false."),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};