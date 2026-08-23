import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
  Pagination,
} from "../components/common";
import {
  Newsletter,
  CTA,
} from "../components/home";

import { SearchBar, Footer } from "../components/layout";

import { getProjects } from "../services";

const PER_PAGE = 9;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  /* ==========================================
     LOAD PROJECTS
  ========================================== */

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getProjects();

        setProjects(
          Array.isArray(res?.data)
            ? res.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );

        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  /* ==========================================
     CATEGORIES
  ========================================== */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        projects
          .map((project) => project?.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [projects]);

  /* ==========================================
     FILTER PROJECTS
  ========================================== */

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const title =
        project?.title?.toLowerCase() || "";

      const description =
        project?.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesCategory =
        category === "All" ||
        project?.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [projects, search, category]);

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages = Math.ceil(
    filteredProjects.length / PER_PAGE
  );

  const currentProjects = filteredProjects.slice(
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
            Our Work
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Projects
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-gray-600">
            Explore some of the digital products,
            websites, and solutions we have built
            for our clients and users.
          </p>

        </div>

        {/* FILTERS */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">

          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
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
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* RESULTS */}
        {currentProjects.length === 0 ? (

          <Card className="p-12 text-center">

            <h2 className="mb-3 text-2xl font-bold">
              No projects found
            </h2>

            <p className="text-gray-600">
              Try changing your search or category
              filter.
            </p>

          </Card>

        ) : (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {currentProjects.map((project) => (

              <Card
                key={project._id}
                className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGE */}
                <img
                  src={
                    project.image ||
                    "/images/project-placeholder.jpg"
                  }
                  alt={
                    project.title ||
                    "Project"
                  }
                  loading="lazy"
                  className="mb-5 h-56 w-full rounded-lg object-cover"
                />

                {/* CATEGORY */}
                {project.category && (
                  <p className="mb-2 text-sm font-medium text-blue-600">
                    {project.category}
                  </p>
                )}

                {/* TITLE */}
                <h2 className="mb-3 text-2xl font-bold">
                  {project.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="mb-6 line-clamp-3 text-gray-600">
                  {project.description ||
                    "Explore this project and learn more about the solution."}
                </p>

                {/* ACTION */}
                <Link
                  to={`/projects/${project._id}`}
                >
                  <Button fullWidth>
                    View Project
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
