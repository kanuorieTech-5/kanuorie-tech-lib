const express = require("express");

const {
  getStats,
  getUsers,
  getUser,
  deleteUser,
  toggleBlockUser,
} = require("../controllers/adminController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   APPLY ADMIN MIDDLEWARE
========================================== */

router.use(protect);
router.use(adminOnly);

/* ==========================================
   DASHBOARD
========================================== */

router.get("/stats", getStats);

/* ==========================================
   USER MANAGEMENT
========================================== */

router.get("/users", getUsers);

router.get("/users/:id", getUser);

router.patch("/users/:id/block", toggleBlockUser);

router.delete("/users/:id", deleteUser);

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;