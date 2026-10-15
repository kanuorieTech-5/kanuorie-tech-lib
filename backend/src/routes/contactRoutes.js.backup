const express = require("express");

const {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
  getContactStats,
} = require("../controllers/contactController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

router
  .route("/")
  .post(createMessage);

/* ==========================================
   ADMIN ROUTES
========================================== */

router.get(
  "/stats",
  protect,
  adminOnly,
  getContactStats
);

router
  .route("/")
  .get(
    protect,
    adminOnly,
    getMessages
  );

router
  .route("/:id")
  .get(
    protect,
    adminOnly,
    getMessage
  )
  .delete(
    protect,
    adminOnly,
    deleteMessage
  );

router.put(
  "/:id/read",
  protect,
  adminOnly,
  markAsRead
);

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;