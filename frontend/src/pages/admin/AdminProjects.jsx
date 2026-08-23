import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  FolderKanban,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services";

const initialForm = {
  title: "",
  description: "",
  image: "",
  gallery: "",
  technologies: "",
  category: "Web Development",
  client: "",
  github: "",
  liveDemo: "",
  featured: false,
  published: true,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState(initialForm);

  /* ==========================================
     FETCH PROJECTS
  ========================================== */

  const loadProjects = async (
    page = pagination.page,
    searchValue = search
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjects({
        page,
        limit: pagination.limit,
        ...(searchValue.trim()
          ? { search: searchValue.trim() }
          : {}),
      });

      const data = response?.data ?? response ?? {};

      setProjects(data.projects ?? []);

      setPagination(
        data.pagination ?? {
          page,
          limit: pagination.limit,
          total: data.projects?.length ?? 0,
          pages: 1,
        }
      );
    } catch (err) {
      console.error(
        "Failed to load projects:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(1, "");
  }, []);

  /* ==========================================
     FORM HANDLING
  ========================================== */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      gallery:
        project.gallery?.join("\n") || "",
      technologies:
        project.technologies?.join(", ") || "",
      category:
        project.category || "Web Development",
      client: project.client || "",
      github: project.github || "",
      liveDemo: project.liveDemo || "",
      featured: Boolean(project.featured),
      published:
        project.published !== false,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProject(null);
    setForm(initialForm);
  };

  /* ==========================================
     CREATE / UPDATE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Project description is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),

        gallery: form.gallery
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        category: form.category.trim(),
        client: form.client.trim(),
        github: form.github.trim(),
        liveDemo: form.liveDemo.trim(),

        featured: form.featured,
        published: form.published,
      };

      if (editingProject) {
        await updateProject(
          editingProject._id,
          payload
        );

        toast.success(
          "Project updated successfully."
        );
      } else {
        await createProject(payload);

        toast.success(
          "Project created successfully."
        );
      }

      closeModal();

      await loadProjects(
        editingProject
          ? pagination.page
          : 1
      );
    } catch (err) {
      console.error(
        "Failed to save project:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(project._id);

      await deleteProject(project._id);

      toast.success(
        "Project deleted successfully."
      );

      const nextPage =
        projects.length === 1 &&
        pagination.page > 1
          ? pagination.page - 1
          : pagination.page;

      await loadProjects(nextPage);
    } catch (err) {
      console.error(
        "Failed to delete project:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to delete project."
      );
    } finally {
      setDeleting(null);
    }
  };

  /* ==========================================
     SEARCH
  ========================================== */

  const handleSearch = (event) => {
    event.preventDefault();

    loadProjects(1, search);
  };

  /* ==========================================
     PAGINATION
  ========================================== */

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > pagination.pages ||
      page === pagination.page
    ) {
      return;
    }

    loadProjects(page);
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <section className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <FolderKanban className="h-6 w-6 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Projects
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Manage your portfolio projects.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Plus className="h-5 w-5" />

          Add Project
        </button>
      </div>

      {/* Search */}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
          <p className="font-medium text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadProjects()}
            className="mt-3 text-sm font-semibold text-white underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        /* Empty */

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-slate-600" />

          <h2 className="mt-5 text-lg font-semibold">
            No projects found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create your first project to start building
            your portfolio.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            <Plus className="h-5 w-5" />

            Create Project
          </button>
        </div>
      ) : (
        <>
          {/* Project Cards */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Image */}

                <div className="relative h-52 bg-slate-900">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderKanban className="h-12 w-12 text-slate-700" />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex gap-2">
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-950">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        project.published
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {project.published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Content */}

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {project.category ||
                      "Web Development"}
                  </p>

                  <h2 className="mt-2 line-clamp-1 text-xl font-bold text-white">
                    {project.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>

                  {/* Technologies */}

                  {project.technologies?.length >
                    0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies
                        .slice(0, 4)
                        .map((technology) => (
                          <span
                            key={technology}
                            className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                          >
                            {technology}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Meta */}

                  <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-4 w-4" />

                      {project.views || 0} views
                    </span>

                    {project.client && (
                      <span className="truncate">
                        {project.client}
                      </span>
                    )}
                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(project)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-cyan-500/10 px-3 py-2.5 text-cyan-400 transition hover:bg-cyan-500/20"
                        title="Live demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-white/10 px-3 py-2.5 text-white transition hover:bg-white/15"
                        title="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={
                        deleting === project._id
                      }
                      onClick={() =>
                        handleDelete(project)
                      }
                      className="inline-flex items-center justify-center rounded-lg bg-red-500/10 px-3 py-2.5 text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-sm text-slate-400">
                Page{" "}
                <span className="font-semibold text-white">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {pagination.pages}
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    goToPage(
                      pagination.page - 1
                    )
                  }
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    pagination.page >=
                    pagination.pages
                  }
                  onClick={() =>
                    goToPage(
                      pagination.page + 1
                    )
                  }
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==========================================
          CREATE / EDIT MODAL
      ========================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingProject
                    ? "Edit Project"
                    : "Create Project"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingProject
                    ? "Update your project information."
                    : "Add a new project to your portfolio."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Title */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Project Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. KanuorieTech Website"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Web Development"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* Client */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Client
                  </label>

                  <input
                    name="client"
                    value={form.client}
                    onChange={handleChange}
                    placeholder="Client name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* Description */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the project..."
                    rows={6}
                    required
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* Image */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Main Image URL
                  </label>

                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* Technologies */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Technologies
                  </label>

                  <input
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB, Tailwind CSS"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Separate technologies with commas.
                  </p>
                </div>

                {/* Gallery */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Gallery URLs
                  </label>

                  <textarea
                    name="gallery"
                    value={form.gallery}
                    onChange={handleChange}
                    placeholder={`https://image-1.jpg\nhttps://image-2.jpg`}
                    rows={4}
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Add one image URL per line.
                  </p>
                </div>

                {/* GitHub */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    GitHub URL
                  </label>

                  <input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    type="url"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* Live Demo */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Live Demo URL
                  </label>

                  <input
                    name="liveDemo"
                    value={form.liveDemo}
                    onChange={handleChange}
                    placeholder="https://..."
                    type="url"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>
              </div>

              {/* Status */}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-5 w-5 accent-cyan-500"
                  />

                  <div>
                    <p className="font-medium text-white">
                      Featured Project
                    </p>

                    <p className="text-xs text-slate-500">
                      Show this project prominently.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleChange}
                    className="h-5 w-5 accent-cyan-500"
                  />

                  <div>
                    <p className="font-medium text-white">
                      Published
                    </p>

                    <p className="text-xs text-slate-500">
                      Make this project visible publicly.
                    </p>
                  </div>
                </label>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  )}

                  {editingProject
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}