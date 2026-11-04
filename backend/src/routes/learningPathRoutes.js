const express = require("express");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const optionalAuth = require("../middleware/optionalAuth");
const controller = require("../controllers/learningPathController");
const router = express.Router();

router.get("/", controller.getPaths);

router.get("/:id", optionalAuth, controller.getPath);

router.get("/admin", protect, adminOnly, controller.listAdmin);

router.post("/", protect, adminOnly, controller.createPath);

router.put(
  "/courses/:courseId",
  protect,
  adminOnly,
  controller.assignCourse
);

router.put("/:id", protect, adminOnly, controller.updatePath);

router.delete("/:id", protect, adminOnly, controller.removePath);

module.exports = router;