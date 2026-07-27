const express = require("express");

const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  getCategories,
} = require("../controllers/bookController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../validators/validate");

const {
  createBookValidator,
  updateBookValidator,
} = require("../validators/bookValidator");

const router = express.Router();

/* ==========================================
   PUBLIC ROUTES
========================================== */

router.get("/featured", getFeaturedBooks);

router.get("/categories", getCategories);

router
  .route("/")
  .get(getBooks)
  .post(
    protect,
    admin,
    createBookValidator,
    validate,
    createBook
  );

router
  .route("/:id")
  .get(getBook)
  .put(
    protect,
    admin,
    updateBookValidator,
    validate,
    updateBook
  )
  .delete(
    protect,
    admin,
    deleteBook
  );

module.exports = router;