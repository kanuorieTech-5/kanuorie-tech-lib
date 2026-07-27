const Book = require("../models/Book");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE BOOK
========================================== */

const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return ApiResponse.success(
    res,
    book,
    "Book created successfully.",
    201
  );
});

/* ==========================================
   GET ALL BOOKS
========================================== */

const getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.featured) {
    filter.featured = req.query.featured === "true";
  }

  if (req.query.premium) {
    filter.premium = req.query.premium === "true";
  }

  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }

  if (req.query.search) {
    filter.$or = [
      {
        title: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        author: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }

  const sort = {};

  switch (req.query.sort) {
    case "oldest":
      sort.createdAt = 1;
      break;

    case "downloads":
      sort.downloads = -1;
      break;

    case "rating":
      sort.rating = -1;
      break;

    case "views":
      sort.views = -1;
      break;

    default:
      sort.createdAt = -1;
  }

  const [books, total] = await Promise.all([
    Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Book.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    books,
    "Books retrieved successfully.",
    200,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  );
});

/* ==========================================
   GET SINGLE BOOK
========================================== */

const getBook = asyncHandler(async (req, res) => {
  const identifier = req.params.id;

  const filter = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const book = await Book.findOneAndUpdate(
    filter,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  return ApiResponse.success(
    res,
    book,
    "Book retrieved successfully."
  );
});

/* ==========================================
   UPDATE BOOK
========================================== */

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  return ApiResponse.success(
    res,
    book,
    "Book updated successfully."
  );
});

/* ==========================================
   DELETE BOOK
========================================== */

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  await book.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Book deleted successfully."
  );
});

/* ==========================================
   FEATURED BOOKS
========================================== */

const getFeaturedBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({
    featured: true,
  })
    .sort({
      createdAt: -1,
    })
    .limit(8);

  return ApiResponse.success(
    res,
    books,
    "Featured books retrieved successfully."
  );
});

/* ==========================================
   BOOK CATEGORIES
========================================== */

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Book.distinct("category");

  return ApiResponse.success(
    res,
    categories,
    "Categories retrieved successfully."
  );
});

/* ==========================================
   DOWNLOAD BOOK
========================================== */

const downloadBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $inc: {
        downloads: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!book) {
    throw new ApiError(404, "Book not found.");
  }

  return ApiResponse.success(
    res,
    {
      downloadUrl: book.pdf || book.link,
    },
    "Download started."
  );
});

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  getCategories,
  downloadBook,
};