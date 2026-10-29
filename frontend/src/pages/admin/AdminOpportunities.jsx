import { useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createAdminOpportunity,
  deleteAdminOpportunity,
  getAdminOpportunities,
  updateAdminOpportunity,
} from "../../api/opportunityApi";

const initialForm = {
  title: "",
  organization: "",
  type: "job",
  category: "Technology",
  location: "Remote",
  workMode: "remote",
  description: "",
  requirements: "",
  benefits: "",
  applicationUrl: "",
  applicationEmail: "",
  deadline: "",
  tags: "",
  sourceUrl: "",
  featured: false,
  published: false,
  status: "open",
};

const opportunityTypes = [
  ["job", "Job"],
  ["internship", "Internship"],
  ["scholarship", "Scholarship"],
  ["grant", "Grant"],
  ["fellowship", "Fellowship"],
  ["event", "Event"],
  ["volunteer", "Volunteer"],
  ["competition", "Competition"],
  ["other", "Other"],
];

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

const normalizeList = (value) =>
  String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const unwrap = (response) => response?.data ?? response;

const formatDate = (value) => {
  if (!value) return "No deadline";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No deadline";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAdminOpportunities({
        page,
        limit: 12,
        search,
        type: typeFilter,
        status: statusFilter,
        published: publishedFilter,
      });

      const result = unwrap(response);
      const items = Array.isArray(result?.items) ? result.items : [];

      setOpportunities(items);
      setPagination(
        result?.pagination || {
          page,
          limit: 12,
          total: items.length,
          pages: items.length ? 1 : 0,
        },
      );
    } catch (error) {
      console.error("Failed to load opportunities:", error);
      toast.error(getErrorMessage(error, "Unable to load opportunities."));
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, statusFilter, publishedFilter]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const openCreateForm = () => {
    setEditingOpportunity(null);
    setForm({ ...initialForm });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingOpportunity(item);

    setForm({
      title: item.title || "",
      organization: item.organization || "",
      type: item.type || "other",
      category: item.category || "",
      location: item.location || "",
      workMode: item.workMode || "not-applicable",
      description: item.description || "",
      requirements: (item.requirements || []).join("\n"),
      benefits: (item.benefits || []).join("\n"),
      applicationUrl: item.applicationUrl || "",
      applicationEmail: item.applicationEmail || "",
      deadline: toDateInput(item.deadline),
      tags: (item.tags || []).join(", "),
      sourceUrl: item.sourceUrl || "",
      featured: Boolean(item.featured),
      published: Boolean(item.published),
      status: item.status || "open",
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingOpportunity(null);
    setForm({ ...initialForm });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.organization.trim()) {
      toast.error("Title and organization are required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please enter an opportunity description.");
      return;
    }

    if (
      form.applicationUrl.trim() &&
      !/^https?:\/\//i.test(form.applicationUrl.trim())
    ) {
      toast.error("The application URL must start with http:// or https://.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      type: form.type,
      category: form.category.trim() || "General",
      location: form.location.trim() || "Not specified",
      workMode: form.workMode,
      description: form.description.trim(),
      requirements: normalizeList(form.requirements),
      benefits: normalizeList(form.benefits),
      applicationUrl: form.applicationUrl.trim(),
      applicationEmail: form.applicationEmail.trim(),
      deadline: form.deadline || null,
      tags: normalizeList(form.tags),
      sourceUrl: form.sourceUrl.trim(),
      featured: Boolean(form.featured),
      published: Boolean(form.published),
      status: form.status,
    };

    try {
      setSaving(true);

      if (editingOpportunity) {
        const id = editingOpportunity._id || editingOpportunity.id;

        await updateAdminOpportunity(id, payload);
        toast.success("Opportunity updated successfully.");
      } else {
        await createAdminOpportunity(payload);
        toast.success("Opportunity created successfully.");
      }

      setShowForm(false);
      setEditingOpportunity(null);
      setForm({ ...initialForm });
      setPage(1);

      // Refresh the currently selected filters.
      await loadOpportunities();
    } catch (error) {
      console.error("Failed to save opportunity:", error);
      toast.error(getErrorMessage(error, "Unable to save opportunity."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const id = item._id || item.id;

    if (!id) {
      toast.error("Unable to identify this opportunity.");
      return;
    }

    if (
      !window.confirm(
        `Delete "${item.title}"?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAdminOpportunity(id);

      toast.success("Opportunity deleted successfully.");

      if (opportunities.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadOpportunities();
      }
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      toast.error(getErrorMessage(error, "Unable to delete opportunity."));
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setPublishedFilter("");
    setPage(1);
  };

  const hasFilters =
    Boolean(searchInput) ||
    Boolean(typeFilter) ||
    Boolean(statusFilter) ||
    publishedFilter !== "";

  return (
    <section className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <BriefcaseBusiness size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Opportunities
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create, publish, and manage opportunities independently of
              Careers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          New Opportunity
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_190px_160px_170px_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search opportunities..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">All types</option>
            {opportunityTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={publishedFilter}
            onChange={(event) => {
              setPublishedFilter(event.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="">All publication states</option>
            <option value="true">Published</option>
            <option value="false">Drafts</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            >
              <X size={16} className="mr-2" />
              Clear
            </button>
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:text-slate-400">
          Showing {opportunities.length} of {pagination.total} opportunities
          {loading && (
            <span className="ml-3 inline-flex items-center gap-1 text-blue-600">
              <RefreshCw size={12} className="animate-spin" />
              Updating...
            </span>
          )}
        </div>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingOpportunity ? "Edit Opportunity" : "Create Opportunity"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Provide accurate details so visitors know how to apply.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close form"
              className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Frontend Developer Internship"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Organization *</label>
                <input
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Company or institution"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Opportunity type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {opportunityTypes.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Technology, Education, Business..."
                />
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Remote, Lagos, Worldwide..."
                />
              </div>

              <div>
                <label className={labelClass}>Work arrangement</label>
                <select
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="not-applicable">Not applicable</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Application deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Application email</label>
                <input
                  type="email"
                  name="applicationEmail"
                  value={form.applicationEmail}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="applications@example.com"
                />
              </div>

              <div>
                <label className={labelClass}>Application URL</label>
                <input
                  type="url"
                  name="applicationUrl"
                  value={form.applicationUrl}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://example.com/apply"
                />
              </div>

              <div>
                <label className={labelClass}>Source URL (optional)</label>
                <input
                  type="url"
                  name="sourceUrl"
                  value={form.sourceUrl}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Original announcement link"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={7}
                className={inputClass}
                placeholder="Describe the opportunity, eligibility, and application process..."
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Requirements</label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={5}
                  className={inputClass}
                  placeholder={"Enter one requirement per line"}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Separate items with new lines or commas.
                </p>
              </div>

              <div>
                <label className={labelClass}>Benefits</label>
                <textarea
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  rows={5}
                  className={inputClass}
                  placeholder={"Enter one benefit per line"}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Separate items with new lines or commas.
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className={inputClass}
                placeholder="react, remote, entry-level"
              />
              <p className="mt-1 text-xs text-slate-400">
                Separate tags with commas.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <input
                  type="checkbox"
                  name="published"
                  checked={form.published}
                  onChange={handleChange}
                  className="h-4 w-4 rounded"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Published
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Visible on the public listings.
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Featured
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    Prioritize this listing.
                  </span>
                </span>
              </label>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <label className={labelClass}>Listing status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving && (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                )}
                {editingOpportunity ? "Save Changes" : "Create Opportunity"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Opportunity list */}
      {loading && opportunities.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center">
          <RefreshCw size={28} className="animate-spin text-blue-600" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white dark:bg-slate-900 px-6 py-14 text-center">
          <BriefcaseBusiness size={42} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {hasFilters ? "No matching opportunities" : "No opportunities yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {hasFilters
              ? "Try changing the filters or search terms."
              : "Create your first listing to start building your opportunities library."}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold"
            >
              Clear filters
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus size={16} className="mr-1 inline" />
              Create Opportunity
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((item) => {
            const id = item._id || item.id;

            return (
              <article
                key={id}
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {(item.type || "other").replace("-", " ")}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.published
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.published ? (
                      <Eye size={12} className="mr-1 inline" />
                    ) : (
                      <EyeOff size={12} className="mr-1 inline" />
                    )}
                    {item.published ? "Published" : "Draft"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "closed"
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.status === "closed" ? "Closed" : "Open"}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold leading-6 text-slate-900 dark:text-slate-100">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {item.organization}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {item.location || "Not specified"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    {formatDate(item.deadline)}
                  </span>
                </div>

                <p className="mt-4 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description || "No description provided."}
                </p>

                {item.featured && (
                  <span className="mt-4 w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Featured
                  </span>
                )}

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    <Edit3 size={15} className="mr-2" />
                    Edit
                  </button>

                  {item.applicationUrl && (
                    <a
                      href={item.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open application link"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === id}
                    aria-label={`Delete ${item.title}`}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination.page} of {pagination.pages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.pages || loading}
              onClick={() =>
                setPage((current) => Math.min(pagination.pages, current + 1))
              }
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
