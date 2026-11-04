
const express = require("express");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const optionalAuth = require("../middleware/optionalAuth");

const controller = require("../controllers/learningPathController");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all published learning pathways
router.get("/", controller.getPaths);

// ==========================================
// ADMIN ROUTES
// Keep these BEFORE the /:id route.
// ==========================================

// Get all learning pathways, including unpublished drafts
router.get("/admin", protect, adminOnly, controller.listAdmin);

// Create a learning pathway
router.post("/", protect, adminOnly, controller.createPath);

// Assign or remove a course from a learning pathway
router.put(
  "/courses/:courseId",
  protect,
  adminOnly,
  controller.assignCourse
);

// Update a learning pathway
router.put("/:id", protect, adminOnly, controller.updatePath);

// Delete a learning pathway
router.delete("/:id", protect, adminOnly, controller.removePath);

// Get a specific learning pathway by MongoDB ID or slug
router.get("/:id", optionalAuth, controller.getPath);

module.exports = router;
