import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
  Pagination,
} from "../components/common";

import { SearchBar } from "../components/layout";

import { getServices } from "../services";
import { CTA, Newsletter } from "../components/home";

const PER_PAGE = 9;

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  /* ==========================================
     LOAD SERVICES
  ========================================== */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();

        setServices(
          Array.isArray(res?.data)
            ? res.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load services:",
          error
        );

        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  /* ==========================================
     CATEGORIES
  ========================================== */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        services
          .map((service) => service?.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [services]);

  /* ==========================================
     FILTER SERVICES
  ========================================== */

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const title =
        service?.title?.toLowerCase() || "";

      const description =
        service?.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesCategory =
        category === "All" ||
        service?.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [services, search, category]);

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages = Math.ceil(
    filteredServices.length / PER_PAGE
  );

  const currentServices =
    filteredServices.slice(
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
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

      {/* HEADER */}

      <div className="mb-12">

        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          What We Do
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Our Services
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-gray-600">
          Discover the digital solutions and
          technology services we provide to help
          businesses build, grow, and succeed.
        </p>

      </div>

      {/* FILTERS */}

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">

        <div className="flex-1">

          <SearchBar
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search services..."
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

      {/* RESULTS */}

      {currentServices.length === 0 ? (

        <Card className="p-12 text-center">

          <h2 className="mb-3 text-2xl font-bold">
            No services found
          </h2>

          <p className="text-gray-600">
            Try changing your search or category
            filter.
          </p>

        </Card>

      ) : (

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {currentServices.map((service) => (
            <Card
              key={service._id}
              className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* IMAGE */}

              <img
                src={
                  service.image ||
                  "/images/service-placeholder.jpg"
                }
                alt={
                  service.title ||
                  "Service"
                }
                loading="lazy"
                className="mb-5 h-56 w-full rounded-lg object-cover"
              />

              {/* CATEGORY */}

              {service.category && (
                <p className="mb-2 text-sm font-medium text-blue-600">
                  {service.category}
                </p>
              )}

              {/* TITLE */}

              <h2 className="mb-3 text-2xl font-bold">
                {service.title}
              </h2>

              {/* DESCRIPTION */}

              <p className="mb-6 line-clamp-3 text-gray-600">
                {service.description ||
                  "Learn more about this service and how it can help your business."}
              </p>

              {/* ACTION */}

              <Link
                to={`/services/${service._id}`}
              >
                <Button fullWidth>
                  Learn More
                </Button>
              </Link>

            </Card>

          ))}

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
