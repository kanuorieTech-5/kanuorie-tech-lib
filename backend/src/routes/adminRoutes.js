const express = require("express");

const {
  getStats,
  getUsers,
  getUser,
  deleteUser,
  toggleBlockUser,
} = require("../controllers/adminController");

const {
  getAdminNotifications,
  deleteAdminNotification,
  clearAdminNotifications,
} = require("../controllers/notificationController");

const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const {
  createLearningResource,
  getLearningResources,
  updateLearningResource,
  deleteLearningResource,
} = require("../controllers/learningController");

const {
  getOperationsAffiliates,
  updateOperationsAffiliateStatus,
  getOperationsPayouts,
  updateOperationsPayoutStatus,
  getOperationsCommunityReports,
  updateOperationsCommunityReport,
  updateOperationsCommunityPost,
} = require("../controllers/adminOperationsController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

/* ==========================================
   ADMIN PROTECTION
========================================== */

router.use(protect);
router.use(adminOnly);

/* ==========================================
   DASHBOARD
========================================== */

router.get(
  "/dashboard",
  getStats
);

router.get(
  "/stats",
  getStats
);

/* ==========================================
   USERS
========================================== */

router.get(
  "/users",
  getUsers
);

router.get(
  "/users/:id",
  getUser
);

router.patch(
  "/users/:id/block",
  toggleBlockUser
);

router.delete(
  "/users/:id",
  deleteUser
);

/* ==========================================
   NOTIFICATIONS
========================================== */

router.get(
  "/notifications",
  getAdminNotifications
);

router.delete(
  "/notifications/:id",
  deleteAdminNotification
);

router.delete(
  "/notifications",
  clearAdminNotifications
);

/* ==========================================
   BLOG
========================================== */

router.get(
  "/blog",
  getBlogs
);

router.post(
  "/blog",
  createBlog
);

router.put(
  "/blog/:id",
  updateBlog
);

router.delete(
  "/blog/:id",
  deleteBlog
);

/* ==========================================
   LEARNING RESOURCES
========================================== */

router
  .route("/learning")
  .get(getLearningResources)
  .post(createLearningResource);

router
  .route("/learning/:id")
  .put(updateLearningResource)
  .delete(deleteLearningResource);

/* ==========================================
  PLATFORM OPERATIONS
========================================== */

// Affiliates
router.get(
  "/operations/affiliates",
  getOperationsAffiliates
);

router.patch(
  "/operations/affiliates/:id/status",
  updateOperationsAffiliateStatus
);

// Affiliate payouts
router.get(
  "/operations/payouts",
  getOperationsPayouts
);

router.patch(
  "/operations/payouts/:id/status",
  updateOperationsPayoutStatus
);

// Community reports
router.get(
  "/operations/community-reports",
  getOperationsCommunityReports
);

router.patch(
  "/operations/community-reports/:id/status",
  updateOperationsCommunityReport
);

// Community post moderation
router.patch(
  "/operations/community-posts/:id/status",
  updateOperationsCommunityPost
);

module.exports = router;