import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Users,
  Clock3,
  Star,
  Filter,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
  Pagination,
} from "../components/common";

import { SearchBar, Footer } from "../components/layout";

import { getProducts } from "../services";
import { CTA, Newsletter } from "../components/home";

const PER_PAGE = 12;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  /* ==========================================
     LOAD PRODUCTS
  ========================================== */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();

        setProducts(
          Array.isArray(res?.data)
            ? res.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ==========================================
     CATEGORIES
  ========================================== */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product?.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const title =
        product?.title?.toLowerCase() || "";

      const description =
        product?.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesCategory =
        category === "All" ||
        product?.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [products, search, category]);

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages = Math.ceil(
    filteredProducts.length / PER_PAGE
  );

  const paginatedProducts =
    filteredProducts.slice(
      (page - 1) * PER_PAGE,
      page * PER_PAGE
    );

  /* ==========================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================== */

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <>
    {/* HERO */}
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-8 text-white">
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative px-6 text-center">

          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400"
          >
            <BookOpen size={16} />
            
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15 }}
            className="mt-8 text-5xl font-black leading-tight lg:text-7xl"
          >
            Explore Our
            <span className="text-blue-400">
              {" "}Professional
            </span>
            <br />
            Technology Courses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .3 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300"
          >
            Master modern software development through
            practical, project-based learning designed to
            help you become job-ready and industry
            confident.
          </motion.p>

        </div>
    </section>
    <section className=" px-6 py-16 lg:px-8">

      {/* HEADER */}

      <div className="mb-12">

        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Our Products
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Products
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-gray-600">
          Explore our collection of products and
          digital solutions designed to meet your
          needs.
        </p>

      </div>

      {/* FILTERS */}

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">

        <div className="flex-1">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />

        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

      {/* PRODUCTS */}

      {paginatedProducts.length === 0 ? (

        <Card className="p-12 text-center">

          <h2 className="mb-3 text-2xl font-bold">
            No products found
          </h2>

          <p className="text-gray-600">
            Try changing your search or category
            filter.
          </p>

        </Card>

      ) : (

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {paginatedProducts.map(
            (product) => {

              const price =
                Number(product?.price);

              return (
                <Card
                  key={product._id}
                  className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* IMAGE */}

                  <img
                    src={
                      product?.image ||
                      "/images/product-placeholder.jpg"
                    }
                    alt={
                      product?.title ||
                      "Product"
                    }
                    loading="lazy"
                    className="mb-5 h-56 w-full rounded-lg object-cover"
                  />

                  {/* CATEGORY */}

                  {product?.category && (
                    <p className="mb-2 text-sm font-medium text-blue-600">
                      {product.category}
                    </p>
                  )}

                  {/* TITLE */}

                  <h2 className="mb-3 text-xl font-bold">
                    {product?.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="mb-4 line-clamp-3 text-gray-600">
                    {product?.description ||
                      "View this product for more information."}
                  </p>

                  {/* PRICE */}

                  <p className="mb-6 text-2xl font-bold text-blue-600">
                    {Number.isFinite(price)
                      ? `₦${price.toLocaleString()}`
                      : "Price unavailable"}
                  </p>

                  {/* ACTION */}

                  <Link
                    to={`/products/${product._id}`}
                  >
                    <Button fullWidth>
                      View Product
                    </Button>
                  </Link>

                </Card>
              );
            }
          )}

        </div>

      )}

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="mt-12">

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

        </div>
      )}
    </section>
    <CTA />
    <Newsletter />
    </>
  );
}