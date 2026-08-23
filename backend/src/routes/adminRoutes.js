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
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get(
  "/dashboard",
  getStats
);

router.get(
  "/stats",
  getStats
);

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

router
  .route("/books")
  .get(getBooks)
  .post(createBook);

router
  .route("/books/:id")
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;