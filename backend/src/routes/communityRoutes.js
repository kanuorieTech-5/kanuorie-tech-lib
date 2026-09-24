const express = require("express");
const {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  deleteCommunityPost,
  getCommunityCategories,
} = require("../controllers/communityController");

const protect = require("../middleware/auth");

const router = express.Router();

// Get published community posts
router.get("/", getCommunityPosts);

// Get community categories
router.get(
  "/categories",
  getCommunityCategories
);

// Get one published post
router.get("/:id", getCommunityPost);

/* ==========================================
   AUTHENTICATED COMMUNITY ACTIONS
========================================== */

router.post(
  "/",
  protect,
  createCommunityPost
);

router.delete(
  "/:id",
  protect,
  deleteCommunityPost
);

module.exports = router;