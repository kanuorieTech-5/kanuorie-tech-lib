const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../validators/validate");

const {
  createFAQValidator,
  updateFAQValidator,
} = require("../validators/faqValidator");

const {
  createFAQ,
  getFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ,
  getFeaturedFAQs,
} = require("../controllers/faqController");

/* =========================
   PUBLIC ROUTES
========================= */

router.get("/", getFAQs);

router.get("/featured", getFeaturedFAQs);

router.get("/:id", getFAQ);

/* =========================
   ADMIN ROUTES
========================= */

router.post(
  "/",
  protect,
  admin,
  createFAQValidator,
  validate,
  createFAQ
);

router.put(
  "/:id",
  protect,
  admin,
  updateFAQValidator,
  validate,
  updateFAQ
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteFAQ
);

module.exports = router;