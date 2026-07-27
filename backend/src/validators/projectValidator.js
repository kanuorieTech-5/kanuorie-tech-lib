const { body } = require("express-validator");

const createProjectValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("client")
    .optional()
    .trim(),

  body("projectUrl")
    .optional()
    .isURL()
    .withMessage("Project URL must be valid."),

  body("githubUrl")
    .optional()
    .isURL()
    .withMessage("GitHub URL must be valid."),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),
];

const updateProjectValidator = [
  body("title")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("category")
    .optional()
    .trim(),

  body("client")
    .optional()
    .trim(),

  body("projectUrl")
    .optional()
    .isURL(),

  body("githubUrl")
    .optional()
    .isURL(),

  body("image")
    .optional()
    .isURL(),

  body("featured")
    .optional()
    .isBoolean(),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
};