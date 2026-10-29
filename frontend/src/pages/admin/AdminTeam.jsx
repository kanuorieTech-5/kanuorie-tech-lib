import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminTeamForm } from "../../components/forms";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Users,
  UserCheck,
  UserX,
  X,
  Mail,
  Phone,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Twitter,
  RefreshCw,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import {
  getTeamMembers,
  getTeamStats,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../services/team.service";
import { uploadImage } from "../../api/uploadApi";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  position: "",
  bio: "",
  image: "",
  email: "",
  phone: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
  },
  featured: false,
  active: true,
  order: 0,
};

function normalizeResponse(response) {
  const data = response?.data?.data ?? response?.data ?? response ?? {};

  if (Array.isArray(data)) {
    return {
      items: data,
      pagination: {
        page: 1,
        pages: 1,
        total: data.length,
      },
    };
  }

  return {
    items: data?.items ?? [],
    pagination: data?.pagination ?? {
      page: 1,
      pages: 1,
      total: 0,
    },
  };
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-3">
          <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
      aria-label={label}
    >
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-cyan-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>

      <span className="text-sm text-slate-700 dark:text-slate-300">
        {checked ? "Yes" : "No"}
      </span>
    </button>
  );
}

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const clearImageSelection = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
  };

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter !== "all") {
        params.active = statusFilter === "active";
      }

      if (featuredFilter !== "all") {
        params.featured = featuredFilter === "featured";
      }

      const response = await getTeamMembers(params);
      const result = normalizeResponse(response);

      setMembers(result.items);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Failed to load team members:", err);

      setError(err?.response?.data?.message || "Unable to load team members.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, statusFilter, featuredFilter]);

  const loadStats = useCallback(async () => {
    try {
      const response = await getTeamStats();

      const payload = response?.data ?? response ?? {};

      const statsData = payload?.data ?? payload;

      setStats({
        total: Number(statsData?.total ?? 0),
        active: Number(statsData?.active ?? 0),
        inactive: Number(statsData?.inactive ?? 0),
        featured: Number(statsData?.featured ?? 0),
      });
    } catch (err) {
      console.warn("Unable to load team statistics:", err);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const openCreate = () => {
    clearImageSelection();
    setEditingMember(null);
    setForm({
      ...EMPTY_FORM,
      socialLinks: {
        ...EMPTY_FORM.socialLinks,
      },
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEdit = (member) => {
    clearImageSelection();
    setEditingMember(member);

    setForm({
      firstName: member.firstName ?? "",
      lastName: member.lastName ?? "",
      position: member.position ?? "",
      bio: member.bio ?? "",
      image: member.image ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
      socialLinks: {
        facebook: member.socialLinks?.facebook ?? "",
        twitter: member.socialLinks?.twitter ?? "",
        linkedin: member.socialLinks?.linkedin ?? "",
        github: member.socialLinks?.github ?? "",
        instagram: member.socialLinks?.instagram ?? "",
      },
      featured: Boolean(member.featured),
      active: member.active !== false,
      order: Number(member.order ?? 0),
    });
    setImagePreview(member.image ?? "");

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    clearImageSelection();
    setShowModal(false);
    setEditingMember(null);
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateSocial = (field, value) => {
    setForm((previous) => ({
      ...previous,
      socialLinks: {
        ...previous.socialLinks,
        [field]: value,
      },
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to upload.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setError("");
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let imageUrl = form.image.trim();
      if (imageFile) {
        setUploadingImage(true);
        const response = await uploadImage(imageFile, "kanuorietech/team");
        imageUrl = response?.data?.url || response?.url || "";
        if (!imageUrl) {
          throw new Error(
            "Image upload completed without returning an image URL.",
          );
        }
      }

      const payload = {
        ...form,
        image: imageUrl,
        order: Number(form.order) || 0,
      };

      if (editingMember?._id) {
        await updateTeamMember(editingMember._id, payload);
        setSuccess("Team member updated successfully.");
      } else {
        await createTeamMember(payload);
        setSuccess("Team member created successfully.");
      }

      setShowModal(false);
      setEditingMember(null);
      clearImageSelection();

      await loadMembers();
      await loadStats();
    } catch (err) {
      console.error("Failed to save team member:", err);

      setError(err?.response?.data?.message || "Unable to save team member.");
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    const name = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();

    const confirmed = window.confirm(
      `Delete ${name || "this team member"}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteTeamMember(member._id);

      setSuccess("Team member deleted successfully.");

      await loadMembers();
      await loadStats();
    } catch (err) {
      console.error("Failed to delete team member:", err);

      setError(err?.response?.data?.message || "Unable to delete team member.");
    }
  };

  const visibleMembers = useMemo(() => members, [members]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-600">ADMINISTRATION</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Team Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Manage KanuorieTech team members, profiles, visibility, featured
            members and display order.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              loadMembers();
              loadStats();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Members"
          value={stats.total}
          description="All team profiles"
        />

        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats.active}
          description="Visible team members"
        />

        <StatCard
          icon={UserX}
          label="Inactive"
          value={stats.inactive}
          description="Hidden team members"
        />

        <StatCard
          icon={Star}
          label="Featured"
          value={stats.featured}
          description="Featured profiles"
        />
      </div>

      {/* FILTERS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPagination((previous) => ({
                  ...previous,
                  page: 1,
                }));
              }}
              placeholder="Search name or position..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:bg-white text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPagination((previous) => ({
                ...previous,
                page: 1,
              }));
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(event) => {
              setFeaturedFilter(event.target.value);
              setPagination((previous) => ({
                ...previous,
                page: 1,
              }));
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">All Members</option>
            <option value="featured">Featured Only</option>
            <option value="regular">Regular Only</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Member
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Position
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Contact
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Featured
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Order
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Loading team members...
                  </td>
                </tr>
              ) : visibleMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-300" />

                    <p className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
                      No team members found
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Add your first team member to get started.
                    </p>

                    <button
                      type="button"
                      onClick={openCreate}
                      className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add Member
                    </button>
                  </td>
                </tr>
              ) : (
                visibleMembers.map((member) => {
                  const name =
                    `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();

                  return (
                    <tr
                      key={member._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={name}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 font-semibold text-slate-600 dark:text-slate-400">
                              {(member.firstName?.[0] ?? "") +
                                (member.lastName?.[0] ?? "")}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {name || "Unnamed member"}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Team ID: {member._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {member.position || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {member.email && (
                            <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <Mail className="h-3.5 w-3.5" />
                              {member.email}
                            </p>
                          )}

                          {member.phone && (
                            <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <Phone className="h-3.5 w-3.5" />
                              {member.phone}
                            </p>
                          )}

                          {!member.email && !member.phone && (
                            <span className="text-xs text-slate-400">
                              No contact details
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            member.active !== false
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {member.active !== false ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        {member.featured ? (
                          <Star className="mx-auto h-5 w-5 fill-current text-amber-500" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {member.order ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(member)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination.page} of {pagination.pages || 1}
            {" · "}
            {pagination.total ?? 0} members
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() =>
                setPagination((previous) => ({
                  ...previous,
                  page: previous.page - 1,
                }))
              }
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={pagination.page >= (pagination.pages || 1)}
              onClick={() =>
                setPagination((previous) => ({
                  ...previous,
                  page: previous.page + 1,
                }))
              }
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage the member's public team profile.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <AdminTeamForm
              {...{
                Facebook,
                Github,
                ImageIcon,
                Instagram,
                Linkedin,
                Toggle,
                Twitter,
                Upload,
                closeModal,
                editingMember,
                error,
                form,
                handleImageChange,
                handleSubmit,
                imageFile,
                imagePreview,
                saving,
                updateField,
                updateSocial,
                uploadingImage,
              }}
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            />
          </div>
        </div>
      )}
    </div>
  );
}
