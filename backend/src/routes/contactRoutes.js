const express = require("express");

const {
  createMessage,
  createReport,
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
  getContactStats,
} = require("../controllers/contactController");

const {
  createServiceEnquiry,
  getServiceEnquiries,
  getServiceEnquiryStats,
  updateServiceEnquiryStatus,
} = require("../controllers/serviceEnquiryController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* PUBLIC CONTACT AND SERVICE ENQUIRY SUBMISSIONS */

router.post("/", createMessage);
router.post("/service-enquiries", createServiceEnquiry);
router.post("/reports", createReport);
/* ADMIN SERVICE ENQUIRIES */

router.get(
  "/service-enquiries/stats",
  protect,
  adminOnly,
  getServiceEnquiryStats
);

router.get(
  "/service-enquiries",
  protect,
  adminOnly,
  getServiceEnquiries
);

router.patch(
  "/service-enquiries/:id/status",
  protect,
  adminOnly,
  updateServiceEnquiryStatus
);

/* ADMIN CONTACT MESSAGES */

router.get("/stats", protect, adminOnly, getContactStats);
router.get("/", protect, adminOnly, getMessages);

router
  .route("/:id")
  .get(protect, adminOnly, getMessage)
  .delete(protect, adminOnly, deleteMessage);

router.put("/:id/read", protect, adminOnly, markAsRead);

module.exports = router;
