const express = require("express");
const {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  deleteCommunityPost,
  getCommunityCategories,
  getCommunityComments,
  createCommunityComment,
  toggleCommunityLike,
  toggleCommunitySave,
  shareCommunityPost,
} = require("../controllers/communityController");

const protect = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

// Get published community posts
router.get("/", optionalAuth, getCommunityPosts);

// Get community categories
router.get(
  "/categories",
  getCommunityCategories
);

// Get one published post
router.get("/:id", optionalAuth, getCommunityPost);

/* ==========================================
   AUTHENTICATED COMMUNITY ACTIONS
========================================== */

router.post(
  "/",
  protect,
  createCommunityPost
);

router.get("/:id/comments", getCommunityComments);
router.post("/:id/comments", protect, createCommunityComment);
router.post("/:id/like", protect, toggleCommunityLike);
router.post("/:id/save", protect, toggleCommunitySave);
router.post("/:id/share", shareCommunityPost);

router.delete(
  "/:id",
  protect,
  deleteCommunityPost
);

module.exports = router;
