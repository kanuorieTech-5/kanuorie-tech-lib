import { useEffect, useState, useMemo} from "react";

import API from "../api/axiosApi";

import { Loader,} from "../components/common";

import {
  SearchBar,
} from "../components/layout";

import { LibraryHero, ResourceGrid, CategoryFilter, TrendingResources, RecommendedResources,} from "../components/library";

import {
  Newsletter,
  CTA,
} from "../components/home";

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

    await fetchResources();

    await fetchSavedCourses();

  };



  const fetchResources = async () => {

    try {

      setLoading(true);


      const { data } =
        await API.get("/books");


      const combined = [
        ...defaultResources,
        ...data,
      ];


      const formatted =
        combined.map(
          (item, index) => ({
            ...item,

            resourceId:
              item._id ||
              item.id ||
              `${item.title}-${index}`,
          })
        );


      const unique =
        Array.from(
          new Map(
            formatted.map(
              (item) => [
                item.resourceId,
                item,
              ]
            )
          ).values()
        );


      setResources(unique);


    } catch (error) {

      console.error(
        "Library error:",
        error
      );


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


    } finally {

      setLoading(false);

    }

  };



  const fetchSavedCourses = async () => {

    try {

      const { data } =
        await API.get("/courses");


      setSavedIds(
        data.map(
          (item) =>
            item.resourceId ||
            item._id
        )
      );


    } catch (error) {

      console.error(error);

    }

  };
/* ================= FILTERED RESOURCES ================= */

const filteredResources = useMemo(() => {
  return resources.filter((resource) => {
    const matchesSearch = (resource.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      (resource.category || "General") === category;

    return matchesSearch && matchesCategory;
  });
}, [resources, search, category]);

/* ================= SAVED RESOURCES ================= */

const savedResources = useMemo(() => {
  return resources.filter((resource) =>
    savedIds.includes(resource.resourceId)
  );
}, [resources, savedIds]);

/* ================= RECOMMENDED RESOURCES ================= */

const recommendedResources = useMemo(() => {
  if (!savedResources.length) return [];

  const categories = [
    ...new Set(savedResources.map((resource) => resource.category)),
  ];

  return resources.filter(
    (resource) =>
      categories.includes(resource.category) &&
      !savedIds.includes(resource.resourceId)
  );
}, [resources, savedResources, savedIds]);

/* ================= PAGINATION ================= */

const totalPages = Math.ceil(
  filteredResources.length / BOOKS_PER_PAGE
);

const paginatedResources = filteredResources.slice(
  (page - 1) * BOOKS_PER_PAGE,
  page * BOOKS_PER_PAGE
);

  const handleSave = async (resource) => {

    try {

      setSavingId(
        resource.resourceId
      );


      const payload = {

        resourceId:
          resource.resourceId,

        title:
          resource.title,

        category:
          resource.category ||
          "General",

        image:
          resource.image ||
          resource.img ||
          resource.coverImage,

        link:
          resource.link,

        progress: 0,

        notes: "",

      };


      const { data } =
        await API.post(
          "/courses",
          payload
        );


      setSavedIds(
        (previous) => [
          ...previous,
          data.resourceId ||
          resource.resourceId,
        ]
      );


      setToast(
        "Added to Courses 🎓"
      );


      window.dispatchEvent(
        new Event(
          "course-update"
        )
      );


      setTimeout(() => {
        setToast("");
      }, 3000);



    } catch (error) {

      console.error(error);

      setToast(
        "Failed to save resource"
      );

    } finally {

      setSavingId(null);

    }

  };



  if (loading) {
    return <Loader />;
  }



  return (

    <main>
      <LibraryHero />

      {toast && (
        <div className="
          fixed
          right-5
          top-5
          z-50
          rounded-lg
          bg-black
          px-5
          py-3
          text-white
        ">
          {toast}
        </div>
      )}

      <TrendingResources
        resources={resources.slice(0, 6)}
        savedIds={savedIds}
        savingId={savingId}
        onSave={handleSave}
      />

      <RecommendedResources
        resources={recommendedResources}
        savedIds={savedIds}
        savingId={savingId}
        onSave={handleSave}
      />

      <section className="
        bg-slate-50
        py-20
      ">

        <div className="
          mx-auto
          max-w-7xl
          px-6
        ">

          <h1 className="
            text-4xl
            font-bold
          ">
            Digital Library
          </h1>


          <p className="
            mt-4
            max-w-2xl
            text-gray-600
          ">
            Explore curated books,
            tutorials and resources
            designed for modern developers.
          </p>


          <div className="
            mt-8
            flex
            flex-col
            gap-4
            md:flex-row
          ">

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

      <section className="
        mx-auto
        max-w-7xl
        px-6
        py-16
      ">

        <ResourceGrid

          resources={
            paginatedResources
          }

          savedIds={
            savedIds
          }

          savingId={
            savingId
          }

          onSave={
            handleSave
          }

          page={
            page
          }

          setPage={
            setPage
          }

          totalPages={
            totalPages
          }

        />

      </section>

      <Newsletter />

      <CTA />


    </main>

  );

}