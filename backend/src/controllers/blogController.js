const blogService = require("../services/blogService");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE BLOG
========================================== */

const createBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.create(req.body, req.user);

  return ApiResponse.success(
    res,
    blog,
    "Blog created successfully.",
    201
  );
});

/* ==========================================
   GET ALL BLOGS
========================================== */

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getAll(req.query);

  return ApiResponse.success(
    res,
    blogs,
    "Blogs retrieved successfully."
  );
});

/* ==========================================
   GET FEATURED BLOGS
========================================== */

const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getFeatured();

  return ApiResponse.success(
    res,
    blogs,
    "Featured blogs retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE BLOG
========================================== */

const getBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.getById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  return ApiResponse.success(
    res,
    blog,
    "Blog retrieved successfully."
  );
});

/* ==========================================
   UPDATE BLOG
========================================== */

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.update(
    req.params.id,
    req.body
  );

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  return ApiResponse.success(
    res,
    blog,
    "Blog updated successfully."
  );
});

/* ==========================================
   DELETE BLOG
========================================== */

const deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await blogService.delete(req.params.id);

  if (!deleted) {
    throw new ApiError(404, "Blog not found.");
  }

  return ApiResponse.success(
    res,
    null,
    "Blog deleted successfully."
  );
});

/* ==========================================
   GET BLOG CATEGORIES
========================================== */

const getCategories = asyncHandler(async (req, res) => {
  const categories = await blogService.getCategories();

  return ApiResponse.success(
    res,
    categories,
    "Blog categories retrieved successfully."
  );
});

/* ==========================================
   TOGGLE PUBLISH STATUS
========================================== */

const togglePublish = asyncHandler(async (req, res) => {
  const blog = await blogService.togglePublish(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  return ApiResponse.success(
    res,
    blog,
    blog.published
      ? "Blog published successfully."
      : "Blog unpublished successfully."
  );
});

/* ==========================================
   INCREMENT BLOG VIEWS
========================================== */

const incrementViews = asyncHandler(async (req, res) => {
  const blog = await blogService.incrementViews(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  return ApiResponse.success(
    res,
    blog,
    "Blog view recorded."
  );
});

module.exports = {
  createBlog,
  getBlogs,
  getFeaturedBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getCategories,
  togglePublish,
  incrementViews,
};