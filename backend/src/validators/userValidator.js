const { body } = require("express-validator");

/* =========================
   CREATE USER
========================= */

const createUserValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin."),
];

/* =========================
   UPDATE USER
========================= */

const updateUserValidator = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters."),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("avatar")
    .optional()
    .isURL()
    .withMessage("Avatar must be a valid URL."),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Invalid phone number."),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters."),
];

/* =========================
   CHANGE PASSWORD
========================= */

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("New password must contain an uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("New password must contain a lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("New password must contain a number."),
];

/* =========================
   UPDATE ROLE (ADMIN)
========================= */

const updateRoleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin."),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  changePasswordValidator,
  updateRoleValidator,
};