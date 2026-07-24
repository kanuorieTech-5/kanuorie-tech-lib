import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import defaultResources from "../data/resources";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Footer from "../components/footer";

export default function Library() {
  const categories = [
    "All","General","Frontend","Backend","DevOps",
    "Data Science","Design","Security","Tools",
    "Architecture","Testing","AI/ML","Other",
  ];

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    const init = async () => {
      await fetchResources();
      await fetchCourses();
    };
    init();
  }, []);

  /* ================= FETCH RESOURCES ================= */
  const fetchResources = async () => {
    try {
      setLoading(true);

  const res = await API.get("/books");

  const combined = [...defaultResources, ...res.data];

  const normalized = combined.map((r, index) => ({
    ...r,
    resourceId: r._id || r.id || `${r.title}-${index}`,
  }));

  const unique = Array.from(
    new Map(
      normalized.map((r) => [r.resourceId, r])
      ).values()
    );

      setResources(unique);
    } catch (err) {
      console.error("Failed to fetch resources:", err);

  const fallback = defaultResources.map((r, index) => ({
      ...r,
      resourceId:
        r.resourceId || r._id || r.id || `${r.title}-${index}`,
    }));

    setResources(fallback);

    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH SAVED COURSES ================= */
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses"); // ✅ correct

  const ids = res.data.map( (c) => c.resourceId || c._id);

    setSavedIds(ids);

      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

  /* ================= FILTER ================= */
  const filtered = resources.filter((resource) => {
    return (
      (resource.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (category === "All" ||
        (resource.category || "General") === category)
    );
  });

  /* ================= TRENDING ================= */
  const trending = resources.slice(0, 6);

  /* ================= SAVED RESOURCES ================= */
  const savedResources = resources.filter((resource) =>
    savedIds.includes(resource.resourceId)
  );

  /* ================= RECOMMENDED ================= */
  const savedCategories = savedResources.map(
    (resource) => resource.category
  );

  const recommended = resources.filter(
    (resource) =>
      savedCategories.includes(resource.category) &&
      !savedIds.includes(resource.resourceId)
  );

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  /* ================= SAVE COURSE ================= */
    const handleSave = async (resource) => {
      try {
        setSavingId(resource._id || resource.id);

    const payload = {
      resourceId: resource.resourceId,
      title: resource.title,
      category: resource.category || "General",
      image: resource.img || resource.image,
      link: resource.link,
      progress: 0,
      notes: "",
    };

    const { data } = await API.post("/courses", payload);

    setSavedIds((prev) => [
      ...new Set([
        ...prev,
        data.resourceId || resource.resourceId,
      ])
    ]);

    window.dispatchEvent(new Event("course-update"));

    showToast("Added to Courses 🎓");

    } 
    catch (err) {
      console.error(err.response?.data || err.message);
      showToast(
      err.response?.data?.message || "Failed to save course",
      "error"
      );
    } 
    finally {
      setSavingId(null);
    }
  };

  /* ================= CARD ================= */
  const ResourceCard = ({ resource }) => {
  const isSaved = savedIds.includes(resource.resourceId);

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="aspect-[16/9] bg-gray-100">
          <img
            src={resource.img || resource.image}
            alt={resource.title}
            className="object-cover w-full h-full"
            onError={(e) => (e.target.src = "/default-course.png")}
          />
        </div>

        <div className="p-2">
          <h3 className="text-sm font-semibold">{resource.title}</h3>

          <span className="text-xs text-gray-400">
            {resource.category}
          </span>

          <div className="flex gap-15 mt-2 p-">
            <button
              onClick={() => handleSave(resource)}
              disabled={isSaved || savingId === resource.id}
              className={`px-4 py-2 rounded ${
                isSaved
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {isSaved
                ? "Saved ✓"
                : savingId === resource.id
                ? "Saving..."
                : "Save"}
            </button>

            {resource.link && (
              <a
                href={resource.link}
                target=""
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-4 rounded text-xs"
              >
                Read
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // if (loading) {
  //   return (
  //     <div className="text-center py-20 text-gray-500">
  //       Loading resources...
  //     </div>
  //   );
  // }

  return (
    <main className="bg-blue-50">
      <div className="min-h-screen pb-20">
        <Navbar />
        {/* HERO */}
          <section>
            <div
              className="relative h-64 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60")',
              }}
            >
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-10">
                <h1 className="text-4xl font-bold text-white text-center">
                  Curated knowledge for the <br />
                  <span className="text-blue-500">modern developer.</span>
                </h1>
              </div>
            </div>
            <div className="p-5">
            <p className="text-lg text-gray-600 mt-6">
              Unlock your tech potential with structured learning resources at your fingertips. Whether you're a beginner or a seasoned professional pushing toward mastery, explore powerful, 
              handpicked resources designed to accelerate your growth. Learn smarter, build faster, and become the developer you’ve always aimed to be starting today.
            </p>

            <Link
              to="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-full mt-6 inline-block"
            >
              Continue Learning →
            </Link>
          </div>
          </section>

        {/* TOAST */}
        {toast.message && (
          <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded">
            {toast.message}
          </div>
        )}

        {/* TRENDING */}
        <h2 className="text-xl font-bold px-6 mt-6">🔥 Trending</h2>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4">
          {trending.map((r) => (
            <div key={r.id} className="min-w-[200px]">
              <ResourceCard resource={r} />
            </div>
          ))}
        </div>

        {/* RECOMMENDED */}
        {recommended.length > 0 && (
          <>
            <h2 className="text-xl font-bold px-6 mt-6">🎯 Recommended</h2>
            <div className="flex gap-4 overflow-x-auto px-6 pb-4">
              {recommended.map((r) => (
                <div key={r.id} className="min-w-[200px]">
                  <ResourceCard resource={r} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* SEARCH */}
        <div className="flex gap-4 px-6 mt-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-3 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 mt-6">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No resources found.
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}