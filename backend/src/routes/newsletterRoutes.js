const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

const validate = require("../validators/validate");

const {
  subscribeValidator,
} = require("../validators/newsletterValidator");

const {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
} = require("../controllers/newsletterController");

/* ==========================================
   PUBLIC ROUTES
========================================== */

router.post(
  "/subscribe",
  subscribeValidator,
  validate,
  subscribe
);

router.post(
  "/unsubscribe",
  subscribeValidator,
  validate,
  unsubscribe
);

/* ==========================================
   ADMIN ROUTES
========================================== */

router
  .route("/")
  .get(
    protect,
    admin,
    getSubscribers
  );

router
  .route("/:id")
  .delete(
    protect,
    admin,
    deleteSubscriber
  );

module.exports = router;