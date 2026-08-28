const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const upload = require("../middleware/upload");

/* ==========================================
   CURRENT USER PROFILE
========================================== */

router
  .route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

/* ==========================================
   CURRENT USER AVATAR
========================================== */

router.put(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

router.delete(
  "/avatar",
  protect,
  deleteAvatar
);

/* ==========================================
   ADMIN USER MANAGEMENT
========================================== */

router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getUser
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

router.put(
  "/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

module.exports = router;