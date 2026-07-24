const express = require("express");
const router = express.Router();

const { Book } = require("../models");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const bookFields = (body) => ({
  title: body.title,
  desc: body.desc,
  category: body.category,
  img: body.img,
  link: body.link,
});

// 📥 GET ALL BOOKS (admin or authenticated users)
router.get("/", protect, async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ CREATE BOOK (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.create(bookFields(req.body));
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✏️ UPDATE BOOK
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });

    await book.update(bookFields(req.body));
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ DELETE BOOK
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });

    await book.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
