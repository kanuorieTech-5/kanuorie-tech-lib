const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));

router.use("/users", require("./userRoutes"));

router.use("/books", require("./bookRoutes"));

router.use("/courses", require("./courseRoutes"));

router.use("/progress", require("./progressRoutes"));

router.use("/products", require("./productRoutes"));

router.use("/projects", require("./projectRoutes"));

router.use("/services", require("./serviceRoutes"));

router.use("/contact", require("./contactRoutes"));

router.use(
  "/notifications",
  require("./notificationRoutes")
);

router.use("/upload", require("./uploadRoutes"));

module.exports = router;