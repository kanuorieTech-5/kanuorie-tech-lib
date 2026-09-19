const express = require("express");

const {
  getSavedResources,
  saveResource,
  removeSavedResource,
  checkSavedResource,
} = require("../controllers/savedResourceController");

const protect = require("../middleware/auth");

const router = express.Router();

/* ==========================================
   ALL LIBRARY ROUTES REQUIRE AUTHENTICATION
========================================== */

router.use(protect);

/* ==========================================
   SAVED RESOURCES
========================================== */

// Get all resources saved by current user
router.get("/saved", getSavedResources);

// Save a course/book/resource
router.post("/saved", saveResource);

// Check whether current user saved a resource
router.get(
  "/saved/:resourceId",
  checkSavedResource
);

// Remove saved resource
router.delete(
  "/saved/:resourceId",
  removeSavedResource
);

module.exports = router;