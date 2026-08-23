import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Package,
  RefreshCw,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
} from "../../components/common";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services";

const CATEGORIES = [
  "Template",
  "Software",
  "Course",
  "Ebook",
  "Service",
  "API",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  excerpt: "",
  description: "",
  image: "",
  category: "Other",
  price: 0,
  currency: "USD",
  featured: false,
  published: true,
  downloadUrl: "",
  demoUrl: "",
  githubUrl: "",
  technologies: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  /* ==========================================
     LOAD PRODUCTS
  ========================================== */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        limit: 100,
      });

      /*
       * Backend response:
       *
       * {
       *   data: {
       *     products: [],
       *     pagination: {}
       *   }
       * }
       */

      const data =
        response?.data?.products ??
        response?.products ??
        [];

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load products."
      );
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
    return products.filter((product) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.description
          ?.toLowerCase()
          .includes(searchValue) ||
        product.excerpt
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesStatus =
        status === "All" ||
        (status === "Published" &&
          product.published === true) ||
        (status === "Unpublished" &&
          product.published === false) ||
        (status === "Featured" &&
          product.featured === true);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    category,
    status,
  ]);

  /* ==========================================
     STATISTICS
  ========================================== */

  const stats = useMemo(() => {
    return {
      total: products.length,

      published: products.filter(
        (product) => product.published
      ).length,

      unpublished: products.filter(
        (product) => !product.published
      ).length,

      featured: products.filter(
        (product) => product.featured
      ).length,
    };
  }, [products]);

  /* ==========================================
     OPEN CREATE MODAL
  ========================================== */

  const handleCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  /* ==========================================
     OPEN EDIT MODAL
  ========================================== */

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      excerpt: product.excerpt || "",
      description: product.description || "",
      image: product.image || "",
      category:
        product.category || "Other",
      price: product.price ?? 0,
      currency:
        product.currency || "USD",
      featured:
        Boolean(product.featured),
      published:
        product.published !== false,
      downloadUrl:
        product.downloadUrl || "",
      demoUrl:
        product.demoUrl || "",
      githubUrl:
        product.githubUrl || "",
      technologies:
        Array.isArray(
          product.technologies
        )
          ? product.technologies.join(", ")
          : "",
    });

    setShowModal(true);
  };

  /* ==========================================
     CLOSE MODAL
  ========================================== */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
  };

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ==========================================
     SAVE PRODUCT
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

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        excerpt: form.excerpt.trim(),
        description:
          form.description.trim(),
        image: form.image.trim(),
        category: form.category,
        price: Number(form.price) || 0,
        currency:
          form.currency
            .trim()
            .toUpperCase() || "USD",
        featured: Boolean(form.featured),
        published: Boolean(form.published),
        downloadUrl:
          form.downloadUrl.trim(),
        demoUrl: form.demoUrl.trim(),
        githubUrl:
          form.githubUrl.trim(),

        technologies:
          form.technologies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      };

      if (editingProduct) {
        const response =
          await updateProduct(
            editingProduct._id,
            payload
          );

        const updated =
          response?.data ??
          response?.product ??
          response;

        setProducts((prev) =>
          prev.map((item) =>
            item._id ===
            editingProduct._id
              ? updated
              : item
          )
        );

        toast.success(
          "Product updated successfully."
        );
      } else {
        const response =
          await createProduct(payload);

        const created =
          response?.data ??
          response?.product ??
          response;

        setProducts((prev) => [
          created,
          ...prev,
        ]);

        toast.success(
          "Product created successfully."
        );
      }

      closeModal();
    } catch (err) {
      console.error(
        "Failed to save product:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     DELETE PRODUCT
  ========================================== */

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product._id);

      setProducts((prev) =>
        prev.filter(
          (item) =>
            item._id !== product._id
        )
      );

      toast.success(
        "Product deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete product:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  /* ==========================================
     ERROR
  ========================================== */

  if (error) {
    return (
      <section className="py-12">
        <Card className="border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-700">
            Products unavailable
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadProducts}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-8 py-6">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <SectionTitle
            Badge="Admin"
            title="Products"
            subtitle="Create, manage and publish your digital products."
          />
        </div>

        <Button
          onClick={handleCreate}
          className="inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {/* ==========================================
          STATISTICS
      ========================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Package size={22} />}
          label="Total Products"
          value={stats.total}
        />

        <StatCard
          icon={<Eye size={22} />}
          label="Published"
          value={stats.published}
        />

        <StatCard
          icon={<EyeOff size={22} />}
          label="Unpublished"
          value={stats.unpublished}
        />

        <StatCard
          icon={<Star size={22} />}
          label="Featured"
          value={stats.featured}
        />
      </div>

      {/* ==========================================
          FILTERS
      ========================================== */}

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
          >
            <option value="All">
              All Categories
            </option>

            {CATEGORIES.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
          >
            <option value="All">
              All Status
            </option>
            <option value="Published">
              Published
            </option>
            <option value="Unpublished">
              Unpublished
            </option>
            <option value="Featured">
              Featured
            </option>
          </select>
        </div>
      </Card>

      {/* ==========================================
          PRODUCTS
      ========================================== */}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Stats
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >
                    <Package
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 font-semibold text-slate-700">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try adjusting your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(
                  (product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              product.image ||
                              "/images/product-placeholder.png"
                            }
                            alt={
                              product.name
                            }
                            className="h-14 w-14 rounded-xl object-cover"
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate font-bold text-slate-900">
                                {
                                  product.name
                                }
                              </h3>

                              {product.featured && (
                                <Star
                                  size={15}
                                  className="fill-yellow-400 text-yellow-400"
                                />
                              )}
                            </div>

                            <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                              {
                                product.excerpt ||
                                product.description
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {
                            product.category
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold text-slate-900">
                        {product.currency ||
                          "USD"}{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {product.published
                            ? "Published"
                            : "Unpublished"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-xs text-slate-500">
                          <p>
                            {product.views ||
                              0}{" "}
                            views
                          </p>

                          <p className="mt-1">
                            {product.downloads ||
                              0}{" "}
                            downloads
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                            title="Edit product"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                            title="Delete product"
                          >
                            <Trash2
                              size={17}
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
      </Card>

      {/* ==========================================
          PRODUCT MODAL
      ========================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Create Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingProduct
                    ? "Update the product information."
                    : "Add a new digital product to KanuorieTech."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Product Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. React Admin Dashboard"
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <FormField
                label="Excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short product summary"
                maxLength={250}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Describe the product..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <FormField
                label="Image URL"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />

              <div className="grid gap-5 md:grid-cols-3">
                <FormField
                  label="Price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                />

                <FormField
                  label="Currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  placeholder="USD"
                />

                <FormField
                  label="Download URL"
                  name="downloadUrl"
                  value={form.downloadUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Demo URL"
                  name="demoUrl"
                  value={form.demoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <FormField
                  label="GitHub URL"
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <FormField
                label="Technologies"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span>
                    <span className="block font-semibold text-slate-800">
                      Featured Product
                    </span>

                    <span className="text-xs text-slate-500">
                      Display this product in featured sections.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span>
                    <span className="block font-semibold text-slate-800">
                      Published
                    </span>

                    <span className="text-xs text-slate-500">
                      Make this product visible publicly.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
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
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}

/* ==========================================
   FORM FIELD
========================================== */

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        {...props}
      />
    </div>
  );
}