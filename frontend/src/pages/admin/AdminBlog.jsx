import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Eye,
  EyeOff,
  Calendar,
  User,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
} from "../../components/common";

import {
  getAdminBlogs,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
} from "../../services";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  author: "",
  category: "",
  tags: "",
  status: "draft",
};

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingBlog, setEditingBlog] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminBlogs();

      const data =
        response?.data?.data ??
        response?.data ??
        response?.blogs ??
        response ??
        [];

      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load admin blogs:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load blog posts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingBlog(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingBlog(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    setEditingBlog(blog);

    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      image: blog.image || blog.featuredImage || "",
      author:
        typeof blog.author === "object"
          ? blog.author?.name || ""
          : blog.author || "",
      category: blog.category || "",
      tags: Array.isArray(blog.tags)
        ? blog.tags.join(", ")
        : blog.tags || "",
      status: blog.status || "draft",
    });

    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Blog content is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        image: form.image.trim(),
        author: form.author.trim(),
        category: form.category.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingBlog) {
        await updateAdminBlog(
          editingBlog._id || editingBlog.id,
          payload
        );

        toast.success("Blog post updated successfully.");
      } else {
        await createAdminBlog(payload);

        toast.success("Blog post created successfully.");
      }

      resetForm();
      await loadBlogs();
    } catch (err) {
      console.error("Failed to save blog:", err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to save blog post."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog) => {
    const id = blog._id || blog.id;

    if (!id) {
      toast.error("Unable to identify this blog post.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${blog.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteAdminBlog(id);

      toast.success("Blog post deleted successfully.");

      setBlogs((prev) =>
        prev.filter(
          (item) => (item._id || item.id) !== id
        )
      );
    } catch (err) {
      console.error("Failed to delete blog:", err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to delete blog post."
      );
    }
  };

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter((blog) => {
      const title = blog.title || "";
      const excerpt = blog.excerpt || "";
      const category = blog.category || "";

      return (
        title.toLowerCase().includes(query) ||
        excerpt.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );
    });
  }, [blogs, search]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <Card className="border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Blog unavailable
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Button
            className="mt-5"
            onClick={loadBlogs}
          >
            Try Again
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 py-2">

      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Blog
              </h1>

              <p className="text-sm text-slate-500">
                Manage your blog posts and articles.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={openCreateForm}>
          <Plus size={18} className="mr-2" />
          New Blog Post
        </Button>
      </div>

      {/* SEARCH */}

      <Card className="p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search blog posts..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </Card>

      {/* FORM */}

      {showForm && (
        <Card className="p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingBlog
                  ? "Edit Blog Post"
                  : "Create Blog Post"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingBlog
                  ? "Update this blog post."
                  : "Create a new article for your audience."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5"
          >

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Technology"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Author
                </label>

                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Featured Image URL
              </label>

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Excerpt
              </label>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="Short description of the article..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Content
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={10}
                placeholder="Write your article..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tags
              </label>

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, javascript, web development"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate tags with commas.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={saving}
                disabled={saving}
              >
                {editingBlog
                  ? "Update Post"
                  : "Create Post"}
              </Button>

            </div>

          </form>
        </Card>
      )}

      {/* BLOG LIST */}

      {filteredBlogs.length === 0 ? (
        <Card className="p-12 text-center">

          <FileText
            size={42}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {search
              ? "No blog posts found"
              : "No blog posts yet"}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Create your first blog post to get started."}
          </p>

          {!search && (
            <Button
              className="mt-5"
              onClick={openCreateForm}
            >
              <Plus
                size={18}
                className="mr-2"
              />
              Create Blog Post
            </Button>
          )}

        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredBlogs.map((blog) => {

            const id = blog._id || blog.id;

            const isPublished =
              String(blog.status || "").toLowerCase() ===
              "published";

            return (
              <Card
                key={id}
                className="overflow-hidden"
              >

                {/* IMAGE */}

                <div className="relative h-48 bg-slate-100">

                  {blog.image ||
                  blog.featuredImage ? (
                    <img
                      src={
                        blog.image ||
                        blog.featuredImage
                      }
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <FileText size={48} />
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isPublished ? (
                        <Eye size={13} />
                      ) : (
                        <EyeOff size={13} />
                      )}

                      {isPublished
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <div className="flex items-center gap-3 text-xs text-slate-400">

                    {blog.category && (
                      <span>
                        {blog.category}
                      </span>
                    )}

                    {blog.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />

                        {new Date(
                          blog.createdAt
                        ).toLocaleDateString()}
                      </span>
                    )}

                  </div>

                  <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                    {blog.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {blog.excerpt ||
                      blog.content ||
                      "No description available."}
                  </p>

                  {blog.author && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <User size={14} />
                      <span>
                        {typeof blog.author ===
                        "object"
                          ? blog.author?.name
                          : blog.author}
                      </span>
                    </div>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        openEditForm(blog)
                      }
                    >
                      <Edit3
                        size={16}
                        className="mr-2"
                      />
                      Edit
                    </Button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(blog)
                      }
                      className="rounded-lg border border-red-200 px-4 text-red-600 transition hover:bg-red-50"
                      aria-label="Delete blog post"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

              </Card>
            );
          })}

        </div>
      )}

    </section>
  );
}
