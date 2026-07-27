const express = require("express");

const {
  createBlog,
  getBlogs,
  getFeaturedBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

const validate = require("../validators/validate");

const {
  createBlogValidator,
  updateBlogValidator,
} = require("../validators/blogValidator");

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

router.get("/featured", getFeaturedBlogs);

router
  .route("/")
  .get(getBlogs)
  .post(
    protect,
    admin,
    createBlogValidator,
    validate,
    createBlog
  );

router
  .route("/:id")
  .get(getBlog)
  .put(
    protect,
    admin,
    updateBlogValidator,
    validate,
    updateBlog
  )
  .delete(
    protect,
    admin,
    deleteBlog
  );

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;