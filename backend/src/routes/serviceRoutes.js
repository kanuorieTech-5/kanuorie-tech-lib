const express = require("express");

const router = express.Router();

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

/* ==========================================
   PUBLIC ROUTES
========================================== */

router
  .route("/")
  .get(getServices)
  .post(
    protect,
    adminOnly,
    createService
  );

router
  .route("/:id")
  .get(getService)
  .put(
    protect,
    adminOnly,
    updateService
  )
  .delete(
    protect,
    adminOnly,
    deleteService
  );

module.exports = router;