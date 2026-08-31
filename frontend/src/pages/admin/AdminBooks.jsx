import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Card, Button, Loader } from "../../components/common";

import {
  getAdminBooks,
  createAdminBook,
  updateAdminBook,
  deleteAdminBook,
  getCategories,
} from "../../services";

const PAGE_SIZE = 12;

const EMPTY_FORM = {
  title: "",
  description: "",
  author: "",
  category: "",
  image: "",
  pdf: "",
  link: "",
  preview: "",
  tags: "",
  difficulty: "Beginner",
  language: "English",
  pages: 0,
  featured: false,
  premium: false,
  price: 0,
  published: true,
  fileSize: 0,
  isbn: "",
};

function extractData(response) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data?.books)) {
    return response.data.books;
  }

  if (Array.isArray(response?.books)) {
    return response.books;
  }

  return [];
}

function extractMeta(response) {
  return (
    response?.meta || response?.data?.meta || response?.data?.data?.meta || {}
  );
}

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [premium, setPremium] = useState("");
  const [featured, setFeatured] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: PAGE_SIZE,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      if (difficulty) {
        params.difficulty = difficulty;
      }

      if (premium !== "") {
        params.premium = premium;
      }

      if (featured !== "") {
        params.featured = featured;
      }

      if (sort) {
        params.sort = sort;
      }

      const response = await getAdminBooks(params);

      const data = extractData(response);
      const meta = extractMeta(response);

      setBooks(data);

      setTotalBooks(
        Number(meta.total) || Number(response?.total) || data.length,
      );

      setTotalPages(
        Number(meta.pages) ||
          Math.max(
            1,
            Math.ceil((Number(meta.total) || data.length) / PAGE_SIZE),
          ),
      );
    } catch (err) {
      console.error("Failed to load books:", err);

      setError(err?.response?.data?.message || "Unable to load books.");

      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty, premium, featured, sort]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();

      const data = extractData(response);

      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const stats = useMemo(() => {
    return {
      total: totalBooks,
      published: books.filter((book) => book.published).length,
      premium: books.filter((book) => book.premium).length,
      featured: books.filter((book) => book.featured).length,
    };
  }, [books, totalBooks]);

  const openCreateModal = () => {
    setEditingBook(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);

    setForm({
      title: book.title || "",
      description: book.description || "",
      author: book.author || "",
      category: book.category || "",
      image: book.image || "",
      pdf: book.pdf || "",
      link: book.link || "",
      preview: book.preview || "",
      tags: Array.isArray(book.tags) ? book.tags.join(", ") : "",
      difficulty: book.difficulty || "Beginner",
      language: book.language || "English",
      pages: book.pages || 0,
      featured: Boolean(book.featured),
      premium: Boolean(book.premium),
      price: book.price || 0,
      published: book.published !== undefined ? Boolean(book.published) : true,
      fileSize: book.fileSize || 0,
      isbn: book.isbn || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingBook(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Book title is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Book description is required.");
      return;
    }

    if (!form.category.trim()) {
      toast.error("Book category is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        author: form.author.trim(),
        category: form.category.trim(),

        image: form.image.trim(),
        pdf: form.pdf.trim(),
        link: form.link.trim(),
        preview: form.preview.trim(),

        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        difficulty: form.difficulty,
        language: form.language.trim(),

        pages: Number(form.pages) || 0,

        featured: Boolean(form.featured),
        premium: Boolean(form.premium),

        price: Number(form.price) || 0,

        published: Boolean(form.published),

        fileSize: Number(form.fileSize) || 0,

        isbn: form.isbn.trim(),
      };

      if (editingBook) {
        await updateAdminBook(editingBook._id, payload);

        toast.success("Book updated successfully.");
      } else {
        await createAdminBook(payload);

        toast.success("Book created successfully.");
      }

      closeModal();
      await loadBooks();
      await loadCategories();
    } catch (err) {
      console.error("Book save error:", err);

      toast.error(err?.response?.data?.message || "Failed to save book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    const confirmed = window.confirm(
      `Delete "${book.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(book._id);

      await deleteAdminBook(book._id);

      toast.success("Book deleted successfully.");

      await loadBooks();
    } catch (err) {
      console.error("Book deletion error:", err);

      toast.error(err?.response?.data?.message || "Failed to delete book.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setPremium("");
    setFeatured("");
    setSort("newest");
    setPage(1);
  };

  return (
    <section className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Content Management
          </p>

          <h1 className="text-3xl font-bold text-slate-900">Books</h1>

          <p className="mt-2 text-slate-500">
            Manage your digital library, publications and downloadable
            resources.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Books" value={stats.total} icon={BookOpen} />

        <Stat label="Published" value={stats.published} icon={Eye} />

        <Stat label="Premium" value={stats.premium} icon={Star} />

        <Stat label="Featured" value={stats.featured} icon={BookOpen} />
      </div>

      {/* FILTERS */}
      <Card className="p-5">
        <div className="mb-5 flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-500" />

          <h2 className="font-semibold text-slate-900">Filters</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* SEARCH */}
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search books..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* DIFFICULTY */}
          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* PREMIUM */}
          <select
            value={premium}
            onChange={(event) => {
              setPremium(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Books</option>
            <option value="true">Premium</option>
            <option value="false">Free</option>
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="downloads">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={featured}
            onChange={(event) => {
              setFeatured(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Featured: All</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reset Filters
          </button>
        </div>
      </Card>

      {/* ERROR */}
      {error && (
        <Card className="border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">{error}</p>

          <button
            type="button"
            onClick={loadBooks}
            className="mt-3 text-sm font-semibold text-red-600 underline"
          >
            Try again
          </button>
        </Card>
      )}

      {/* BOOKS */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader />
          </div>
        ) : books.length === 0 ? (
          <EmptyState onAdd={openCreateModal} />
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Book
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stats
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {books.map((book) => (
                    <BookRow
                      key={book._id}
                      book={book}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {books.map((book) => (
                <BookMobileCard
                  key={book._id}
                  book={book}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))}
            </div>
          </>
        )}
      </Card>

      {/* PAGINATION */}
      {!loading && books.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="px-3 text-sm font-medium">{page}</span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <BookModal
          form={form}
          editingBook={editingBook}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </section>
  );
}

/* ==========================================
   STAT
========================================== */

function Stat({ label, value, icon: Icon }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {value.toLocaleString()}
        </p>
      </div>
    </Card>
  );
}

/* ==========================================
   BOOK ROW
========================================== */

function BookRow({ book, onEdit, onDelete, deletingId }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex min-w-[280px] items-center gap-4">
          <img
            src={book.image || "/images/book-placeholder.png"}
            alt={book.title}
            className="h-16 w-12 rounded-lg object-cover"
          />

          <div>
            <p className="font-semibold text-slate-900">{book.title}</p>

            <p className="mt-1 text-sm text-slate-500">
              {book.author || "Unknown"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {book.category}
        </span>
      </td>

      <td className="px-6 py-4 font-semibold text-slate-900">
        {Number(book.price) > 0
          ? `₦${Number(book.price).toLocaleString()}`
          : "Free"}
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <Status
            active={book.published}
            label={book.published ? "Published" : "Draft"}
          />

          {book.premium && <Status active label="Premium" />}

          {book.featured && <Status active label="Featured" />}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-slate-500">
        <div>{Number(book.views || 0).toLocaleString()} views</div>

        <div>{Number(book.downloads || 0).toLocaleString()} downloads</div>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
            title="Edit book"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={deletingId === book._id}
            onClick={() => onDelete(book)}
            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            title="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ==========================================
   MOBILE BOOK CARD
========================================== */

function BookMobileCard({ book, onEdit, onDelete, deletingId }) {
  return (
    <div className="p-5">
      <div className="flex gap-4">
        <img
          src={book.image || "/images/book-placeholder.png"}
          alt={book.title}
          className="h-24 w-16 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">{book.title}</h3>

          <p className="mt-1 text-sm text-slate-500">
            {book.author || "Unknown"}
          </p>

          <p className="mt-3 font-semibold text-blue-600">
            {Number(book.price) > 0
              ? `₦${Number(book.price).toLocaleString()}`
              : "Free"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Status
          active={book.published}
          label={book.published ? "Published" : "Draft"}
        />

        {book.premium && <Status active label="Premium" />}

        {book.featured && <Status active label="Featured" />}
      </div>

      <div className="mt-5 flex gap-2">
        <Button variant="secondary" onClick={() => onEdit(book)}>
          <Edit3 className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <button
          type="button"
          disabled={deletingId === book._id}
          onClick={() => onDelete(book)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="mr-2 inline h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   STATUS
========================================== */

function Status({ active, label }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}

/* ==========================================
   EMPTY STATE
========================================== */

function EmptyState({ onAdd }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-slate-100 p-5">
        <BookOpen className="h-10 w-10 text-slate-400" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">No books found</h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        There are no books matching your current filters.
      </p>

      <Button className="mt-6" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add First Book
      </Button>
    </div>
  );
}

/* ==========================================
   BOOK MODAL
========================================== */

function BookModal({ form, editingBook, saving, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingBook
                ? "Update the book information."
                : "Add a new resource to your digital library."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="overflow-y-auto p-6">
          <div className="space-y-8">
            {/* BASIC INFORMATION */}
            <FormSection title="Basic Information">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Title *"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Book title"
                />

                <Input
                  label="Author"
                  name="author"
                  value={form.author}
                  onChange={onChange}
                  placeholder="Author name"
                />

                <Input
                  label="Category *"
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  placeholder="Frontend, Backend, AI..."
                />

                <Input
                  label="ISBN"
                  name="isbn"
                  value={form.isbn}
                  onChange={onChange}
                  placeholder="ISBN"
                />
              </div>

              <TextArea
                label="Description *"
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Describe the book..."
              />
            </FormSection>

            {/* MEDIA */}
            <FormSection title="Media & Files">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Cover Image URL"
                  name="image"
                  value={form.image}
                  onChange={onChange}
                  placeholder="https://..."
                />

                <Input
                  label="PDF URL"
                  name="pdf"
                  value={form.pdf}
                  onChange={onChange}
                  placeholder="https://..."
                />

                <Input
                  label="External Link"
                  name="link"
                  value={form.link}
                  onChange={onChange}
                  placeholder="https://..."
                />

                <Input
                  label="Preview URL"
                  name="preview"
                  value={form.preview}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </div>

              {form.image && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Cover Preview
                  </p>

                  <img
                    src={form.image}
                    alt="Book preview"
                    className="h-40 w-28 rounded-lg object-cover shadow"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </FormSection>

            {/* DETAILS */}
            <FormSection title="Book Details">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Select
                  label="Difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={onChange}
                  options={["Beginner", "Intermediate", "Advanced"]}
                />

                <Input
                  label="Language"
                  name="language"
                  value={form.language}
                  onChange={onChange}
                  placeholder="English"
                />

                <Input
                  label="Pages"
                  type="number"
                  name="pages"
                  value={form.pages}
                  onChange={onChange}
                  min="0"
                />

                <Input
                  label="File Size"
                  type="number"
                  name="fileSize"
                  value={form.fileSize}
                  onChange={onChange}
                  min="0"
                  placeholder="Bytes"
                />
              </div>

              <Input
                label="Tags"
                name="tags"
                value={form.tags}
                onChange={onChange}
                placeholder="react, javascript, frontend"
              />
            </FormSection>

            {/* COMMERCE */}
            <FormSection title="Publishing & Pricing">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Price (₦)"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  min="0"
                />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Checkbox
                  label="Published"
                  name="published"
                  checked={form.published}
                  onChange={onChange}
                />

                <Checkbox
                  label="Premium"
                  name="premium"
                  checked={form.premium}
                  onChange={onChange}
                />

                <Checkbox
                  label="Featured"
                  name="featured"
                  checked={form.featured}
                  onChange={onChange}
                />
              </div>
            </FormSection>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingBook
                  ? "Update Book"
                  : "Create Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================
   FORM COMPONENTS
========================================== */

function FormSection({ title, children }) {
  return (
    <section>
      <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        {...props}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <textarea
        {...props}
        rows={5}
        className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <select
        {...props}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50">
      <input
        {...props}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />

      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
}
