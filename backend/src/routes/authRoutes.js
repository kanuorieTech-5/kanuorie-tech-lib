const express = require("express");

const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/auth");

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

router.route("/register").post(register);

router.route("/login").post(login);

/* ==========================================
   PROTECTED ROUTES
========================================== */

router.route("/me").get(protect, getCurrentUser);

router.route("/profile").put(protect, updateProfile);

router.route("/change-password").put(
  protect,
  changePassword
);

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;