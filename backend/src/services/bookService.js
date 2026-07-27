const Book = require("../models/Book");

const paginate = require("../helpers/pagination");
const buildQuery = require("../helpers/queryBuilder");
// const slugify = require("../helpers/slugify");

/* =========================
   CREATE BOOK
========================= */

exports.create = async (data, user) => {
  const book = await Book.create({
    ...data,
    // slug: slugify(data.title),
    createdBy: user._id,
  });

  return book;
};

/* =========================
   GET BOOKS
========================= */

exports.getBooks = async (query = {}) => {
  const filters = buildQuery(query);

  const { page, limit, skip } = paginate(
    query.page,
    query.limit
  );

  const books = await Book.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(filters);

  return {
    books,
    page,
    pages: Math.ceil(total / limit),
    total,
  };
};

/* =========================
   GET SINGLE BOOK
========================= */

exports.getById = async (id) => {
  const book = await Book.findById(id);

  if (!book) return null;

  book.views = (book.views || 0) + 1;
  await book.save();

  return book;
};

/* =========================
   UPDATE BOOK
========================= */

exports.update = async (id, data) => {
  if (data.title) {
    // data.slug = slugify(data.title);
  }

  return Book.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

/* =========================
   DELETE BOOK
========================= */

exports.delete = async (id) => {
  return Book.findByIdAndDelete(id);
};

/* =========================
   FEATURED BOOKS
========================= */

exports.getFeatured = async (limit = 6) => {
  return Book.find({
    featured: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/* =========================
   RELATED BOOKS
========================= */

exports.getRelated = async (bookId, category) => {
  return Book.find({
    _id: { $ne: bookId },
    category,
  }).limit(4);
};