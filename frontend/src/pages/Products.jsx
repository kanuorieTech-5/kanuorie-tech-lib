import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { Card, Button, Loader, Pagination, } from "../components/common";
import { SearchBar } from "../components/layout";
import { getProducts } from "../services";
import { CTA, Newsletter } from "../components/home";

const PER_PAGE = 12;

const PRODUCT_PLACEHOLDER =
  "/images/product-placeholder.jpg";

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

const getProductPrice = (product) => {
  const price = Number(product?.price);

  return Number.isFinite(price) && price >= 0
    ? price
    : null;
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

        const response = await getProducts();
        const data = getProductsData(response);

        if (mounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error(
          "Failed to load products:",
          err
        );

        if (mounted) {
          setProducts([]);
          setError(
            "We couldn't load the products right now. Please try again."
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

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product?.category?.trim())
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const title =
        product?.title?.toLowerCase() || "";

      const description =
        product?.description?.toLowerCase() || "";

      const productCategory =
        product?.category || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesCategory =
        category === "All" ||
        productCategory === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(
    filteredProducts.length / PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
        {/* Background grid */}

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]
            bg-[size:45px_45px]
          "
          aria-hidden="true"
        />

        {/* Decorative glow */}

        <div
          className="
            absolute
            left-1/2
            top-0
            h-72
            w-72
            -translate-x-1/2
            rounded-full
            bg-blue-500/10
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
            "
          >
            <BookOpen
              size={16}
              aria-hidden="true"
            />

            Digital Products
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
            Tools Built To Help You{" "}
            <span className="text-blue-400">
              Grow
            </span>
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
            Explore premium digital resources,
            templates and technology products
            created by KanuorieTech to help you
            learn, build and grow.
          </motion.p>
        </div>
      </section>
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

          <div className="mb-12">
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
              Our Products
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
              Explore Our Digital Products
            </h2>

            <p
              className="
                max-w-2xl
                text-base
                leading-7
                text-slate-600
                lg:text-lg
                lg:leading-8
              "
            >
              Discover digital tools and resources
              designed to support your learning,
              productivity and digital growth.
            </p>
          </div>

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
                placeholder="Search products..."
              />
            </div>

            <div className="md:w-56">
              <label
                htmlFor="product-category"
                className="
                  sr-only
                "
              >
                Filter products by category
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
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
            className="mb-6 text-sm text-slate-500"
          >
            {filteredProducts.length > 0
              ? `${filteredProducts.length} ${
                  filteredProducts.length === 1
                    ? "product"
                    : "products"
                } found`
              : "No products found"}
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
                No products found
              </h2>

              <p className="text-slate-600">
                Try changing your search or
                category filter.
              </p>

              {(search || category !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="
                    mt-6
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  Clear filters
                </button>
              )}
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
              {paginatedProducts.map(
                (product, index) => {
                  const productId =
                    getProductId(product);

                  const price =
                    getProductPrice(product);

                  return (
                    <motion.div
                      key={
                        productId ||
                        `product-${index}`
                      }
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
                        delay: Math.min(
                          index * 0.06,
                          0.3
                        ),
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      className="h-full"
                    >
                      <Card
                        className="
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
                          hover:shadow-xl
                        "
                      >
                        {/* Image */}

                        <div className="overflow-hidden">
                          <img
                            src={
                              product?.image ||
                              product?.coverImage ||
                              PRODUCT_PLACEHOLDER
                            }
                            alt={
                              product?.title ||
                              "Digital product"
                            }
                            loading="lazy"
                            className="
                              h-56
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              hover:scale-105
                            "
                            onError={(event) => {
                              if (
                                event.currentTarget.src.includes(
                                  PRODUCT_PLACEHOLDER
                                )
                              ) {
                                return;
                              }

                              event.currentTarget.src =
                                PRODUCT_PLACEHOLDER;
                            }}
                          />
                        </div>

                        {/* Content */}

                        <div
                          className="
                            flex
                            flex-1
                            flex-col
                            p-6
                          "
                        >
                          {/* Category */}

                          {product?.category && (
                            <p
                              className="
                                mb-2
                                text-sm
                                font-semibold
                                text-blue-600
                              "
                            >
                              {product.category}
                            </p>
                          )}

                          {/* Title */}

                          <h3
                            className="
                              mb-3
                              text-xl
                              font-bold
                              text-slate-900
                            "
                          >
                            {product?.title ||
                              "Digital Product"}
                          </h3>

                          {/* Description */}

                          <p
                            className="
                              mb-6
                              line-clamp-3
                              leading-6
                              text-slate-600
                            "
                          >
                            {product?.description ||
                              "View this product for more information."}
                          </p>

                          {/* Price */}

                          <p
                            className="
                              mb-6
                              mt-auto
                              text-2xl
                              font-bold
                              text-blue-600
                            "
                          >
                            {price !== null
                              ? `₦${price.toLocaleString(
                                  "en-NG"
                                )}`
                              : "Price unavailable"}
                          </p>

                          {/* Action */}

                          {productId ? (
                            <Link
                              to={`/products/${productId}`}
                              className="mt-auto"
                            >
                              <Button fullWidth>
                                View Product
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              fullWidth
                              disabled
                            >
                              Unavailable
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                page={page}
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