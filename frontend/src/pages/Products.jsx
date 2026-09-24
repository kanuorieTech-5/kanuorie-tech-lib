import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Github, Globe, Search } from "lucide-react";

import { Card, Button, Loader, Pagination } from "../components/common";
import { SearchBar } from "../components/layout";
import { getProducts } from "../services";
import { CTA, Newsletter } from "../components/home";

const PER_PAGE = 12;

const PRODUCT_PLACEHOLDER = "/images/product-placeholder.png";

const CATEGORIES = [
  "All",
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

const getProductsData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  return [];
};

const getProductId = (product) => {
  return product?._id || product?.id || null;
};

const getPricingLabel = (product) => {
  const pricingType = product?.pricingType || "Free";

  const price = Number(product?.price);

  if (pricingType === "Paid" && Number.isFinite(price) && price > 0) {
    return `${product?.currency || "USD"} ${price.toLocaleString()}`;
  }

  return pricingType;
};

const getPricingClass = (pricingType) => {
  if (pricingType === "Paid") {
    return "text-blue-600";
  }

  if (pricingType === "Freemium") {
    return "text-purple-600";
  }

  if (pricingType === "Open Source") {
    return "text-orange-600";
  }

  return "text-emerald-600";
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts({
          limit: 100,
          published: true,
        });
        const data = getProductsData(response);

        if (mounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);

        if (mounted) {
          setProducts([]);
          setError(
            "We couldn't load the product directory right now. Please try again.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const availableCategories = useMemo(() => {
    const existingCategories = new Set(
      products.map((product) => product?.category).filter(Boolean),
    );

    return CATEGORIES.filter(
      (item) => item === "All" || existingCategories.has(item),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = product?.name?.toLowerCase() || "";

      const excerpt = product?.excerpt?.toLowerCase() || "";

      const description = product?.description?.toLowerCase() || "";

      const technologies = Array.isArray(product?.technologies)
        ? product.technologies.join(" ").toLowerCase()
        : "";

      const productCategory = product?.category || "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        excerpt.includes(query) ||
        description.includes(query) ||
        technologies.includes(query);

      const matchesCategory =
        category === "All" || productCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PER_PAGE;

    return filteredProducts.slice(start, start + PER_PAGE);
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [page]);
  
  if (loading) {
    return (
      <section
        className="flex min-h-[60vh] items-center justify-center px-6"
        aria-label="Loading products"
      >
        <Loader />
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-blue-950
          py-20
          text-white
          lg:py-28
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]
            bg-[size:45px_45px]
          "
          aria-hidden="true"
        />

        <div
          className="
            absolute
            left-1/2
            top-0
            h-96
            w-96
            -translate-x-1/2
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
          aria-hidden="true"
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            h-72
            w-72
            rounded-full
            bg-yellow-400/5
            blur-3xl
          "
          aria-hidden="true"
        />

        <div
          className="
            relative
            mx-auto
            max-w-5xl
            px-6
            text-center
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              mx-auto
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-500/30
              bg-blue-500/10
              px-5
              py-2
              text-sm
              font-medium
              text-blue-400
              backdrop-blur-xl
            "
          >
            <BookOpen size={16} aria-hidden="true" />
            Developer & Business Products
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.6,
            }}
            className="
              mt-8
              text-4xl
              font-black
              leading-tight
              sm:text-5xl
              lg:text-7xl
            "
          >
            Discover the <span className="text-blue-400">Tools</span> Behind
            Modern Digital Work
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 0.6,
            }}
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-base
              leading-7
              text-slate-300
              sm:text-lg
              sm:leading-8
            "
          >
            Explore a curated directory of developer tools, AI platforms,
            databases, design software, cloud services and business technologies
            that can help you build, launch and grow.
          </motion.p>
        </div>
      </section>

      {/* =====================================================
          PRODUCT DIRECTORY
      ===================================================== */}

      <section
        className="
          bg-slate-50
          px-6
          py-16
          lg:px-8
          lg:py-20
        "
        aria-labelledby="products-heading"
      >
        <div className="mx-auto max-w-7xl">
          {/* Header */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-12"
          >
            <p
              className="
                mb-3
                text-sm
                font-semibold
                uppercase
                tracking-wider
                text-blue-600
              "
            >
              KanuorieTech Product Hub
            </p>

            <h2
              id="products-heading"
              className="
                mb-4
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-5xl
              "
            >
              Find the right tools for your work
            </h2>

            <p
              className="
                max-w-3xl
                text-base
                leading-7
                text-slate-600
                lg:text-lg
                lg:leading-8
              "
            >
              Browse useful technologies across development, AI, design,
              databases, cloud, productivity and business.
            </p>
          </motion.div>

          {/* Filters */}

          <div
            className="
              mb-10
              flex
              flex-col
              gap-4
              md:flex-row
              md:items-center
            "
          >
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search tools, platforms, technologies..."
              />
            </div>

            <div className="md:w-60">
              <label htmlFor="product-category" className="sr-only">
                Filter products by category
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  shadow-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >
                {availableCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div
              className="
                mb-10
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-6
                text-center
                text-red-700
              "
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Results */}

          <div
            aria-live="polite"
            className="
              mb-6
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
              text-sm
              text-slate-500
            "
          >
            <span>
              {filteredProducts.length > 0
                ? `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "tool" : "tools"
                  } found`
                : "No tools found"}
            </span>

            {(search || category !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Products */}

          {paginatedProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Search
                className="
                  mx-auto
                  mb-5
                  h-10
                  w-10
                  text-slate-400
                "
                aria-hidden="true"
              />

              <h2
                className="
                  mb-3
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                No tools found
              </h2>

              <p className="text-slate-600">
                Try another search term or choose a different category.
              </p>
            </Card>
          ) : (
            <div
              className="
                grid
                gap-8
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {paginatedProducts.map((product, index) => {
                const productId = getProductId(product);

                const pricingType = product?.pricingType || "Free";

                return (
                  <motion.div
                    key={productId || `product-${index}`}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.06, 0.3),
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    className="h-full"
                  >
                    <Card
                      className="
                          group
                          flex
                          h-full
                          flex-col
                          overflow-hidden
                          border-slate-200
                          bg-white
                          p-0
                          transition
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-2xl
                        "
                    >
                      {/* Image */}

                      <Link
                        to={productId ? `/products/${productId}` : "#"}
                        className="relative block overflow-hidden"
                      >
                        <img
                          src={product?.image || PRODUCT_PLACEHOLDER}
                          alt={product?.name || "Developer tool"}
                          loading="lazy"
                          className="
                              h-56
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                          onError={(event) => {
                            if (
                              event.currentTarget.src.includes(
                                PRODUCT_PLACEHOLDER,
                              )
                            ) {
                              return;
                            }

                            event.currentTarget.src = PRODUCT_PLACEHOLDER;
                          }}
                        />

                        {product?.featured && (
                          <span
                            className="
                                absolute
                                left-4
                                top-4
                                rounded-full
                                bg-yellow-400
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-slate-950
                                shadow-lg
                              "
                          >
                            Featured
                          </span>
                        )}
                      </Link>

                      {/* Content */}

                      <div
                        className="
                            flex
                            flex-1
                            flex-col
                            p-5
                          "
                      >
                        {/* Category + pricing */}

                        <div
                          className="
                              mb-3
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                        >
                          <span
                            className="
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

                          <span
                            className={`text-xs font-bold ${getPricingClass(
                              pricingType,
                            )}`}
                          >
                            {getPricingLabel(product)}
                          </span>
                        </div>

                        {/* Name */}

                        <Link to={productId ? `/products/${productId}` : "#"}>
                          <h3
                            className="
                                line-clamp-2
                                text-xl
                                font-bold
                                text-slate-900
                                transition
                                group-hover:text-blue-600
                              "
                          >
                            {product?.name || "Developer Tool"}
                          </h3>
                        </Link>

                        {/* Description */}

                        <p
                          className="
                              mt-3
                              line-clamp-3
                              text-sm
                              leading-6
                              text-slate-600
                            "
                        >
                          {product?.excerpt ||
                            product?.description ||
                            "A useful technology for developers and businesses."}
                        </p>

                        {/* Technologies */}

                        {Array.isArray(product?.technologies) &&
                          product.technologies.length > 0 && (
                            <div
                              className="
                                  mt-4
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                            >
                              {product.technologies
                                .slice(0, 3)
                                .map((technology) => (
                                  <span
                                    key={technology}
                                    className="
                                          rounded-full
                                          bg-slate-100
                                          px-2.5
                                          py-1
                                          text-xs
                                          text-slate-600
                                        "
                                  >
                                    {technology}
                                  </span>
                                ))}
                            </div>
                          )}

                        {/* Actions */}

                        <div
                          className="
                              mt-auto
                              flex
                              items-center
                              gap-2
                              pt-5
                            "
                        >
                          {productId ? (
                            <Link
                              to={`/products/${productId}`}
                              className="flex-1"
                            >
                              <Button fullWidth size="sm">
                                Explore
                                <ArrowUpRight size={15} className="ml-1" />
                              </Button>
                            </Link>
                          ) : (
                            <Button fullWidth size="sm" disabled>
                              Unavailable
                            </Button>
                          )}

                          {product?.websiteUrl && (
                            <a
                              href={product.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${product.name} website`}
                              title="Official Website"
                              className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
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
                              <Globe size={16} />
                            </a>
                          )}

                          {product?.githubUrl && (
                            <a
                              href={product.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${product.name} GitHub`}
                              title="GitHub"
                              className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-slate-200
                                  text-slate-500
                                  transition
                                  hover:border-slate-500
                                  hover:text-slate-900
                                "
                            >
                              <Github size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </section>
      <CTA />
      <Newsletter />
    </>
  );
}
