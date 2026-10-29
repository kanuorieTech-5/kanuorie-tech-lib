import { useEffect, useState } from "react";
import { AdminServiceForm } from "../../components/forms";
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
        response?.data?.services ?? response?.data ?? response?.services ?? [];

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load services:", error);

      toast.error(error?.response?.data?.message || "Failed to load services.");
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
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      icon: service.icon || "",
      image: service.image || "",
      featured: Boolean(service.featured),
      active: service.active !== false,
      order: service.order || 0,
      technologies: Array.isArray(service.technologies)
        ? service.technologies
        : [],
      benefits: Array.isArray(service.benefits) ? service.benefits : [],
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
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
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
      technologies: [...previous.technologies, value],
    }));

    setTechnologyInput("");
  };

  const removeTechnology = (technology) => {
    setForm((previous) => ({
      ...previous,
      technologies: previous.technologies.filter((item) => item !== technology),
    }));
  };

  const addBenefit = () => {
    const value = benefitInput.trim();

    if (!value) return;

    setForm((previous) => ({
      ...previous,
      benefits: [...previous.benefits, value],
    }));

    setBenefitInput("");
  };

  const removeBenefit = (benefit) => {
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits.filter((item) => item !== benefit),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    if (!form.shortDescription.trim()) {
      toast.error("Short description is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Service description is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        order: Number(form.order) || 0,
      };

      if (editingService) {
        await updateAdminService(editingService._id, payload);

        toast.success("Service updated successfully.");
      } else {
        await createAdminService(payload);

        toast.success("Service created successfully.");
      }

      closeForm();
      await loadServices();
    } catch (error) {
      console.error("Failed to save service:", error);

      toast.error(error?.response?.data?.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteAdminService(service._id);

      toast.success("Service deleted successfully.");

      setServices((previous) =>
        previous.filter((item) => item._id !== service._id),
      );
    } catch (error) {
      console.error("Failed to delete service:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete service.",
      );
    }
  };

  const filteredServices = services.filter((service) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      service.title?.toLowerCase().includes(query) ||
      service.shortDescription?.toLowerCase().includes(query) ||
      service.description?.toLowerCase().includes(query) ||
      service.technologies?.some((technology) =>
        technology.toLowerCase().includes(query),
      )
    );
  });

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={22} />
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
          <h1 className="text-3xl font-bold">Services</h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage the services displayed across the KanuorieTech website.
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services..."
          className="w-full rounded-xl border border-white/10 bg-white dark:bg-slate-900 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition focus:border-cyan-400/50"
        />
      </div>

      {/* SERVICES */}

      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">No services found</h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Service
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Featured
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Order
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredServices.map((service) => (
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
                              src={service.image}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl text-cyan-400">
                              {service.icon || "⚠"}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-cyan-500">
                            {service.title}
                          </p>

                          <p className="mt-1 max-w-md truncate text-sm text-slate-500 dark:text-slate-400">
                            {service.shortDescription}
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
                          <Star size={17} fill="currentColor" />
                          <span className="text-xs font-semibold">
                            Featured
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600 dark:text-slate-400">No</span>
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
                          onClick={() => openEditForm(service)}
                          className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
                          title="Edit service"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(service)}
                          className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-red-400/30 hover:text-red-400"
                          title="Delete service"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                  {editingService ? "Edit Service" : "Create Service"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add the information for this service.
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

            <AdminServiceForm {...{ Loader2, X, addBenefit, addTechnology, benefitInput, closeForm, editingService, form, handleChange, handleSubmit, removeBenefit, removeTechnology, saving, setBenefitInput, setTechnologyInput, technologyInput }} onSubmit={handleSubmit} className="space-y-6 p-6" />
          </div>
        </div>
      )}
    </section>
  );
}



