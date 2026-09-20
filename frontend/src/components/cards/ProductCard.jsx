import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Github,
  Globe,
} from "lucide-react";

import { Badge, Button, Card } from "../ui";

export default function ProductCard({
  product,
}) {
  if (!product) return null;

  const pricingType =
    product.pricingType || "Free";

  const price =
    Number(product.price) || 0;

  const isPaid =
    pricingType === "Paid";

  const pricingLabel =
    pricingType === "Paid" && price > 0
      ? `${product.currency || "USD"} ${price.toLocaleString()}+`
      : pricingType;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* ======================================
          IMAGE
      ====================================== */}

      <Link
        to={`/products/${product._id}`}
        className="relative block overflow-hidden"
      >
        <img
          src={
            product.image ||
            "/images/product-placeholder.png"
          }
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src =
              "/images/product-placeholder.png";
          }}
        />

        {product.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-950 shadow-lg">
            Featured
          </span>
        )}
      </Link>

      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="flex flex-1 flex-col space-y-4 p-5">
        {/* CATEGORY + PRICING */}

        <div className="flex items-center justify-between gap-3">
          <Badge>
            {product.category ||
              "Other"}
          </Badge>

          <span
            className={`text-xs font-semibold ${
              isPaid
                ? "text-blue-600"
                : "text-emerald-600"
            }`}
          >
            {pricingLabel}
          </span>
        </div>

        {/* NAME */}

        <Link
          to={`/products/${product._id}`}
        >
          <h3 className="line-clamp-2 text-xl font-semibold transition group-hover:text-blue-600">
            {product.name ||
              "Developer Product"}
          </h3>
        </Link>

        {/* DESCRIPTION */}

        <p className="line-clamp-3 text-sm leading-6 text-gray-500">
          {product.excerpt ||
            product.description ||
            "A useful tool for developers and businesses."}
        </p>

        {/* TECHNOLOGIES */}

        {Array.isArray(
          product.technologies
        ) &&
          product.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.technologies
                .slice(0, 3)
                .map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300"
                  >
                    {technology}
                  </span>
                ))}
            </div>
          )}

        {/* ACTIONS */}

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Button
            as={Link}
            to={`/products/${product._id}`}
            size="sm"
            className="flex-1"
          >
            Explore Product
            <ArrowUpRight
              size={15}
              className="ml-1"
            />
          </Button>

          {product.websiteUrl && (
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${product.name} website`}
              title="Official Website"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:hover:border-blue-400"
            >
              <Globe size={16} />
            </a>
          )}

          {product.githubUrl && (
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} GitHub`}
              title="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-500 hover:text-slate-900 dark:border-white/10 dark:hover:text-white"
            >
              <Github size={16} />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}