import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from "../../services";

const initialForm = {
  title: "",
  shortDescription: "",
  description: "",
  icon: "",
  image: "",
  featured: false,
  active: true,
  order: 0,
  technologies: [],
  benefits: [],
  price: "",
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [technologyInput, setTechnologyInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await getAdminServices();

      const data =
        response?.data?.services ??
        response?.data ??
        response?.services ??
        [];

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load services:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateForm = () => {
    setEditingService(null);
    setForm(initialForm);
    setTechnologyInput("");
    setBenefitInput("");
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);

    setForm({
      title: service.title || "",
      shortDescription:
        service.shortDescription || "",
      description: service.description || "",
      icon: service.icon || "",
      image: service.image || "",
      featured: Boolean(service.featured),
      active: service.active !== false,
      order: service.order || 0,
      technologies:
        Array.isArray(service.technologies)
          ? service.technologies
          : [],
      benefits:
        Array.isArray(service.benefits)
          ? service.benefits
          : [],
      price: service.price || "",
    });

    setTechnologyInput("");
    setBenefitInput("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingService(null);
    setForm(initialForm);
    setTechnologyInput("");
    setBenefitInput("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const addTechnology = () => {
    const value = technologyInput.trim();

    if (!value) return;

    if (form.technologies.includes(value)) {
      setTechnologyInput("");
      return;
    }

    setForm((previous) => ({
      ...previous,
      technologies: [
        ...previous.technologies,
        value,
      ],
    }));

    setTechnologyInput("");
  };

  const removeTechnology = (technology) => {
    setForm((previous) => ({
      ...previous,
      technologies:
        previous.technologies.filter(
          (item) => item !== technology
        ),
    }));
  };

  const addBenefit = () => {
    const value = benefitInput.trim();

    if (!value) return;

    setForm((previous) => ({
      ...previous,
      benefits: [
        ...previous.benefits,
        value,
      ],
    }));

    setBenefitInput("");
  };

  const removeBenefit = (benefit) => {
    setForm((previous) => ({
      ...previous,
      benefits:
        previous.benefits.filter(
          (item) => item !== benefit
        ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    if (!form.shortDescription.trim()) {
      toast.error(
        "Short description is required."
      );
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Service description is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        title: form.title.trim(),
        shortDescription:
          form.shortDescription.trim(),
        description: form.description.trim(),
        order: Number(form.order) || 0,
      };

      if (editingService) {
        await updateAdminService(
          editingService._id,
          payload
        );

        toast.success(
          "Service updated successfully."
        );
      } else {
        await createAdminService(payload);

        toast.success(
          "Service created successfully."
        );
      }

      closeForm();
      await loadServices();
    } catch (error) {
      console.error(
        "Failed to save service:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteAdminService(service._id);

      toast.success(
        "Service deleted successfully."
      );

      setServices((previous) =>
        previous.filter(
          (item) =>
            item._id !== service._id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete service:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete service."
      );
    }
  };

  const filteredServices = services.filter(
    (service) => {
      const query =
        search.trim().toLowerCase();

      if (!query) return true;

      return (
        service.title
          ?.toLowerCase()
          .includes(query) ||
        service.shortDescription
          ?.toLowerCase()
          .includes(query) ||
        service.description
          ?.toLowerCase()
          .includes(query) ||
        service.technologies?.some(
          (technology) =>
            technology
              .toLowerCase()
              .includes(query)
        )
      );
    }
  );

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            className="animate-spin"
            size={22}
          />
          Loading services...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Services
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage the services displayed across
            the KanuorieTech website.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Plus size={19} />
          Add Service
        </button>
      </div>

      {/* SEARCH */}

      <div className="relative max-w-xl">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search services..."
          className="w-full rounded-xl border border-white/10 bg-white py-3 pl-11 pr-4 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
        />
      </div>

      {/* SERVICES */}

      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">
            No services found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search."
              : "Create your first service to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Service
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Featured
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredServices.map(
                  (service) => (
                    <tr
                      key={service._id}
                      className="transition hover:bg-white/[0.03]"
                    >
                      {/* SERVICE */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                            {service.image ? (
                              <img
                                src={
                                  service.image
                                }
                                alt={
                                  service.title
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xl text-cyan-400">
                                {service.icon ||
                                  "⚙"}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-white">
                              {service.title}
                            </p>

                            <p className="mt-1 max-w-md truncate text-sm text-slate-500">
                              {
                                service.shortDescription
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        {service.active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                            <Eye size={13} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-400/10 px-3 py-1 text-xs font-semibold text-slate-400">
                            <EyeOff size={13} />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* FEATURED */}

                      <td className="px-6 py-5">
                        {service.featured ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-400">
                            <Star
                              size={17}
                              fill="currentColor"
                            />
                            <span className="text-xs font-semibold">
                              Featured
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">
                            No
                          </span>
                        )}
                      </td>

                      {/* ORDER */}

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {service.order ?? 0}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                service
                              )
                            }
                            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
                            title="Edit service"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                service
                              )
                            }
                            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-red-400/30 hover:text-red-400"
                            title="Delete service"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORM MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingService
                    ? "Edit Service"
                    : "Create Service"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add the information for this
                  service.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* TITLE */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Service Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Web Development"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* SHORT DESCRIPTION */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Short Description
                  </label>

                  <input
                    name="shortDescription"
                    value={
                      form.shortDescription
                    }
                    onChange={handleChange}
                    maxLength={200}
                    placeholder="A short description of the service..."
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe the service in detail..."
                    required
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* ICON */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Icon
                  </label>

                  <input
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="Code2"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />

                  <p className="mt-1 text-xs text-slate-600">
                    Use an icon name or emoji.
                  </p>
                </div>

                {/* IMAGE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Image URL
                  </label>

                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Price
                  </label>

                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Starting from $500"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* ORDER */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  />
                </div>

                {/* TECHNOLOGIES */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Technologies
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={
                        technologyInput
                      }
                      onChange={(event) =>
                        setTechnologyInput(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          event.preventDefault();
                          addTechnology();
                        }
                      }}
                      placeholder="React, Node.js..."
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                    />

                    <button
                      type="button"
                      onClick={
                        addTechnology
                      }
                      className="rounded-xl bg-white/10 px-4 font-semibold text-white transition hover:bg-white/15"
                    >
                      Add
                    </button>
                  </div>

                  {form.technologies
                    .length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.technologies.map(
                        (technology) => (
                          <span
                            key={technology}
                            className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300"
                          >
                            {technology}

                            <button
                              type="button"
                              onClick={() =>
                                removeTechnology(
                                  technology
                                )
                              }
                              className="hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* BENEFITS */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Benefits
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={benefitInput}
                      onChange={(event) =>
                        setBenefitInput(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          event.preventDefault();
                          addBenefit();
                        }
                      }}
                      placeholder="Mobile responsive..."
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                    />

                    <button
                      type="button"
                      onClick={addBenefit}
                      className="rounded-xl bg-white/10 px-4 font-semibold text-white transition hover:bg-white/15"
                    >
                      Add
                    </button>
                  </div>

                  {form.benefits.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {form.benefits.map(
                        (benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300"
                          >
                            <span>
                              {benefit}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeBenefit(
                                  benefit
                                )
                              }
                              className="text-slate-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* STATUS */}

                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                        className="h-4 w-4 accent-cyan-500"
                      />

                      <span className="text-sm text-slate-300">
                        Active service
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                        className="h-4 w-4 accent-amber-400"
                      />

                      <span className="text-sm text-slate-300">
                        Featured service
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {editingService
                    ? "Update Service"
                    : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}