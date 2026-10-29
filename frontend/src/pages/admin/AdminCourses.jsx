import { useEffect, useMemo, useState } from "react";
import { AdminCourseForm } from "../../components/forms";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  BookOpen,
  Star,
  Crown,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";

import {
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services";

/* ==========================================
   EMPTY LESSON
========================================== */

const emptyLesson = {
  title: "",
  description: "",
  lessonContent: "",
  videoUrl: "",
  duration: 0,
  order: 1,
  resources: [],
};

/* ==========================================
   EMPTY MODULE
========================================== */

const emptyAssessment = {
  type: "exercise",
  title: "",
  description: "",
  instructions: "",
  requirements: [],
  resources: [],
  submissionType: "url",
  required: true,
};

const emptyModule = {
  title: "",
  description: "",
  order: 1,
  lessons: [],
  assessment: null,
};

/* ==========================================
   EMPTY COURSE
========================================== */

const emptyCourse = {
  title: "",
  description: "",
  category: "General",
  image: "",
  link: "",
  instructor: "KanuorieTech",
  level: "Beginner",
  language: "English",
  duration: 0,
  featured: false,
  premium: false,
  price: 0,
  currency: "USD",
  published: true,
  tags: [],
  prerequisites: [],
  outcomes: [],
  modules: [],
};

/* ==========================================
   CATEGORIES
========================================== */

const categories = [
  "General",
  "Web Development",
  "Frontend",
  "Backend",
  "UI/UX",
  "Graphics Design",
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

/* ==========================================
   LEVELS
========================================== */

const levels = ["Beginner", "Intermediate", "Advanced"];

/* ==========================================
   ADMIN COURSES
========================================== */

export default function AdminCourses() {
  /* ========================================
     STATE
  ======================================== */

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [status, setStatus] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyCourse);

  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  /* ========================================
     LOAD COURSES
  ======================================== */

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCourses();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.courses)
            ? response.data.courses
            : [];

      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);

      setError(err?.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* ========================================
     FILTER COURSES
  ======================================== */

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.instructor?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesLevel = level === "All" || course.level === level;

      const matchesStatus =
        status === "All" ||
        (status === "Published" && course.published) ||
        (status === "Draft" && !course.published);

      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [courses, search, category, level, status]);

  /* ========================================
     COURSE HELPERS
  ======================================== */

  const getLessonCount = (course) => {
    if (!Array.isArray(course?.modules)) {
      return 0;
    }

    return course.modules.reduce((total, module) => {
      return (
        total + (Array.isArray(module?.lessons) ? module.lessons.length : 0)
      );
    }, 0);
  };

  /* ========================================
     FORM HELPERS
  ======================================== */

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateArrayField = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setForm((previous) => ({
      ...previous,
      [field]: items,
    }));
  };

  /* ========================================
     OPEN CREATE FORM
  ======================================== */

  const openCreateForm = () => {
    setEditingId(null);

    setForm({
      ...emptyCourse,
      modules: [],
    });

    setActiveModule(null);
    setActiveLesson(null);

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* ========================================
     OPEN EDIT FORM
  ======================================== */

  const openEditForm = (course) => {
    setEditingId(course._id);

    const normalizedModules = Array.isArray(course.modules)
      ? course.modules.map((module, moduleIndex) => ({
          ...emptyModule,
          ...module,

          order: moduleIndex + 1,

          assessment: module.assessment
            ? {
                ...emptyAssessment,
                ...module.assessment,

                requirements: Array.isArray(module.assessment.requirements)
                  ? module.assessment.requirements
                  : [],

                resources: Array.isArray(module.assessment.resources)
                  ? module.assessment.resources
                  : [],
              }
            : null,

          lessons: Array.isArray(module.lessons)
            ? module.lessons.map((lesson, lessonIndex) => ({
                ...emptyLesson,
                ...lesson,

                order: lessonIndex + 1,

                resources: Array.isArray(lesson.resources)
                  ? lesson.resources
                  : [],
              }))
            : [],
        }))
      : [];

    setForm({
      ...emptyCourse,
      ...course,

      tags: Array.isArray(course.tags) ? course.tags : [],

      prerequisites: Array.isArray(course.prerequisites)
        ? course.prerequisites
        : [],

      outcomes: Array.isArray(course.outcomes) ? course.outcomes : [],

      modules: normalizedModules,
    });

    setActiveModule(null);
    setActiveLesson(null);

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* ========================================
     CLOSE FORM
  ======================================== */

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyCourse);

    setActiveModule(null);
    setActiveLesson(null);
  };

  /* ========================================
     ADD MODULE
  ======================================== */

  const addModule = () => {
    setForm((previous) => {
      const nextIndex = previous.modules.length;

      return {
        ...previous,

        modules: [
          ...previous.modules,
          {
            ...emptyModule,
            order: nextIndex + 1,
          },
        ],
      };
    });

    setActiveModule(form.modules.length);
    setActiveLesson(null);
  };

  /* ========================================
     UPDATE MODULE
  ======================================== */

  const updateModule = (moduleIndex, field, value) => {
    setForm((previous) => {
      const modules = [...previous.modules];

      if (!modules[moduleIndex]) {
        return previous;
      }

      modules[moduleIndex] = {
        ...modules[moduleIndex],
        [field]: value,
      };

      return {
        ...previous,
        modules,
      };
    });
  };
  /* ==========================================
    ENABLE MODULE ASSESSMENT
  ========================================== */

  const enableModuleAssessment = (moduleIndex) => {
    setForm((previous) => {
      const modules = [...previous.modules];

      if (!modules[moduleIndex]) {
        return previous;
      }

      modules[moduleIndex] = {
        ...modules[moduleIndex],
        assessment: {
          ...emptyAssessment,
        },
      };

      return {
        ...previous,
        modules,
      };
    });
  };

  /* ==========================================
    REMOVE MODULE ASSESSMENT
  ========================================== */

  const removeModuleAssessment = (moduleIndex) => {
    const confirmed = window.confirm(
      "Remove this exercise/project from the module?",
    );

    if (!confirmed) return;

    setForm((previous) => {
      const modules = [...previous.modules];

      if (!modules[moduleIndex]) {
        return previous;
      }

      modules[moduleIndex] = {
        ...modules[moduleIndex],
        assessment: null,
      };

      return {
        ...previous,
        modules,
      };
    });
  };

  /* ==========================================
    UPDATE MODULE ASSESSMENT
  ========================================== */

  const updateModuleAssessment = (moduleIndex, field, value) => {
    setForm((previous) => {
      const modules = [...previous.modules];

      const module = modules[moduleIndex];

      if (!module) {
        return previous;
      }

      const assessment = {
        ...(module.assessment || emptyAssessment),
        [field]: value,
      };

      modules[moduleIndex] = {
        ...module,
        assessment,
      };

      return {
        ...previous,
        modules,
      };
    });
  };

  /* ========================================
     REMOVE MODULE
  ======================================== */

  const removeModule = (moduleIndex) => {
    const confirmed = window.confirm(
      "Delete this module and all lessons inside it?",
    );

    if (!confirmed) return;

    setForm((previous) => {
      const modules = previous.modules
        .filter((_, index) => index !== moduleIndex)
        .map((module, index) => ({
          ...module,
          order: index + 1,

          lessons: Array.isArray(module.lessons)
            ? module.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                order: lessonIndex + 1,
              }))
            : [],
        }));

      return {
        ...previous,
        modules,
      };
    });

    setActiveModule(null);
    setActiveLesson(null);
  };

  /* ========================================
     ADD MODULE LESSON
  ======================================== */

  const addModuleLesson = (moduleIndex) => {
    setForm((previous) => {
      const modules = [...previous.modules];

      const module = modules[moduleIndex];

      if (!module) {
        return previous;
      }

      const lessons = Array.isArray(module.lessons) ? [...module.lessons] : [];

      const newLesson = {
        ...emptyLesson,
        order: lessons.length + 1,
      };

      lessons.push(newLesson);

      modules[moduleIndex] = {
        ...module,
        lessons,
      };

      return {
        ...previous,
        modules,
      };
    });

    setActiveModule(moduleIndex);
    setActiveLesson(form.modules[moduleIndex]?.lessons?.length || 0);
  };

  /* ========================================
     UPDATE MODULE LESSON
  ======================================== */

  const updateModuleLesson = (moduleIndex, lessonIndex, field, value) => {
    setForm((previous) => {
      const modules = [...previous.modules];

      const module = modules[moduleIndex];

      if (!module) {
        return previous;
      }

      const lessons = Array.isArray(module.lessons) ? [...module.lessons] : [];

      if (!lessons[lessonIndex]) {
        return previous;
      }

      lessons[lessonIndex] = {
        ...lessons[lessonIndex],
        [field]: value,
      };

      modules[moduleIndex] = {
        ...module,
        lessons,
      };

      return {
        ...previous,
        modules,
      };
    });
  };

  /* ========================================
     REMOVE MODULE LESSON
  ======================================== */

  const removeModuleLesson = (moduleIndex, lessonIndex) => {
    const confirmed = window.confirm("Delete this lesson?");

    if (!confirmed) return;

    setForm((previous) => {
      const modules = [...previous.modules];

      const module = modules[moduleIndex];

      if (!module) {
        return previous;
      }

      const lessons = (module.lessons || [])
        .filter((_, index) => index !== lessonIndex)
        .map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        }));

      modules[moduleIndex] = {
        ...module,
        lessons,
      };

      return {
        ...previous,
        modules,
      };
    });

    setActiveLesson(null);
  };

  /* ========================================
     SUBMIT COURSE
  ======================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Course description is required.");
      return;
    }

    try {
      setSaving(true);

      /*
       * Normalize modules and nested lessons
       * so the payload matches the Mongoose schema.
       */

      const normalizedModules = Array.isArray(form.modules)
        ? form.modules.map((module, moduleIndex) => ({
            title: module.title?.trim() || "",
            description: module.description?.trim() || "",
            order: moduleIndex + 1,

            lessons: Array.isArray(module.lessons)
              ? module.lessons.map((lesson, lessonIndex) => ({
                  title: lesson.title?.trim() || "",
                  description: lesson.description?.trim() || "",
                  lessonContent: lesson.lessonContent || "",
                  videoUrl: lesson.videoUrl?.trim() || "",

                  duration: Number(lesson.duration) || 0,

                  order: lessonIndex + 1,

                  resources: Array.isArray(lesson.resources)
                    ? lesson.resources
                        .map((resource) => String(resource).trim())
                        .filter(Boolean)
                    : [],
                }))
              : [],

            assessment: module.assessment
              ? {
                  type:
                    module.assessment.type === "project"
                      ? "project"
                      : "exercise",

                  title: module.assessment.title?.trim() || "",

                  description: module.assessment.description?.trim() || "",

                  instructions: module.assessment.instructions?.trim() || "",

                  requirements: Array.isArray(module.assessment.requirements)
                    ? module.assessment.requirements
                        .map((item) => String(item).trim())
                        .filter(Boolean)
                    : [],

                  resources: Array.isArray(module.assessment.resources)
                    ? module.assessment.resources
                        .map((item) => String(item).trim())
                        .filter(Boolean)
                    : [],

                  submissionType: ["text", "url", "file", "none"].includes(
                    module.assessment.submissionType,
                  )
                    ? module.assessment.submissionType
                    : "url",

                  required: Boolean(module.assessment.required),
                }
              : null,
          }))
        : [];

      const payload = {
        title: form.title.trim(),

        description: form.description.trim(),

        category: form.category?.trim() || "General",

        image: form.image?.trim() || "",

        link: form.link?.trim() || "",

        instructor: form.instructor?.trim() || "KanuorieTech",

        level: form.level || "Beginner",

        language: form.language?.trim() || "English",

        duration: Number(form.duration) || 0,

        featured: Boolean(form.featured),

        premium: Boolean(form.premium),

        price: form.premium ? Math.max(Number(form.price) || 0, 0) : 0,

        currency: form.currency?.trim()?.toUpperCase() || "USD",

        published: Boolean(form.published),

        tags: Array.isArray(form.tags)
          ? form.tags.map((tag) => String(tag).trim()).filter(Boolean)
          : [],

        prerequisites: Array.isArray(form.prerequisites)
          ? form.prerequisites
              .map((item) => String(item).trim())
              .filter(Boolean)
          : [],

        outcomes: Array.isArray(form.outcomes)
          ? form.outcomes.map((item) => String(item).trim()).filter(Boolean)
          : [],

        modules: normalizedModules,
      };

      console.log("Course payload:", JSON.stringify(payload, null, 2));

      if (editingId) {
        await updateCourse(editingId, payload);

        setSuccess("Course updated successfully.");
      } else {
        await createCourse(payload);

        setSuccess("Course created successfully.");
      }

      await loadCourses();

      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyCourse);

        setActiveModule(null);
        setActiveLesson(null);

        setSuccess("");
      }, 700);
    } catch (err) {
      console.error("Course save error:", err);

      setError(err?.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  /* ========================================
     DELETE COURSE
  ======================================== */

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Delete "${course.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteCourse(course._id);

      setCourses((previous) =>
        previous.filter((item) => item._id !== course._id),
      );

      setSuccess("Course deleted successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete course error:", err);

      setError(err?.response?.data?.message || "Failed to delete course.");
    }
  };

  /* ========================================
     STATS
  ======================================== */

  const publishedCount = courses.filter((course) => course.published).length;

  const featuredCount = courses.filter((course) => course.featured).length;

  const premiumCount = courses.filter((course) => course.premium).length;

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <BookOpen size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Courses
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage courses, modules, lessons, publishing and learning
                content.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Add Course
        </button>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Courses" value={courses.length} />

        <Stat label="Published" value={publishedCount} />

        <Stat label="Featured" value={featuredCount} />

        <Stat label="Premium" value={premiumCount} />
      </div>

      {/* FILTERS */}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          >
            <option value="All">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          >
            <option value="All">All Levels</option>

            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 outline-none focus:border-blue-500 text-slate-900 dark:text-slate-100"
          >
            <option value="All">All Status</option>

            <option value="Published">Published</option>

            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* COURSE TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-600" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <BookOpen size={45} className="mx-auto text-slate-300" />

            <h3 className="mt-5 text-lg font-bold text-slate-800 dark:text-slate-200">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Create your first course or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Course</th>

                  <th className="px-6 py-4">Category</th>

                  <th className="px-6 py-4">Level</th>

                  <th className="px-6 py-4">Lessons</th>

                  <th className="px-6 py-4">Enrollments</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => (
                  <tr key={course._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.image || "/images/course-placeholder.png"}
                          alt={course.title}
                          className="h-14 w-20 rounded-lg object-cover"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/images/course-placeholder.png";
                          }}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">
                              {course.title}
                            </h3>

                            {course.featured && (
                              <Star
                                size={15}
                                className="fill-amber-400 text-amber-400"
                              />
                            )}

                            {course.premium && (
                              <Crown size={15} className="text-purple-500" />
                            )}
                          </div>

                          <p className="mt-1 max-w-xs truncate text-sm text-slate-500 dark:text-slate-400">
                            {course.instructor}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                      {course.category || "General"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {course.level || "Beginner"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {getLessonCount(course)}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {Number(course.enrollments || 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          course.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {course.published ? (
                          <Eye size={13} />
                        ) : (
                          <EyeOff size={13} />
                        )}

                        {course.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(course)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit course"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(course)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Delete course"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-5xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">
            {/* FORM HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {editingId ? "Edit Course" : "Create Course"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add and manage your course content.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <AdminCourseForm
              {...{
                BookOpen,
                ChevronDown,
                ChevronUp,
                Field,
                FormSection,
                GripVertical,
                Plus,
                Save,
                SelectField,
                TextAreaField,
                Toggle,
                Trash2,
                activeModule,
                addModule,
                addModuleLesson,
                categories,
                closeForm,
                editingId,
                enableModuleAssessment,
                form,
                handleSubmit,
                levels,
                removeModule,
                removeModuleAssessment,
                removeModuleLesson,
                saving,
                setActiveModule,
                updateArrayField,
                updateField,
                updateModule,
                updateModuleAssessment,
                updateModuleLesson,
              }}
              onSubmit={handleSubmit}
              className="space-y-8 p-6"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   STAT
========================================== */

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

/* ==========================================
   FORM SECTION
========================================== */

function FormSection({ title, description, children }) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 p-5">
        {children}
      </div>
    </section>
  );
}

/* ==========================================
   FIELD
========================================== */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        required={required}
        min={type === "number" ? 0 : undefined}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

/* ==========================================
   TEXT AREA
========================================== */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <textarea
        required={required}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

/* ==========================================
   SELECT
========================================== */

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ==========================================
   TOGGLE
========================================== */

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
        checked ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <span>
        <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
          {label}
        </span>

        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          {checked ? "Enabled" : "Disabled"}
        </span>
      </span>

      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
