import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderKanban, Search } from "lucide-react";

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

import { SearchBar } from "../components/layout";

import { getProjects } from "../services";

const PER_PAGE = 9;

const PROJECT_PLACEHOLDER =
  "/images/project-placeholder.jpg";

/* ==========================================
   HELPERS
========================================== */

const getProjectsData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.projects)) {
    return response.data.projects;
  }

  if (Array.isArray(response?.projects)) {
    return response.projects;
  }

  return [];
};

const getProjectId = (project) => {
  return project?._id || project?.id || null;
};

const getProjectDescription = (project) => {
  const description =
    project?.description?.trim();

  if (!description) {
    return "Explore this project and learn more about the solution.";
  }

  return description;
};

/* ==========================================
   COMPONENT
========================================== */

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  /* ==========================================
     LOAD PROJECTS
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProjects();

        const data =
          getProjectsData(response);

        if (mounted) {
          setProjects(data);
        }
      } catch (err) {
        console.error(
          "Failed to load projects:",
          err
        );

        if (mounted) {
          setProjects([]);
          setError(
            "We couldn't load the projects right now. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     CATEGORIES
  ========================================== */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        projects
          .map((project) =>
            project?.category?.trim()
          )
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [projects]);

  /* ==========================================
     FILTER PROJECTS
  ========================================== */

  const filteredProjects = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return projects.filter((project) => {
      const title =
        project?.title?.toLowerCase() || "";

      const description =
        project?.description?.toLowerCase() ||
        "";

      const projectCategory =
        project?.category || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesCategory =
        category === "All" ||
        projectCategory === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    projects,
    search,
    category,
  ]);

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages = Math.ceil(
    filteredProjects.length / PER_PAGE
  );

  const currentProjects = useMemo(() => {
    const start =
      (page - 1) * PER_PAGE;

    const end = start + PER_PAGE;

    return filteredProjects.slice(
      start,
      end
    );
  }, [
    filteredProjects,
    page,
  ]);

  /* ==========================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================== */

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  /* ==========================================
     KEEP PAGE VALID
  ========================================== */

  useEffect(() => {
    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <section
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          px-6
        "
        aria-label="Loading projects"
      >
        <Loader />
      </section>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <>
      {/* ========================================
          HERO
      ======================================== */}

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

        {/* Glow */}

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
            <FolderKanban
              size={16}
              aria-hidden="true"
            />

            Our Portfolio
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
            Projects That Create{" "}
            <span className="text-blue-400">
              Real Impact
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
            Explore digital products, websites,
            platforms and technology solutions
            built by KanuorieTech.
          </motion.p>
        </div>
      </section>

      {/* ========================================
          PROJECTS
      ======================================== */}

      <section
        className="
          bg-slate-50
          px-6
          py-16
          lg:px-8
          lg:py-20
        "
        aria-labelledby="projects-heading"
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
              Our Work
            </p>

            <h2
              id="projects-heading"
              className="
                mb-4
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-5xl
              "
            >
              Explore Our Projects
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
              Discover some of the digital
              solutions, platforms and products
              we have built for businesses,
              organizations and learners.
            </p>
          </div>

          {/* Filters */}

          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center"
          >
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search projects..."
              />
            </div>

            <div className="md:w-56">
              <label
                htmlFor="project-category"
                className="sr-only"
              >
                Filter projects by category
              </label>

              <select
                id="project-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
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

          {/* Result count */}

          <div
            aria-live="polite"
            className="
              mb-6
              text-sm
              text-slate-500
            "
          >
            {filteredProjects.length > 0
              ? `${filteredProjects.length} ${
                  filteredProjects.length === 1
                    ? "project"
                    : "projects"
                } found`
              : "No projects found"}
          </div>

          {/* Projects */}

          {currentProjects.length === 0 ? (
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
                No projects found
              </h2>

              <p className="text-slate-600">
                Try changing your search or
                category filter.
              </p>

              {(search ||
                category !== "All") && (
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
                    transition
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
              "
            >
              {currentProjects.map(
                (project, index) => {
                  const projectId =
                    getProjectId(project);

                  return (
                    <motion.div
                      key={
                        projectId ||
                        `project-${index}`
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
                              project?.image ||
                              PROJECT_PLACEHOLDER
                            }
                            alt={
                              project?.title
                                ? `${project.title} project`
                                : "KanuorieTech project"
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
                            onError={(
                              event
                            ) => {
                              if (
                                event
                                  .currentTarget
                                  .src
                                  .includes(
                                    PROJECT_PLACEHOLDER
                                  )
                              ) {
                                return;
                              }

                              event.currentTarget.src =
                                PROJECT_PLACEHOLDER;
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

                          {project?.category && (
                            <p
                              className="
                                mb-2
                                text-sm
                                font-semibold
                                text-blue-600
                              "
                            >
                              {project.category}
                            </p>
                          )}

                          {/* Title */}

                          <h3
                            className="
                              mb-3
                              text-2xl
                              font-bold
                              text-slate-900
                            "
                          >
                            {project?.title ||
                              "KanuorieTech Project"}
                          </h3>

                          {/* Description */}

                          <p
                            className="
                              mb-8
                              line-clamp-3
                              flex-1
                              leading-7
                              text-slate-600
                            "
                          >
                            {getProjectDescription(
                              project
                            )}
                          </p>

                          {/* Action */}

                          {projectId ? (
                            <Link
                              to={`/projects/${projectId}`}
                              className="mt-auto"
                            >
                              <Button fullWidth>
                                View Project
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

          {/* Pagination */}

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