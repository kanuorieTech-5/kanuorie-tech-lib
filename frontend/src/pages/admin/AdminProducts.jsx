import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  Globe,
  Github,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";

const CATEGORIES = [
  "Development",
  "AI",
  "Database",
  "Design",
  "DevOps",
  "Productivity",
  "Business",
  "Cloud",
  "Security",
  "API",
  "Other",
];

const PRICING_TYPES = [
  "Free",
  "Freemium",
  "Paid",
  "Open Source",
];

const EMPTY_FORM = {
  name: "",
  excerpt: "",
  description: "",
  image: "",
  category: "Development",

  websiteUrl: "",
  documentationUrl: "",
  githubUrl: "",

  pricingType: "Free",
  price: 0,
  currency: "USD",

  technologies: "",

  featured: false,
  published: true,
};

/* ==========================================
   FORM FIELD
========================================== */

function FormField({
  label,
  required = false,
  children,
  hint,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

/* ==========================================
   INPUT CLASS
========================================== */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

/* ==========================================
   ADMIN PRODUCTS
========================================== */

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  /* ==========================================
     LOAD PRODUCTS
  ========================================== */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        limit: 100,
      });

      const items =
        response?.data?.products ??
        response?.data ??
        response?.products ??
        [];

      setProducts(
        Array.isArray(items) ? items : []
      );
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      toast.error(
        "Failed to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name
          ?.toLowerCase()
          .includes(query) ||
        product.description
          ?.toLowerCase()
          .includes(query) ||
        product.excerpt
          ?.toLowerCase()
          .includes(query) ||
        product.category
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" &&
          product.published) ||
        (statusFilter === "Draft" &&
          !product.published) ||
        (statusFilter === "Featured" &&
          product.featured);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
  ]);

  /* ==========================================
     STATISTICS
  ========================================== */

  const stats = useMemo(() => {
    const total = products.length;

    const published = products.filter(
      (product) => product.published
    ).length;

    const featured = products.filter(
      (product) => product.featured
    ).length;

    const categories = new Set(
      products.map(
        (product) => product.category
      )
    ).size;

    return {
      total,
      published,
      featured,
      categories,
    };
  }, [products]);

  /* ==========================================
     OPEN CREATE MODAL
  ========================================== */

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  /* ==========================================
     OPEN EDIT MODAL
  ========================================== */

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      excerpt: product.excerpt || "",
      description: product.description || "",
      image: product.image || "",
      category:
        product.category || "Development",

      websiteUrl:
        product.websiteUrl || "",
      documentationUrl:
        product.documentationUrl || "",
      githubUrl:
        product.githubUrl || "",

      pricingType:
        product.pricingType || "Free",

      price:
        product.price ?? 0,

      currency:
        product.currency || "USD",

      technologies: Array.isArray(
        product.technologies
      )
        ? product.technologies.join(", ")
        : "",

      featured:
        Boolean(product.featured),

      published:
        product.published !== false,
    });

    setModalOpen(true);
  };

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ==========================================
     SUBMIT
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Product name is required."
      );
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Product description is required."
      );
      return;
    }

    if (!form.websiteUrl.trim()) {
      toast.error(
        "Official website URL is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),

        excerpt:
          form.excerpt.trim(),

        description:
          form.description.trim(),

        image:
          form.image.trim(),

        category:
          form.category,

        websiteUrl:
          form.websiteUrl.trim(),

        documentationUrl:
          form.documentationUrl.trim(),

        githubUrl:
          form.githubUrl.trim(),

        pricingType:
          form.pricingType,

        price:
          Number(form.price) || 0,

        currency:
          form.currency
            .trim()
            .toUpperCase() || "USD",

        technologies:
          form.technologies
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        featured:
          Boolean(form.featured),

        published:
          Boolean(form.published),
      };

      if (editingId) {
        await updateProduct(
          editingId,
          payload
        );

        toast.success(
          "Product updated successfully."
        );
      } else {
        await createProduct(
          payload
        );

        toast.success(
          "Product added successfully."
        );
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);

      await loadProducts();
    } catch (error) {
      console.error(
        "Failed to save product:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to save product.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (product) => {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) return;

    try {
      await deleteProduct(
        product._id
      );

      toast.success(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      toast.error(
        "Failed to delete product."
      );
    }
  };

  /* ==========================================
     FORMAT PRICE
  ========================================== */

  const formatPrice = (product) => {
    if (
      product.pricingType === "Free" ||
      product.pricingType ===
        "Open Source"
    ) {
      return product.pricingType;
    }

    const price = Number(
      product.price
    );

    if (!price) {
      return "Contact / See website";
    }

    return `${product.currency || "USD"} ${price.toLocaleString()}`;
  };

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <Sparkles size={16} />

            Developer & Business Products
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Products Hub
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Curate useful tools, platforms,
            software and services for
            developers and businesses.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus size={18} />

          Add Product
        </button>
      </div>

      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<BookOpen size={20} />}
          label="Total Products"
          value={stats.total}
        />

        <StatCard
          icon={<Eye size={20} />}
          label="Published"
          value={stats.published}
        />

        <StatCard
          icon={<Star size={20} />}
          label="Featured"
          value={stats.featured}
        />

        <StatCard
          icon={<Sparkles size={20} />}
          label="Categories"
          value={stats.categories}
        />
      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products..."
              className={`${inputClass} pl-11`}
            />
          </div>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="All">
              All Categories
            </option>

            {CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="All">
              All Status
            </option>

            <option value="Published">
              Published
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Featured">
              Featured
            </option>
          </select>
        </div>
      </div>

      {/* ======================================
          PRODUCTS TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
              <tr>
                <TableHead>
                  Product
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Pricing
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Views
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <BookOpen
                        size={40}
                        className="mb-4 text-slate-300"
                      />

                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Add your first
                        developer or
                        business product.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(
                  (product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                    >
                      {/* PRODUCT */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.image ||
                              "/images/product-placeholder.png"
                            }
                            alt={
                              product.name
                            }
                            className="h-12 w-12 rounded-xl border border-slate-200 object-cover dark:border-white/10"
                          />

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {
                                product.name
                              }
                            </p>

                            <p className="max-w-xs truncate text-xs text-slate-500">
                              {
                                product.excerpt ||
                                product.description
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          {
                            product.category
                          }
                        </span>
                      </td>

                      {/* PRICING */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {formatPrice(
                              product
                            )}
                          </p>

                          {product.pricingType && (
                            <p className="text-xs text-slate-500">
                              {
                                product.pricingType
                              }
                            </p>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                              product.published
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                            }`}
                          >
                            {product.published ? (
                              <>
                                <Eye
                                  size={12}
                                />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff
                                  size={12}
                                />
                                Draft
                              </>
                            )}
                          </span>

                          {product.featured && (
                            <span className="inline-flex w-fit items-center gap-1 text-xs font-medium text-amber-600">
                              <Star
                                size={12}
                                fill="currentColor"
                              />
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* VIEWS */}

                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {Number(
                          product.views || 0
                        ).toLocaleString()}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {product.websiteUrl && (
                            <a
                              href={
                                product.websiteUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Visit website"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/10"
                            >
                              <ExternalLink
                                size={16}
                              />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                            title="Edit"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/10"
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================
          MODAL
      ====================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-950">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add a useful developer or
                  business product to the
                  KanuorieTech hub.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-6"
            >
              <div className="space-y-8">
                {/* ==================================
                    BASIC INFORMATION
                ================================== */}

                <FormSection
                  icon={<BookOpen size={18} />}
                  title="Basic Information"
                  description="Describe the tool, platform or service."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FormField
                        label="Product Name"
                        required
                      >
                        <input
                          name="name"
                          value={
                            form.name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="e.g. Visual Studio Code"
                          className={
                            inputClass
                          }
                          required
                        />
                      </FormField>
                    </div>

                    <div className="md:col-span-2">
                      <FormField
                        label="Excerpt"
                        hint="Short summary used on product cards."
                      >
                        <input
                          name="excerpt"
                          value={
                            form.excerpt
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="A powerful code editor for modern development."
                          maxLength={250}
                          className={
                            inputClass
                          }
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Category"
                      required
                    >
                      <select
                        name="category"
                        value={
                          form.category
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                      >
                        {CATEGORIES.map(
                          (category) => (
                            <option
                              key={
                                category
                              }
                              value={
                                category
                              }
                            >
                              {category}
                            </option>
                          )
                        )}
                      </select>
                    </FormField>

                    <FormField
                      label="Logo / Image URL"
                      hint="Use a publicly accessible image URL."
                    >
                      <input
                        type="url"
                        name="image"
                        value={
                          form.image
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://..."
                        className={
                          inputClass
                        }
                      />
                    </FormField>

                    <div className="md:col-span-2">
                      <FormField
                        label="Description"
                        required
                        hint="Explain what the product does and who it is useful for."
                      >
                        <textarea
                          name="description"
                          value={
                            form.description
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Describe the product, its purpose and its main use cases..."
                          rows={5}
                          className={`${inputClass} resize-y`}
                          required
                        />
                      </FormField>
                    </div>
                  </div>
                </FormSection>

                {/* ==================================
                    LINKS
                ================================== */}

                <FormSection
                  icon={<Globe size={18} />}
                  title="Product Links"
                  description="Help visitors access the official product resources."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      label="Official Website"
                      required
                      hint="The main official product website."
                    >
                      <input
                        type="url"
                        name="websiteUrl"
                        value={
                          form.websiteUrl
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://example.com"
                        className={
                          inputClass
                        }
                        required
                      />
                    </FormField>

                    <FormField
                      label="Documentation URL"
                      hint="Official documentation, if available."
                    >
                      <input
                        type="url"
                        name="documentationUrl"
                        value={
                          form.documentationUrl
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://docs.example.com"
                        className={
                          inputClass
                        }
                      />
                    </FormField>

                    <FormField
                      label="GitHub URL"
                      hint="Useful for open-source projects."
                    >
                      <input
                        type="url"
                        name="githubUrl"
                        value={
                          form.githubUrl
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://github.com/..."
                        className={
                          inputClass
                        }
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* ==================================
                    PRICING
                ================================== */}

                <FormSection
                  icon={<Sparkles size={18} />}
                  title="Pricing"
                  description="Describe how the product is priced."
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <FormField
                      label="Pricing Type"
                      required
                    >
                      <select
                        name="pricingType"
                        value={
                          form.pricingType
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                      >
                        {PRICING_TYPES.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                            >
                              {type}
                            </option>
                          )
                        )}
                      </select>
                    </FormField>

                    <FormField
                      label="Starting Price"
                      hint="Use 0 when there is no applicable starting price."
                    >
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={
                          form.price
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                      />
                    </FormField>

                    <FormField label="Currency">
                      <input
                        name="currency"
                        value={
                          form.currency
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="USD"
                        maxLength={3}
                        className={
                          inputClass
                        }
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* ==================================
                    CLASSIFICATION
                ================================== */}

                <FormSection
                  icon={<FileText size={18} />}
                  title="Classification"
                  description="Add technologies, platforms or keywords."
                >
                  <FormField
                    label="Technologies / Tags"
                    hint="Separate each tag with a comma. Example: JavaScript, React, Git, Open Source"
                  >
                    <input
                      name="technologies"
                      value={
                        form.technologies
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="JavaScript, React, Git"
                      className={
                        inputClass
                      }
                    />
                  </FormField>
                </FormSection>

                {/* ==================================
                    PUBLISHING
                ================================== */}

                <FormSection
                  icon={<Star size={18} />}
                  title="Publishing"
                  description="Control how this product appears publicly."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={
                          form.featured
                        }
                        onChange={
                          handleChange
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Featured Product
                        </p>

                        <p className="text-xs text-slate-500">
                          Highlight this
                          product in
                          featured sections.
                        </p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                      <input
                        type="checkbox"
                        name="published"
                        checked={
                          form.published
                        }
                        onChange={
                          handleChange
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Published
                        </p>

                        <p className="text-xs text-slate-500">
                          Make this product
                          visible on the
                          public hub.
                        </p>
                      </div>
                    </label>
                  </div>
                </FormSection>
              </div>

              {/* ==================================
                  ACTIONS
              ================================== */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        {icon}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/* ==========================================
   TABLE HEAD
========================================== */

function TableHead({ children }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {children}
    </th>
  );
}

/* ==========================================
   FORM SECTION
========================================== */

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}