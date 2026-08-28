const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const upload = require("../middleware/upload");

/* ==========================================
   CURRENT USER
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
router.put(
  "/change-password",
  protect,
  changePassword
);
module.exports = router;