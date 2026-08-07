const express = require("express");

const router = express.Router();

// Authentication
router.use("/auth", require("./authRoutes"));

// Users
router.use("/users", require("./userRoutes"));

// Library
router.use("/books", require("./bookRoutes"));
router.use("/courses", require("./courseRoutes"));
router.use("/progress", require("./progressRoutes"));

// Business
router.use("/products", require("./productRoutes"));
router.use("/projects", require("./projectRoutes"));
router.use("/services", require("./serviceRoutes"));

// Website CMS
router.use("/blog", require("./blogRoutes"));
router.use("/team", require("./teamRoutes"));
router.use("/testimonials", require("./testimonialRoutes"));
router.use("/faq", require("./faqRoutes"));
router.use("/newsletter", require("./newsletterRoutes"));

// Contact
router.use("/contact", require("./contactRoutes"));

// Notifications
router.use("/notifications", require("./notificationRoutes"));

// Uploads
router.use("/upload", require("./uploadRoutes"));

// Admin
router.use("/admin", require("./adminRoutes"));

module.exports = router;