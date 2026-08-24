import { useEffect, useMemo, useState } from "react";

import {
  Loader,
} from "../components/common";

import {
  SearchBar,
} from "../components/layout";

import {
  LibraryHero,
  ResourceGrid,
  CategoryFilter,
  RecommendedResources,
} from "../components/library";

import {
  Newsletter,
  CTA,
} from "../components/home";

import {
  getBooks,
  getCourses,
  saveCourse,
} from "../services";

import defaultResources from "../data/resources";

const BOOKS_PER_PAGE = 12;

export default function Library() {
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
    "Other",
  ];

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [savedIds, setSavedIds] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
  try {
    setLoading(true);

    await Promise.all([
      fetchResources(),
      fetchSavedCourses(),
    ]);
  } finally {
    setLoading(false);
  }
};

  const fetchResources = async () => {
    try {
      const response = await getBooks();

      /*
        Our API may return:
        - an array directly
        - { data: [...] }
        - { data: { books: [...] } }
      */

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.books)
        ? response.data.books
        : [];

      const combined = [
        ...defaultResources,
        ...data,
      ];

      const formatted = combined.map(
        (item, index) => ({
          ...item,

          resourceId:
            item._id ||
            item.id ||
            `${item.title}-${index}`,
        })
      );

      const unique = Array.from(
        new Map(
          formatted.map((item) => [
            item.resourceId,
            item,
          ])
        ).values()
      );

      setResources(unique);
    } catch (error) {
      console.error(
        "Library resources error:",
        error
      );

      /*
        If the API fails, keep the
        local resources available.
      */

      setResources(
        defaultResources.map(
          (item, index) => ({
            ...item,

            resourceId:
              item.id ||
              `${item.title}-${index}`,
          })
        )
      );
    }
  };

const fetchSavedCourses = async () => {
  try {
    const response = await getCourses();

    /*
      API may return:
      - [...]
      - { data: [...] }
      - { data: { courses: [...] } }
    */

    const data = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.courses)
          ? response.data.courses
          : [];

    const ids = data
      .map(
        (course) =>
          course.resourceId ||
          course._id ||
          course.id
      )
      .filter(Boolean);

    setSavedIds(ids);
  } catch (error) {
    console.error(
      "Failed to fetch saved courses:",
      error
    );

    setSavedIds([]);
  }
};

const filteredResources = useMemo(() => {
  const normalizedSearch = search
    .trim()
    .toLowerCase();

  return resources.filter((resource) => {
    const title =
      resource.title?.toLowerCase() || "";

    const description =
      resource.description?.toLowerCase() || "";

    const resourceCategory =
      resource.category || "General";

    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      description.includes(normalizedSearch);

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

const savedResources = useMemo(() => {
  return resources.filter((resource) =>
    savedIds.includes(resource.resourceId)
  );
}, [
  resources,
  savedIds,
]);

const recommendedResources = useMemo(() => {
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

  return resources.filter((resource) => {
    const resourceCategory =
      resource.category || "General";

    return (
      savedCategories.includes(
        resourceCategory
      ) &&
      !savedIds.includes(
        resource.resourceId
      )
    );
  });
}, [
  resources,
  savedResources,
  savedIds,
]);

const totalPages = Math.ceil(
  filteredResources.length /
    BOOKS_PER_PAGE
);

const paginatedResources =
  filteredResources.slice(
    (page - 1) * BOOKS_PER_PAGE,
    page * BOOKS_PER_PAGE
  );
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

const handleSave = async (resource) => {
  if (!resource?.resourceId) {
    setToast("Unable to save this resource.");
    return;
  }

  // Prevent duplicate saves
  if (savedIds.includes(resource.resourceId)) {
    setToast("This resource is already saved.");
    return;
  }

  try {
    setSavingId(resource.resourceId);

    const payload = {
      resourceId: resource.resourceId,
      title: resource.title,
      category: resource.category || "General",

      image:
        resource.image ||
        resource.img ||
        resource.coverImage ||
        "",

      link: resource.link || resource.url || "",

      progress: 0,
      notes: "",
    };

    const response = await saveCourse(payload);

    /*
      API may return:
      - saved course directly
      - { data: savedCourse }
      - { data: { course: savedCourse } }
    */

    const savedCourse =
      response?.data?.course ||
      response?.data ||
      response;

    const savedResourceId =
      savedCourse?.resourceId ||
      resource.resourceId;

    setSavedIds((previous) => {
      if (previous.includes(savedResourceId)) {
        return previous;
      }

      return [
        ...previous,
        savedResourceId,
      ];
    });

    setToast("Added to Courses 🎓");

    window.dispatchEvent(
      new Event("course-update")
    );
  } catch (error) {
    console.error(
      "Failed to save resource:",
      error
    );

    const message =
      error?.response?.data?.message ||
      "Failed to save resource.";

    setToast(message);
  } finally {
    setSavingId(null);
  }
};
useEffect(() => {
  if (!toast) return;

  const timer = setTimeout(() => {
    setToast("");
  }, 3000);

  return () => clearTimeout(timer);
}, [toast]);
const hasResources =
  paginatedResources.length > 0;

  return (
  <main>
    <LibraryHero />
    {toast && (
      <div className="fixed right-5 top-5 z-50 max-w-sm rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl"
      >
        {toast}
      </div>
    )}

    {recommendedResources.length > 0 && (
      <RecommendedResources
        resources={recommendedResources}
        savedIds={savedIds}
        savingId={savingId}
        onSave={handleSave}
      />
    )}

    <section className="bg-slate-200 py-10">
      <div className="px-6">

        <h1 className="text-4xl font-bold">
          Digital Library
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Explore curated books, tutorials,
          and resources designed for modern
          developers.
        </p>

        <div
          className="mt-8 flex flex-col gap-4 md:flex-row"
        >
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search resources..."
          />

          <CategoryFilter
            categories={categories}
            value={category}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          />
        </div>
      </div>
    </section>
    <section className="mx-auto px-6 bg-slate-200">
      {hasResources ? (
        <>
          <ResourceGrid
            resources={paginatedResources}
            savedIds={savedIds}
            savingId={savingId}
            onSave={handleSave}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
          {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage((currentPage) =>
                  Math.max(currentPage - 1, 1)
                );

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="min-w-[100px] text-center text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((currentPage) =>
                  Math.min(currentPage + 1, totalPages)
                );

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
            We couldn't find any resources
            matching your search or selected
            category.
          </p>

          {(search || category !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setPage(1);
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
