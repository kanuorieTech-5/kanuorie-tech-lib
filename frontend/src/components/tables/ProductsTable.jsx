import { ExternalLink, Eye, EyeOff, Star } from "lucide-react";

import DataTable from "./DataTable";
import { Button } from "../ui";

const getPricingLabel = (product) => {
  const pricingType = product?.pricingType || "Free";

  const price = Number(product?.price);

  if (pricingType === "Paid" && Number.isFinite(price) && price > 0) {
    return `${product?.currency || "USD"} ${price.toLocaleString()}`;
  }

  return pricingType;
};

export default function ProductsTable({
  products = [],
  loading,
  page,
  totalPages,
  search,
  onSearch,
  onPrevious,
  onNext,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      title: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div
            className="
              h-11
              w-11
              shrink-0
              overflow-hidden
              rounded-lg
              bg-slate-100
            "
          >
            <img
              src={product?.image || "/images/product-placeholder.png"}
              alt={product?.name || "Product"}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/product-placeholder.png";
              }}
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                max-w-[220px]
                truncate
                font-semibold
                text-slate-900
              "
            >
              {product?.name || "Unnamed Product"}
            </p>

            {product?.excerpt && (
              <p
                className="
                  max-w-[220px]
                  truncate
                  text-xs
                  text-slate-500
                "
              >
                {product.excerpt}
              </p>
            )}
          </div>
        </div>
      ),
    },

    {
      key: "category",
      title: "Category",
      render: (product) => (
        <span
          className="
            inline-flex
            rounded-full
            bg-blue-50
            px-3
            py-1
            text-xs
            font-semibold
            text-blue-700
          "
        >
          {product?.category || "Other"}
        </span>
      ),
    },

    {
      key: "pricingType",
      title: "Pricing",
      render: (product) => (
        <div>
          <p className="font-semibold text-slate-900">
            {getPricingLabel(product)}
          </p>

          {product?.pricingType && (
            <p className="text-xs text-slate-500">{product.pricingType}</p>
          )}
        </div>
      ),
    },

    {
      key: "published",
      title: "Status",
      render: (product) => (
        <div className="flex flex-wrap gap-2">
          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${
                product?.published
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {product?.published ? <Eye size={13} /> : <EyeOff size={13} />}

            {product?.published ? "Published" : "Draft"}
          </span>

          {product?.featured && (
            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                bg-yellow-50
                px-3
                py-1
                text-xs
                font-semibold
                text-yellow-700
              "
            >
              <Star size={13} className="fill-current" />
              Featured
            </span>
          )}
        </div>
      ),
    },

    {
      key: "views",
      title: "Views",
      render: (product) => (
        <span className="text-sm text-slate-600">
          {Number(product?.views || 0).toLocaleString()}
        </span>
      ),
    },

    {
      key: "actions",
      title: "Actions",
      render: (product) => (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>

          {product?._id && (
            <a
              href={`/products/${product._id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${product.name}`}
              title="View Product"
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                text-slate-500
                transition
                hover:border-blue-500
                hover:text-blue-600
              "
            >
              <ExternalLink size={16} />
            </a>
          )}

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      page={page}
      totalPages={totalPages}
      search={search}
      onSearch={onSearch}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
}
