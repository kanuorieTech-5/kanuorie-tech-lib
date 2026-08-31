import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Card, Button, Loader, Pagination } from "../components/common";

import { SearchBar } from "../components/layout";

import { getServices } from "../services";
import { CTA, Newsletter } from "../components/home";

const PER_PAGE = 9;

// const FALLBACK_IMAGE = "/images/service-placeholder.jpg";

// const FALLBACK_DESCRIPTION =
("Learn more about this service and how it can help your business.");

const getServicesData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.services)) {
    return response.data.services;
  }

  if (Array.isArray(response?.services)) {
    return response.services;
  }

  return [];
};

const getServiceId = (service) => {
  return service?._id || service?.id || null;
};

const getServiceDescription = (service) => {
  const description = service?.description?.trim();

  if (!description) {
    return FALLBACK_DESCRIPTION;
  }

  return description;
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        const response = await getServices();

        const data = getServicesData(response);

        if (isMounted) {
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to load services:", error);

        if (isMounted) {
          setServices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        services.map((service) => service?.category?.trim()).filter(Boolean),
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const title = service?.title?.toLowerCase() || "";

      const description = service?.description?.toLowerCase() || "";

      const serviceCategory = service?.category || "";

      const matchesSearch =
        !query || title.includes(query) || description.includes(query);

      const matchesCategory =
        category === "All" || serviceCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  const totalPages = Math.ceil(filteredServices.length / PER_PAGE);

  const currentServices = useMemo(() => {
    const startIndex = (page - 1) * PER_PAGE;

    return filteredServices.slice(startIndex, startIndex + PER_PAGE);
  }, [filteredServices, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (loading) {
    return (
      <section
        className="flex min-h-[60vh] items-center justify-center bg-slate-950 px-6"
        aria-label="Loading services"
      >
        <Loader />
      </section>
    );
  }

  return (
    <>
      <section className="bg-slate-950 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* HEADER */}

          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">
              What We Do
            </p>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Our Services
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-400">
              Discover the digital solutions and technology services we provide
              to help businesses build, grow, and succeed.
            </p>
          </div>

          {/* FILTERS */}

          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search services..."
              />
            </div>

            <label className="sr-only" htmlFor="service-category">
              Filter services by category
            </label>

            <select
              id="service-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/5
                px-4 py-3 text-white outline-none transition
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-slate-900 text-white"
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* RESULTS */}

          {currentServices.length === 0 ? (
            <Card className="border-white/10 bg-white/90 p-12 text-center backdrop-blur-xl">
              <h2 className="mb-3 text-2xl font-bold text-black">
                No services found
              </h2>

              <p className="text-slate-600">
                Try changing your search or category filter.
              </p>

              {(search || category !== "All") && (
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentServices.map((service) => {
                const serviceId = getServiceId(service);

                // Skip malformed records instead of
                // creating broken links.
                if (!serviceId) {
                  return null;
                }

                const title = service?.title?.trim() || "Technology Service";

                const description = getServiceDescription(service);

                return (
                  <Card
                    key={serviceId}
                    className="group flex h-full flex-col overflow-hidden border-white/10 bg-white/5 p-0
                      backdrop-blur-xl transition-all duration-300 hover:-translate-y-2
                      hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div className="overflow-hidden">
                      {/* <img
                        src={
                          service?.image ||
                          FALLBACK_IMAGE
                        }
                        alt={`${title} service`}
                        loading="lazy"
                        decoding="async"
                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                      /> */}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {service?.category && (
                        <p className="mb-3 text-sm font-medium text-cyan-400">
                          {service.category}
                        </p>
                      )}
                      <h2 className="mb-3 text-2xl font-bold text-white">
                        {title}
                      </h2>

                      {/* DESCRIPTION */}

                      <p className="mb-8 line-clamp-3 flex-1 leading-7 text-slate-400">
                        {description}
                      </p>

                      {/* ACTION */}

                      <Link
                        to={`/services/${serviceId}`}
                        className="mt-auto"
                        aria-label={`Learn more about ${title}`}
                      >
                        <Button fullWidth>Learn More</Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
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
        </div>
      </section>

      {/* CTA */}

      <CTA />

      {/* NEWSLETTER */}

      <Newsletter />
    </>
  );
}
