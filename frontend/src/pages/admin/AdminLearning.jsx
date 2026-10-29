import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLearningForm } from "../../components/forms";
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
import defaultResources from "../../data/resources";

import {
  getAdminLearning,
  createAdminLearning,
  updateAdminLearning,
  deleteAdminLearning,
  getLearningCategories,
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

  if (Array.isArray(response?.data?.learningResources)) {
    return response.data.learningResources;
  }

  if (Array.isArray(response?.learningResources)) {
    return response.learningResources;
  }

  return [];
}

function extractMeta(response) {
  return (
    response?.meta || response?.data?.meta || response?.data?.data?.meta || {}
  );
}

function normalizeBundledResource(resource, index) {
  return {
    ...resource,
    _id: `bundled-${resource.id || index}`,
    title: resource.title || resource.name || "Untitled Resource",
    description: resource.description || resource.desc || "",
    author: resource.author || "KanuorieTech",
    category: resource.category || "General",
    image: resource.image || resource.img || "",
    link: resource.link || "",
    difficulty: resource.difficulty || "",
    published: resource.published !== false,
    premium: Boolean(resource.premium),
    featured: Boolean(resource.featured),
    price: Number(resource.price) || 0,
    views: Number(resource.views) || 0,
    downloads: Number(resource.downloads) || 0,
    isBundledResource: true,
  };
}

export default function AdminLearning() {
  const [learningResources, setlearningResources] = useState([]);
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLearningResource, setEditingLearningResource] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const loadLearning = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const firstResponse = await getAdminLearning({ page: 1, limit: 100 });
      const firstPage = extractData(firstResponse);
      const pageCount = Math.max(1, Number(extractMeta(firstResponse).pages) || 1);
      const remainingResponses = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
          getAdminLearning({ page: index + 2, limit: 100 }),
        ),
      );
      const databaseResources = [
        ...firstPage,
        ...remainingResponses.flatMap(extractData),
      ];
      const bundledResources = defaultResources.map(normalizeBundledResource);

      setlearningResources([...databaseResources, ...bundledResources]);
    } catch (err) {
      console.error("Failed to load learningResources:", err);

      setError(err?.response?.data?.message || "Unable to load learningResources.");

      setlearningResources(defaultResources.map(normalizeBundledResource));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getLearningCategories();

      const data = extractData(response);

      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  useEffect(() => {
    loadLearning();
  }, [loadLearning]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set([
          ...categories,
          ...defaultResources.map((resource) => resource.category).filter(Boolean),
        ]),
      ).sort((a, b) => String(a).localeCompare(String(b))),
    [categories],
  );

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = learningResources.filter((resource) => {
      const searchableText = [
        resource.title,
        resource.description,
        resource.desc,
        resource.author,
        resource.category,
        resource.link,
        ...(Array.isArray(resource.tags) ? resource.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !searchableText.includes(query)) return false;
      if (category && String(resource.category).toLowerCase() !== category.toLowerCase()) return false;
      if (difficulty && !resource.isBundledResource && resource.difficulty !== difficulty) return false;
      if (premium !== "" && Boolean(resource.premium) !== (premium === "true")) return false;
      if (featured !== "" && Boolean(resource.featured) !== (featured === "true")) return false;
      return true;
    });

    matches.sort((a, b) => {
      if (sort === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sort === "downloads") return Number(b.downloads || 0) - Number(a.downloads || 0);
      if (sort === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      if (sort === "views") return Number(b.views || 0) - Number(a.views || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return matches;
  }, [learningResources, search, category, difficulty, premium, featured, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / PAGE_SIZE));
  const visibleResources = filteredResources.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const stats = useMemo(() => {
    return {
      total: learningResources.length,
      published: learningResources.filter((learningResource) => learningResource.published).length,
      premium: learningResources.filter((learningResource) => learningResource.premium).length,
      featured: learningResources.filter((learningResource) => learningResource.featured).length,
    };
  }, [learningResources]);

  const openCreateModal = () => {
    setEditingLearningResource(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (learningResource) => {
    setEditingLearningResource(learningResource);

    setForm({
      title: learningResource.title || "",
      description: learningResource.description || "",
      author: learningResource.author || "",
      category: learningResource.category || "",
      image: learningResource.image || "",
      pdf: learningResource.pdf || "",
      link: learningResource.link || "",
      preview: learningResource.preview || "",
      tags: Array.isArray(learningResource.tags) ? learningResource.tags.join(", ") : "",
      difficulty: learningResource.difficulty || "Beginner",
      language: learningResource.language || "English",
      pages: learningResource.pages || 0,
      featured: Boolean(learningResource.featured),
      premium: Boolean(learningResource.premium),
      price: learningResource.price || 0,
      published: learningResource.published !== undefined ? Boolean(learningResource.published) : true,
      fileSize: learningResource.fileSize || 0,
      isbn: learningResource.isbn || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingLearningResource(null);
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
      toast.error("learningResource title is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("learningResource description is required.");
      return;
    }

    if (!form.category.trim()) {
      toast.error("learningResource category is required.");
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

      if (editingLearningResource) {
        await updateAdminLearning(editingLearningResource._id, payload);

        toast.success("learningResource updated successfully.");
      } else {
        await createAdminLearning(payload);

        toast.success("learningResource created successfully.");
      }

      closeModal();
      await loadLearning();
      await loadCategories();
    } catch (err) {
      console.error("learningResource save error:", err);

      toast.error(err?.response?.data?.message || "Failed to save learningResource.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (learningResource) => {
    const confirmed = window.confirm(
      `Delete "${learningResource.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(learningResource._id);

      await deleteAdminLearning(learningResource._id);

      toast.success("learningResource deleted successfully.");

      await loadLearning();
    } catch (err) {
      console.error("learningResource deletion error:", err);

      toast.error(err?.response?.data?.message || "Failed to delete learningResource.");
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

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">learningResources</h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your digital library, publications and downloadable
            resources.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add learningResource
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Learning Resources" value={stats.total} icon={BookOpen} />

        <Stat label="Published" value={stats.published} icon={Eye} />

        <Stat label="Premium" value={stats.premium} icon={Star} />

        <Stat label="Featured" value={stats.featured} icon={BookOpen} />
      </div>

      {/* FILTERS */}
      <Card className="p-5">
        <div className="mb-5 flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-500 dark:text-slate-400" />

          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Filters</h2>
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
              placeholder="Search learningResources..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          >
            <option value="">All Categories</option>

            {availableCategories.map((item) => (
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
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
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
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          >
            <option value="">All learningResources</option>
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
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
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
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">Featured: All</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50"
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
            onClick={loadLearning}
            className="mt-3 text-sm font-semibold text-red-600 underline"
          >
            Try again
          </button>
        </Card>
      )}

      {/* learningResources */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader />
          </div>
        ) : filteredResources.length === 0 ? (
          <EmptyState onAdd={openCreateModal} />
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      learningResource
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Stats
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleResources.map((learningResource) => (
                    <LearningRow
                      key={learningResource._id}
                      learningResource={learningResource}
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
              {visibleResources.map((learningResource) => (
                <LearningMobileCard
                  key={learningResource._id}
                  learningResource={learningResource}
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
      {!loading && filteredResources.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 disabled:cursor-not-allowed disabled:opacity-40"
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
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <LearningModal
          form={form}
          editingLearningResource={editingLearningResource}
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
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>

        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value.toLocaleString()}
        </p>
      </div>
    </Card>
  );
}

/* ==========================================
   learningResource ROW
========================================== */

function LearningRow({ learningResource, onEdit, onDelete, deletingId }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex min-w-[280px] items-center gap-4">
          <img
            src={learningResource.image || "/images/learningResource-placeholder.png"}
            alt={learningResource.title}
            className="h-16 w-12 rounded-lg object-cover"
          />

          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{learningResource.title}</p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {learningResource.author || "Unknown"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          {learningResource.category}
        </span>
      </td>

      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
        {Number(learningResource.price) > 0
          ? `₦${Number(learningResource.price).toLocaleString()}`
          : "Free"}
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <Status
            active={learningResource.published}
            label={learningResource.published ? "Published" : "Draft"}
          />

          {learningResource.premium && <Status active label="Premium" />}

          {learningResource.featured && <Status active label="Featured" />}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
        <div>{Number(learningResource.views || 0).toLocaleString()} views</div>

        <div>{Number(learningResource.downloads || 0).toLocaleString()} downloads</div>
      </td>

      <td className="px-6 py-4">
        {learningResource.isBundledResource ? (
          <span className="block text-right text-xs font-medium text-slate-500 dark:text-slate-400">
            Bundled resource
          </span>
        ) : (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onEdit(learningResource)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100"
              title="Edit learningResource"
            >
              <Edit3 className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={deletingId === learningResource._id}
              onClick={() => onDelete(learningResource)}
              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              title="Delete learningResource"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

/* ==========================================
   MOBILE learningResource CARD
========================================== */

function LearningMobileCard({ learningResource, onEdit, onDelete, deletingId }) {
  return (
    <div className="p-5">
      <div className="flex gap-4">
        <img
          src={learningResource.image || "/images/learningResource-placeholder.png"}
          alt={learningResource.title}
          className="h-24 w-16 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">{learningResource.title}</h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {learningResource.author || "Unknown"}
          </p>

          <p className="mt-3 font-semibold text-blue-600">
            {Number(learningResource.price) > 0
              ? `₦${Number(learningResource.price).toLocaleString()}`
              : "Free"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Status
          active={learningResource.published}
          label={learningResource.published ? "Published" : "Draft"}
        />

        {learningResource.premium && <Status active label="Premium" />}

        {learningResource.featured && <Status active label="Featured" />}
      </div>

      {learningResource.isBundledResource ? (
        <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Bundled site resource
        </p>
      ) : (
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" onClick={() => onEdit(learningResource)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <button
            type="button"
            disabled={deletingId === learningResource._id}
            onClick={() => onDelete(learningResource)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="mr-2 inline h-4 w-4" />
            Delete
          </button>
        </div>
      )}
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
      <div className="rounded-full bg-slate-100 dark:bg-slate-900 p-5">
        <BookOpen className="h-10 w-10 text-slate-400" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">No learningResources found</h3>

      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        There are no learningResources matching your current filters.
      </p>

      <Button className="mt-6" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add First learningResource
      </Button>
    </div>
  );
}

/* ==========================================
   learningResource MODAL
========================================== */

function LearningModal({ form, editingLearningResource, saving, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {editingLearningResource ? "Edit learningResource" : "Add New learningResource"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {editingLearningResource
                ? "Update the learningResource information."
                : "Add a new resource to your digital library."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <AdminLearningForm {...{ Button, Checkbox, FormSection, Input, Select, TextArea, editingLearningResource, form, onChange, onClose, onSubmit, saving }} onSubmit={onSubmit} className="overflow-y-auto p-6" />
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
      <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        {...props}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm outline-none transition text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <textarea
        {...props}
        rows={5}
        className="w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm outline-none transition text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <select
        {...props}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100"
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
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4 transition hover:bg-slate-50">
      <input
        {...props}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />

      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    </label>
  );
}






