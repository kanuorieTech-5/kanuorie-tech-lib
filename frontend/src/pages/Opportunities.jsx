
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  Star,
  Building2,
  X,
} from "lucide-react";
import { getAllPublicOpportunities } from "../api/opportunityApi";

const initialPagination = {
  page: 1,
  limit: 12,
  total: 0,
  pages: 1,
};

const opportunityTypes = [
  ["job", "Jobs"],
  ["internship", "Internships"],
  ["scholarship", "Scholarships"],
  ["grant", "Grants"],
  ["fellowship", "Fellowships"],
  ["event", "Events"],
  ["volunteer", "Volunteer"],
  ["competition", "Competitions"],
  ["other", "Other"],
];

const unwrapResponse = (response) => {
  // Handle both Axios responses and already-unwrapped API responses.
  let payload = response?.data ?? response;

  // Handle nested API response formats.
  for (let i = 0; i < 3; i += 1) {
    if (Array.isArray(payload?.items)) {
      return {
        items: payload.items,
        pagination: payload.pagination ?? initialPagination,
      };
    }

    if (payload?.data !== undefined) {
      payload = payload.data;
      continue;
    }

    break;
  }

  // Handle APIs that return an array directly.
  if (Array.isArray(payload)) {
    return {
      items: payload,
      pagination: {
        ...initialPagination,
        total: payload.length,
      },
    };
  }

  console.warn("Unexpected opportunities API response:", response);

  return {
    items: [],
    pagination: initialPagination,
  };
};

const formatDate = (date) => {
  if (!date) return "No deadline specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "No deadline specified";
  }

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isExpired = (deadline) => {
  if (!deadline) return false;

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;

  date.setHours(23, 59, 59, 999);
  return date < new Date();
};

const OpportunityCard = ({ opportunity }) => {
  const id = opportunity.slug || opportunity._id || opportunity.id;
  const expired = isExpired(opportunity.deadline);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          {(opportunity.type || "other").replace("-", " ")}
        </span>

        {opportunity.featured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            <Star size={13} fill="currentColor" />
            Featured
          </span>
        )}
      </div>

      <div className="mt-6 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/15">
          <Building2 size={22} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
            {opportunity.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {opportunity.organization}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} />
          {opportunity.location || "Not specified"}
        </span>

        {opportunity.workMode &&
          opportunity.workMode !== "not-applicable" && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 capitalize dark:bg-slate-800">
              {opportunity.workMode}
            </span>
          )}
      </div>

      <p className="mt-4 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-400">
        {opportunity.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
        <span
          className={`inline-flex items-center gap-1.5 ${
            expired
              ? "text-red-600 dark:text-red-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <CalendarDays size={14} />
          {expired ? "Deadline passed" : formatDate(opportunity.deadline)}
        </span>

        <Link
          to={`/opportunities/${id}`}
          className="inline-flex items-center gap-1 font-bold text-blue-600 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View details
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
};

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

const loadOpportunities = useCallback(async () => {
try {
    setLoading(true);
    setError("");

    // Use the same API function that successfully loads opportunities
    // on the Careers page.
    const allItems = await getAllPublicOpportunities();
    console.log("OPPORTUNITIES PAGE - API RESULT:", allItems);
    console.log(
    "OPPORTUNITIES PAGE - IS ARRAY:",
    Array.isArray(allItems)
    );
    console.log(
    "OPPORTUNITIES PAGE - COUNT:",
    allItems?.length
    );

    // Search opportunities.
    let filteredItems = allItems.filter((opportunity) => {
    if (!search) return true;

    const searchText = [
        opportunity.title,
        opportunity.organization,
        opportunity.description,
        opportunity.category,
        opportunity.location,
        ...(Array.isArray(opportunity.tags) ? opportunity.tags : []),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return searchText.includes(search.toLowerCase());
    });

    // Filter by opportunity type.
    if (type) {
    filteredItems = filteredItems.filter(
        (opportunity) => opportunity.type === type
    );
    }

    // Filter by category.
    if (category) {
    filteredItems = filteredItems.filter((opportunity) =>
        String(opportunity.category || "")
        .toLowerCase()
        .includes(category.toLowerCase())
    );
    }

    // Client-side pagination.
    const total = filteredItems.length;
    const pages = Math.max(1, Math.ceil(total / 12));
    const currentPage = Math.min(page, pages);

    const startIndex = (currentPage - 1) * 12;

    setOpportunities(filteredItems.slice(startIndex, startIndex + 12));
        console.log("OPPORTUNITIES PAGE - FILTERED:", filteredItems);
        console.log("OPPORTUNITIES PAGE - TOTAL:", total);
        console.log("OPPORTUNITIES PAGE - PAGE:", currentPage);
        
    setPagination({
    page: currentPage,
    limit: 12,
    total,
    pages,
    });

    if (currentPage !== page) {
    setPage(currentPage);
    }
} catch (err) {
    console.error("Failed to load opportunities:", err);

    setError(
    err.response?.data?.message ||
        "We couldn't load opportunities right now. Please try again."
    );

    setOpportunities([]);
} finally {
    setLoading(false);
}
}, [page, search, type, category]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setType("");
    setCategory("");
    setPage(1);
  };

  const hasFilters = Boolean(search || type || category);

  return (
    <main className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-20 text-white sm:px-6 lg:py-28">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur">
            <BriefcaseBusiness size={15} />
            KanuorieTech Opportunities
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Discover opportunities.
            <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-yellow-200 bg-clip-text text-transparent">
              Build your future.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore jobs, internships, scholarships, grants, fellowships,
            competitions and other opportunities to help you grow.
          </p>

          <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search jobs, scholarships, internships..."
                className="w-full rounded-xl border-0 bg-transparent py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-0"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch(searchInput.trim());
                setPage(1);
              }}
              className="rounded-xl bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-500"
            >
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-300">
            <span>{pagination.total} opportunities listed</span>
            <span>Updated listings</span>
            <span>Explore and apply</span>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Explore opportunities
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              Find your next opportunity
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Browse currently published and open listings.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {pagination.total} result{pagination.total === 1 ? "" : "s"}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <SlidersHorizontal size={17} />
            Filters
          </div>

          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              setPage(1);
            }}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="">All opportunity types</option>
            {opportunityTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            placeholder="Filter by category"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p>{error}</p>
            <button
              type="button"
              onClick={loadOpportunities}
              className="mt-3 inline-flex items-center gap-2 font-bold"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id || opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <BriefcaseBusiness
              size={42}
              className="mx-auto text-slate-300"
            />
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              {hasFilters ? "No matching opportunities" : "No opportunities available yet"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {hasFilters
                ? "Try another search or adjust your filters."
                : "New opportunities will appear here as they are published."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && pagination.pages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {pagination.page} of {pagination.pages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
