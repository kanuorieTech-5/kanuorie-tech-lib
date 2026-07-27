const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

/* ==========================================
   CURRENT USER
========================================== */

router
  .route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

/* ==========================================
   ADMIN USER MANAGEMENT
========================================== */

router
  .route("/")
  .get(protect, adminOnly, getUsers);

router
  .route("/:id")
  .get(protect, adminOnly, getUser)
  .delete(protect, adminOnly, deleteUser);

router.put(
  "/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

module.exports = router;