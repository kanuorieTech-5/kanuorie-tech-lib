const { body } = require("express-validator");

/* ==========================================
   CREATE TEAM VALIDATOR
========================================== */

const createTeamValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required."),

  body("position")
    .notEmpty()
    .withMessage("Position is required."),

  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email address."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be true or false."),

  body("order")
    .optional()
    .isNumeric()
    .withMessage("Order must be a number."),
];

/* ==========================================
   UPDATE TEAM VALIDATOR
========================================== */

const updateTeamValidator = [
  body("firstName")
    .optional(),

  body("lastName")
    .optional(),

  body("position")
    .optional(),

  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email address."),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false."),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be true or false."),

  body("order")
    .optional()
    .isNumeric()
    .withMessage("Order must be a number."),
];

module.exports = {
  createTeamValidator,
  updateTeamValidator,
};