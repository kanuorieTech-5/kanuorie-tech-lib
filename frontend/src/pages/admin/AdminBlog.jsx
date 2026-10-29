import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminBlogForm } from "../../components/forms";
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
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import { Card, Button, Loader } from "../../components/common";

import {
  getAdminBlogs,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
} from "../../services";

import { uploadImage } from "../../api/uploadApi";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "General",
  tags: "",
  featured: false,
  published: true,
  readingTime: 5,
  seoTitle: "",
  seoDescription: "",
};

const PAGE_LIMIT = 9;

const BLOG_IMAGE_FOLDER = "kanuorietech/blog";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 1,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  /*
   * Local preview is kept separately from the saved
   * Cloudinary URL.
   */
  const [coverPreview, setCoverPreview] = useState("");

  /*
   * Selected file waiting to be uploaded.
   */
  const [coverImageFile, setCoverImageFile] = useState(null);

  /* ==========================================
     LOAD BLOGS
  ========================================== */

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: PAGE_LIMIT,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      if (featuredFilter !== "") {
        params.featured = featuredFilter;
      }

      const response = await getAdminBlogs(params);

      const result = response?.data?.data;

      const items = Array.isArray(result?.items)
        ? result.items
        : Array.isArray(response?.data?.items)
          ? response.data.items
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

      setBlogs(items);

      setPagination(
        result?.pagination || {
          page,
          limit: PAGE_LIMIT,
          total: items.length,
          pages: 1,
        },
      );
    } catch (err) {
      console.error("Failed to load admin blogs:", err);

      setError(err?.response?.data?.message || "Unable to load blog posts.");

      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, featuredFilter]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ==========================================
     RESET FORM
  ========================================== */

  const resetForm = () => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setForm({ ...EMPTY_FORM });
    setEditingBlog(null);
    setCoverPreview("");
    setCoverImageFile(null);
    setUploadingImage(false);
    setShowForm(false);
  };

  /* ==========================================
     CREATE FORM
  ========================================== */

  const openCreateForm = () => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setEditingBlog(null);

    setForm({
      ...EMPTY_FORM,
      published: true,
      featured: false,
    });

    setCoverPreview("");
    setCoverImageFile(null);

    setShowForm(true);
  };

  /* ==========================================
     EDIT FORM
  ========================================== */

  const openEditForm = (blog) => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setEditingBlog(blog);

    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      category: blog.category || "General",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      featured: Boolean(blog.featured),
      published: blog.published === undefined ? true : Boolean(blog.published),
      readingTime: blog.readingTime || 1,
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
    });

    setCoverPreview(blog.coverImage || "");
    setCoverImageFile(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================
     COVER IMAGE SELECT
  ========================================== */

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Validate file type.
     */

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    /*
     * Keep frontend validation aligned with
     * the backend Multer limit of 10 MB.
     */

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    /*
     * Revoke the previous local preview
     * if there was one.
     */

    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setCoverImageFile(file);
    setCoverPreview(previewUrl);

    /*
     * The old Cloudinary URL remains in form.coverImage
     * until the new image is successfully uploaded.
     */

    toast.success("Image selected. It will upload when you save the post.");
  };

  /* ==========================================
     REMOVE / CLEAR COVER IMAGE
  ========================================== */

  const handleRemoveCoverImage = () => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview("");
    setCoverImageFile(null);

    setForm((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  /* ==========================================
     UPLOAD COVER IMAGE
  ========================================== */

  const uploadCoverImage = async () => {
    if (!coverImageFile) {
      return form.coverImage.trim();
    }

    try {
      setUploadingImage(true);

      toast.loading("Uploading cover image...", {
        id: "blog-cover-upload",
      });

      const response = await uploadImage(coverImageFile, BLOG_IMAGE_FOLDER);

      const imageUrl = response?.data?.url || response?.url || "";

      if (!imageUrl) {
        throw new Error(
          "Image upload succeeded but no image URL was returned.",
        );
      }

      setForm((prev) => ({
        ...prev,
        coverImage: imageUrl,
      }));

      toast.success("Cover image uploaded successfully.", {
        id: "blog-cover-upload",
      });

      return imageUrl;
    } catch (err) {
      console.error("Failed to upload blog cover image:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to upload cover image.",
        {
          id: "blog-cover-upload",
        },
      );

      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  /* ==========================================
     CREATE / UPDATE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }

    if (!form.excerpt.trim()) {
      toast.error("Blog excerpt is required.");
      return;
    }

    if (form.excerpt.trim().length > 300) {
      toast.error("Excerpt cannot exceed 300 characters.");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Blog content is required.");
      return;
    }

    try {
      setSaving(true);

      /*
       * Upload a newly selected image before
       * creating/updating the Blog document.
       */

      let coverImage = form.coverImage.trim();

      if (coverImageFile) {
        coverImage = await uploadCoverImage();
      }

      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        coverImage,

        category: form.category.trim() || "General",

        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        featured: Boolean(form.featured),
        published: Boolean(form.published),

        readingTime: Math.max(1, Number(form.readingTime) || 1),

        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
      };

      if (editingBlog) {
        const id = editingBlog._id || editingBlog.id;

        if (!id) {
          toast.error("Unable to identify this blog post.");
          return;
        }

        await updateAdminBlog(id, payload);

        toast.success("Blog post updated successfully.");
      } else {
        await createAdminBlog(payload);

        toast.success("Blog post created successfully.");
      }

      resetForm();

      /*
       * Return to first page so newly created/updated
       * content is immediately visible.
       */

      setPage(1);

      /*
       * loadBlogs uses the current page from the closure.
       * When already on page 1, this refreshes immediately.
       * If another page was active, the page state change
       * will trigger the useEffect.
       */

      if (page === 1) {
        await loadBlogs();
      }
    } catch (err) {
      console.error("Failed to save blog:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save blog post.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (blog) => {
    const id = blog._id || blog.id;

    if (!id) {
      toast.error("Unable to identify this blog post.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${blog.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteAdminBlog(id);

      toast.success("Blog post deleted successfully.");

      if (blogs.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadBlogs();
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);

      toast.error(
        err?.response?.data?.message || "Unable to delete blog post.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================
     FILTERS
  ========================================== */

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleFeaturedChange = (event) => {
    setFeaturedFilter(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setFeaturedFilter("");
    setPage(1);
  };

  /* ==========================================
     CATEGORIES
  ========================================== */

  const categories = useMemo(() => {
    const values = blogs
      .map((blog) => blog.category)
      .filter(Boolean)
      .map((value) => String(value).trim())
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  /* ==========================================
     HELPERS
  ========================================== */

  const getAuthorName = (author) => {
    if (!author) return "Unknown author";

    if (typeof author === "string") {
      return author;
    }

    const fullName = `${author.firstName || ""} ${
      author.lastName || ""
    }`.trim();

    return fullName || author.email || "Unknown author";
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (loading && blogs.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  /* ==========================================
     ERROR STATE
  ========================================== */

  if (error && blogs.length === 0) {
    return (
      <section className="py-8">
        <Card className="border-red-200 bg-red-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-red-700">
                Blog unavailable
              </h2>

              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>

            <Button onClick={loadBlogs}>
              <RefreshCw size={17} className="mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <section className="space-y-6 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Blog Management
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Create, edit, publish, and manage your blog content.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={openCreateForm}>
          <Plus size={18} className="mr-2" />
          New Blog Post
        </Button>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_180px_auto]">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search title or excerpt..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          {/* CATEGORY */}

          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* FEATURED */}

          <select
            value={featuredFilter}
            onChange={handleFeaturedChange}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100"
          >
            <option value="">All posts</option>

            <option value="true">Featured only</option>

            <option value="false">Not featured</option>
          </select>

          {/* CLEAR */}

          {(search || category || featuredFilter !== "") && (
            <Button variant="outline" onClick={clearFilters}>
              <X size={17} className="mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* RESULTS INFO */}

        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {blogs.length} of {pagination.total} blog{" "}
            {pagination.total === 1 ? "post" : "posts"}
          </span>

          {loading && (
            <span className="flex items-center gap-2 text-blue-600">
              <RefreshCw size={13} className="animate-spin" />
              Updating...
            </span>
          )}
        </div>
      </Card>

      {/* =========================
          FORM
      ========================= */}

      {showForm && (
        <Card className="overflow-hidden">
          <div className="flex items-start justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingBlog ? "Edit Blog Post" : "Create Blog Post"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {editingBlog
                  ? "Update the content and publishing settings for this article."
                  : "Create a new article for the KanuorieTech blog."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={saving || uploadingImage}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <AdminBlogForm
            {...{
              Button,
              Clock,
              Eye,
              EyeOff,
              ImageIcon,
              RefreshCw,
              Star,
              Upload,
              X,
              coverImageFile,
              coverPreview,
              editingBlog,
              form,
              handleChange,
              handleCoverImageChange,
              handleRemoveCoverImage,
              handleSubmit,
              resetForm,
              saving,
              uploadingImage,
            }}
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          />
        </Card>
      )}

      {/* =========================
          BLOG LIST
      ========================= */}

      {blogs.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={46} className="mx-auto text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {search || category || featuredFilter !== ""
              ? "No blog posts found"
              : "No blog posts yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {search || category || featuredFilter !== ""
              ? "Try changing your search or filters."
              : "Create your first blog post to start publishing content."}
          </p>

          {search || category || featuredFilter !== "" ? (
            <Button className="mt-5" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : (
            <Button className="mt-5" onClick={openCreateForm}>
              <Plus size={18} className="mr-2" />
              Create Blog Post
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => {
              const id = blog._id || blog.id;

              const isPublished = Boolean(blog.published);

              const isFeatured = Boolean(blog.featured);

              return (
                <Card
                  key={id}
                  className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* COVER IMAGE */}

                  <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title || "Blog cover"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <FileText size={52} />
                      </div>
                    )}

                    {/* STATUS */}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                          isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isPublished ? <Eye size={13} /> : <EyeOff size={13} />}

                        {isPublished ? "Published" : "Draft"}
                      </span>

                      {isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 shadow-sm">
                          <Star size={13} className="fill-yellow-500" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-5">
                    {/* CATEGORY + DATE */}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {blog.category && (
                        <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-2.5 py-1 font-medium text-slate-600 dark:text-slate-400">
                          {blog.category}
                        </span>
                      )}

                      {blog.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {formatDate(blog.createdAt)}
                        </span>
                      )}
                    </div>

                    {/* TITLE */}

                    <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-7 text-slate-900 dark:text-slate-100">
                      {blog.title}
                    </h3>

                    {/* EXCERPT */}

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {blog.excerpt || "No description available."}
                    </p>

                    {/* META */}

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <User size={14} />
                        {getAuthorName(blog.author)}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {blog.readingTime || 1} min
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Eye size={14} />
                        {blog.views || 0} views
                      </span>
                    </div>

                    {/* TAGS */}

                    {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {blog.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600"
                          >
                            #{tag}
                          </span>
                        ))}

                        {blog.tags.length > 4 && (
                          <span className="rounded-md bg-slate-100 dark:bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            +{blog.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1 text-blue-600 bg-blue-50"
                        onClick={() => openEditForm(blog)}
                      >
                        <Edit3 size={16} className="mr-2 " />
                        Edit
                      </Button>

                      <button
                        type="button"
                        onClick={() => handleDelete(blog)}
                        disabled={deletingId === id}
                        className="flex h-10 w-11 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Delete ${blog.title}`}
                      >
                        {deletingId === id ? (
                          <RefreshCw size={17} className="animate-spin" />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* =========================
              PAGINATION
          ========================= */}

          {pagination.pages > 1 && (
            <Card className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page {pagination.page} of {pagination.pages}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1 || loading}
                    onClick={() =>
                      setPage((currentPage) => Math.max(1, currentPage - 1))
                    }
                  >
                    <ChevronLeft size={17} className="mr-1" />
                    Previous
                  </Button>

                  <div className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white">
                    {pagination.page}
                  </div>

                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.pages || loading}
                    onClick={() =>
                      setPage((currentPage) =>
                        Math.min(pagination.pages, currentPage + 1),
                      )
                    }
                  >
                    Next
                    <ChevronRight size={17} className="ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </section>
  );
}
