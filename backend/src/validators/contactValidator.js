const { body } = require("express-validator");

const contactValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  body("email")
    .isEmail()
    .withMessage("Valid email required."),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required."),

  body("message")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters."),
];

module.exports = contactValidator;