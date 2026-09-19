import { useEffect, useMemo, useState } from "react";

import {
  getBooks,
  getCourses,
  getSavedResources,
  saveResource,
  removeSavedResource,
} from "../services";

import {
  LibraryHero,
  ResourceGrid,
  CategoryFilter,
  RecommendedResources,
} from "../components/library";

import { SearchBar } from "../components/layout";

import { Newsletter, CTA } from "../components/home";

import defaultResources from "../data/resources";

const BOOKS_PER_PAGE = 12;

/* ==========================================
   RESOURCE TYPE
========================================== */

const RESOURCE_TYPES = {
  COURSE: "course",
  BOOK: "book",
  EXTERNAL: "external",
};

/* ==========================================
   NORMALIZE API DATA
========================================== */

const extractArray = (response, keys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  for (const key of keys) {
    if (Array.isArray(response?.data?.[key])) {
      return response.data[key];
    }

    if (Array.isArray(response?.[key])) {
      return response[key];
    }
  }

  return [];
};

/* ==========================================
   FORMAT EXTERNAL RESOURCES
========================================== */

const formatExternalResources = () => {
  return defaultResources.map((resource, index) => ({
    ...resource,

    resourceId: String(
      resource.id ?? resource._id ?? index
    ),

    resourceType:
      RESOURCE_TYPES.EXTERNAL,

    description:
      resource.description ??
      resource.desc ??
      "",

    image:
      resource.image ??
      resource.img ??
      resource.coverImage ??
      "",

    link:
      resource.link ??
      resource.url ??
      "",
  }));
};

/* ==========================================
   FORMAT BOOKS
========================================== */

const formatBooks = (response) => {
  const books = extractArray(response, [
    "books",
    "items",
  ]);

  return books.map((book, index) => ({
    ...book,

    resourceId: String(
      book._id ??
      book.id ??
      `book-${index}`
    ),

    resourceType:
      RESOURCE_TYPES.BOOK,

    description:
      book.description ??
      book.desc ??
      "",

    image:
      book.image ??
      book.coverImage ??
      book.img ??
      "",

    link:
      book.link ??
      book.url ??
      "",
  }));
};

/* ==========================================
   FORMAT COURSES
========================================== */

const formatCourses = (response) => {
  const courses = extractArray(response, [
    "courses",
    "items",
  ]);

  return courses.map((course, index) => ({
    ...course,

    resourceId: String(
      course._id ??
      course.id ??
      `course-${index}`
    ),

    resourceType:
      RESOURCE_TYPES.COURSE,

    description:
      course.description ??
      course.desc ??
      course.excerpt ??
      "",

    image:
      course.image ??
      course.coverImage ??
      course.thumbnail ??
      "",

    link:
      course.link ??
      course.url ??
      "",
  }));
};

/* ==========================================
   FORMAT SAVED RESOURCES
========================================== */

const formatSavedResources = (response) => {
  return extractArray(response, [
    "items",
    "resources",
    "savedResources",
  ]).map((resource) => ({
    ...resource,

    resourceId: String(
      resource.resourceId ??
      resource._id ??
      resource.id ??
      ""
    ),

    resourceType:
      resource.resourceType ??
      RESOURCE_TYPES.EXTERNAL,
  }));
};

/* ==========================================
   COMPONENT
========================================== */

export default function Library() {
  /* ========================================
     CATEGORIES
  ======================================== */

  const categories = [
    "All",
    "General",
    "Graphics Design",
    "UI/UX",
    "Frontend",
    "Backend",
    "DevOps",
    "Data Science",
    "Data Analysis",
    "Security",
    "Tools",
    "Architecture",
    "Testing",
    "AI/ML",
    "Design",
    "Database",
    "Performance",
    "Accessibility",
    "Localization",
    "AI",
    "Blockchain",
    "Mobile",
    "Other",
  ];

  /* ========================================
     STATE
  ======================================== */

  const [resources, setResources] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [savedResources, setSavedResources] =
    useState([]);

  const [savingKey, setSavingKey] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [page, setPage] =
    useState(1);

  /* ========================================
     LOAD LIBRARY
  ======================================== */

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    setLoading(true);

    try {
      const [
        booksResponse,
        coursesResponse,
        savedResponse,
      ] = await Promise.all([
        getBooks().catch((error) => {
          console.error(
            "Failed to load books:",
            error
          );

          return null;
        }),

        getCourses().catch((error) => {
          console.error(
            "Failed to load courses:",
            error
          );

          return null;
        }),

        getSavedResources().catch((error) => {
          /*
           * A logged-out visitor will normally
           * receive 401 from this protected
           * endpoint. That should not prevent
           * the public Library from loading.
           */

          console.info(
            "Saved resources unavailable:",
            error?.response?.status ||
              error?.message
          );

          return null;
        }),
      ]);

      const externalResources =
        formatExternalResources();

      const books =
        formatBooks(booksResponse);

      const courses =
        formatCourses(coursesResponse);

      const saved =
        formatSavedResources(
          savedResponse
        );

      /* ======================================
         COMBINE PUBLIC RESOURCES

         Priority:
         external resources
         books
         courses
      ====================================== */

      const combined = [
        ...externalResources,
        ...books,
        ...courses,
      ];

      /* ======================================
         REMOVE DUPLICATES

         Include resourceType in the key
         so different resource types can
         safely use the same ID.
      ====================================== */

      const unique = Array.from(
        new Map(
          combined.map((resource) => [
            `${resource.resourceType}:${resource.resourceId}`,
            resource,
          ])
        ).values()
      );

      setResources(unique);

      setSavedResources(saved);
    } catch (error) {
      console.error(
        "Library loading error:",
        error
      );

      setResources(
        formatExternalResources()
      );

      setSavedResources([]);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     SAVED RESOURCE KEY
  ========================================== */

  const getResourceKey = (resource) => {
    if (!resource?.resourceId) {
      return null;
    }

    return `${resource.resourceType}:${resource.resourceId}`;
  };

  /* ==========================================
     SAVED KEYS
  ========================================== */

  const savedKeys = useMemo(() => {
    return new Set(
      savedResources
        .map((resource) =>
          getResourceKey(resource)
        )
        .filter(Boolean)
    );
  }, [savedResources]);

  /* ==========================================
     FILTERED RESOURCES
  ========================================== */

  const filteredResources = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return resources.filter((resource) => {
      const title =
        resource.title
          ?.toLowerCase() || "";

      const description =
        (
          resource.description ??
          resource.desc ??
          ""
        ).toLowerCase();

      const resourceCategory =
        resource.category ||
        "General";

      const matchesSearch =
        !normalizedSearch ||
        title.includes(
          normalizedSearch
        ) ||
        description.includes(
          normalizedSearch
        );

      const matchesCategory =
        category === "All" ||
        resourceCategory === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    resources,
    search,
    category,
  ]);

  /* ==========================================
     RECOMMENDED RESOURCES
  ========================================== */

  const recommendedResources =
    useMemo(() => {
      if (!savedResources.length) {
        return [];
      }

      const savedCategories = [
        ...new Set(
          savedResources
            .map(
              (resource) =>
                resource.category ||
                "General"
            )
            .filter(Boolean)
        ),
      ];

      return resources
        .filter((resource) => {
          const resourceCategory =
            resource.category ||
            "General";

          const key =
            getResourceKey(resource);

          return (
            savedCategories.includes(
              resourceCategory
            ) &&
            !savedKeys.has(key)
          );
        })
        .slice(0, 6);
    }, [
      resources,
      savedResources,
      savedKeys,
    ]);

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredResources.length /
        BOOKS_PER_PAGE
    )
  );

  const paginatedResources =
    filteredResources.slice(
      (page - 1) *
        BOOKS_PER_PAGE,
      page *
        BOOKS_PER_PAGE
    );

  /* ==========================================
     RESET INVALID PAGE
  ========================================== */

  useEffect(() => {
    if (
      page > totalPages &&
      totalPages > 0
    ) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);

  /* ==========================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================== */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    category,
  ]);

  /* ==========================================
     SAVE RESOURCE
  ========================================== */

  const handleSave = async (
    resource
  ) => {
    const key =
      getResourceKey(resource);

    if (!key) {
      setToast(
        "Unable to save this resource."
      );

      return;
    }

    /* ======================================
       ALREADY SAVED
    ====================================== */

    if (savedKeys.has(key)) {
      setToast(
        "This resource is already saved."
      );

      return;
    }

    /* ======================================
       RESOURCE TYPE
    ====================================== */

    const resourceType =
      resource.resourceType ||
      RESOURCE_TYPES.EXTERNAL;

    try {
      setSavingKey(key);

      /* ====================================
         PAYLOAD

         Only the resource reference and
         display snapshot are sent.

         No course modules/curriculum are
         copied here.
      ==================================== */

      const payload = {
        resourceId:
          String(
            resource.resourceId
          ),

        resourceType,

        title:
          resource.title || "Untitled Resource",

        description:
          resource.description ??
          resource.desc ??
          "",

        category:
          resource.category ||
          "General",

        image:
          resource.image ??
          resource.img ??
          resource.coverImage ??
          "",

        link:
          resource.link ??
          resource.url ??
          "",
      };

      const response =
        await saveResource(
          payload
        );

      const saved =
        response?.data?.resource ||
        response?.resource ||
        null;

      const savedItem = {
        ...(saved || payload),

        resourceId: String(
          saved?.resourceId ??
          payload.resourceId
        ),

        resourceType:
          saved?.resourceType ??
          payload.resourceType,
      };

      /* ====================================
         UPDATE LOCAL STATE
      ==================================== */

      setSavedResources(
        (previous) => {
          const alreadyExists =
            previous.some(
              (item) =>
                getResourceKey(item) ===
                getResourceKey(
                  savedItem
                )
            );

          if (alreadyExists) {
            return previous;
          }

          return [
            savedItem,
            ...previous,
          ];
        }
      );

      setToast(
        "Saved to your Library ✓"
      );

      /*
       * Kept only for compatibility with
       * older components/listeners.
       *
       * Backend remains the source of truth.
       */
      window.dispatchEvent(
        new Event("library-update")
      );
    } catch (error) {
      console.error(
        "Failed to save resource:",
        error
      );

      const status =
        error?.response?.status;

      const message =
        error?.response?.data?.message;

      if (status === 401) {
        setToast(
          "Please log in to save resources."
        );
      } else {
        setToast(
          message ||
            "Failed to save resource."
        );
      }
    } finally {
      setSavingKey(null);
    }
  };

  /* ==========================================
     UNSAVE RESOURCE
  ========================================== */

  const handleRemove = async (
    resource
  ) => {
    const key =
      getResourceKey(resource);

    if (!key) {
      return;
    }

    try {
      setSavingKey(key);

      await removeSavedResource(
        resource.resourceId,
        resource.resourceType
      );

      setSavedResources(
        (previous) =>
          previous.filter(
            (item) =>
              getResourceKey(item) !==
              key
          )
      );

      setToast(
        "Removed from your Library."
      );

      window.dispatchEvent(
        new Event("library-update")
      );
    } catch (error) {
      console.error(
        "Failed to remove saved resource:",
        error
      );

      const status =
        error?.response?.status;

      const message =
        error?.response?.data?.message;

      if (status === 401) {
        setToast(
          "Please log in to manage saved resources."
        );
      } else {
        setToast(
          message ||
            "Failed to remove resource."
        );
      }
    } finally {
      setSavingKey(null);
    }
  };

  /* ==========================================
     TOAST
  ========================================== */

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer =
      setTimeout(() => {
        setToast("");
      }, 3000);

    return () =>
      clearTimeout(timer);
  }, [toast]);

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <main>
      <LibraryHero />
      {toast && (
        <div className="fixed right-5 top-5 z-50 max-w-sm rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
      {recommendedResources.length >
        0 && (
        <RecommendedResources
          resources={
            recommendedResources
          }
          savedIds={
            Array.from(savedKeys)
          }
          savingId={savingKey}
          onSave={handleSave}
        />
      )}

      {/* ======================================
          SEARCH + FILTER
      ====================================== */}

      <section className="bg-slate-200 py-10">
        <div className="px-6">
          <h1 className="text-4xl font-bold">
            Digital Library
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Explore curated books,
            tutorials, courses, and
            resources designed for
            modern developers.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
              }}
              placeholder="Search resources..."
            />

            <CategoryFilter
              categories={categories}
              value={category}
              onChange={(value) => {
                setCategory(value);
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto bg-slate-200 px-6">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-600">
                Loading library...
              </p>
            </div>
          </div>
        ) : paginatedResources.length >
          0 ? (
          <>
            <ResourceGrid
              resources={
                paginatedResources
              }
              savedIds={
                Array.from(savedKeys)
              }
              savingId={savingKey}
              onSave={handleSave}
              onRemove={handleRemove}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />

            {/* ==================================
                PAGINATION
            ================================== */}

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4 pb-10">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage(
                      (currentPage) =>
                        Math.max(
                          currentPage - 1,
                          1
                        )
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="min-w-[100px] text-center text-sm text-gray-600">
                  Page {page} of{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() => {
                    setPage(
                      (currentPage) =>
                        Math.min(
                          currentPage + 1,
                          totalPages
                        )
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              No resources found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              We couldn't find any
              resources matching your
              search or selected
              category.
            </p>

            {(search ||
              category !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      <Newsletter />

      <CTA />
    </main>
  );
}