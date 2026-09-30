const express = require("express");

const {
  createLearningResource,
  getLearningResources,
  getLearningResource,
  updateLearningResource,
  deleteLearningResource,
  getFeaturedLearning,
  getLearningCategories,
  downloadLearningResource,
} = require("../controllers/learningController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../validators/validate");

const {
  createLearningValidator,
  updateLearningValidator,
} = require("../validators/learningValidator");

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

router.get(
  "/featured",
  getFeaturedLearning
);

router.get(
  "/categories",
  getLearningCategories
);

router
  .route("/")
  .get(getLearningResources)
  .post(
    protect,
    admin,
    createLearningValidator,
    validate,
    createLearningResource
  );

/* ==========================================
   DOWNLOAD
========================================== */

router.get(
  "/:id/download",
  protect,
  downloadLearningResource
);

/* ==========================================
   SINGLE RESOURCE
========================================== */

router
  .route("/:id")
  .get(getLearningResource)
  .put(
    protect,
    admin,
    updateLearningValidator,
    validate,
    updateLearningResource
  )
  .delete(
    protect,
    admin,
    deleteLearningResource
  );

module.exports = router;