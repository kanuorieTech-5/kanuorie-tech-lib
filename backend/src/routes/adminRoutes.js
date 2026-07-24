const express = require("express");
const router = express.Router();

/* =========================
   CONTROLLERS
========================= */
const {
  getStats,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");

const {
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

/* =========================
   MIDDLEWARE
========================= */
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

/* =========================
   🔐 ADMIN ROUTES (USER MANAGEMENT)
========================= */
router.get("/admin/stats", protect, adminOnly, getStats);
router.get("/admin/users", protect, adminOnly, getUsers);
router.delete("/admin/users/:id", protect, adminOnly, deleteUser);

/* =========================
   📚 BOOK ROUTES (ADMIN ONLY)
========================= */
router.post("/books", protect, adminOnly, createBook);
router.put("/books/:id", protect, adminOnly, updateBook);
router.delete("/books/:id", protect, adminOnly, deleteBook);

module.exports = router;