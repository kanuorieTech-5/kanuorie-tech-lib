import { useEffect, useMemo, useState } from "react";
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
  videoUrl: "",
  duration: 0,
  order: 1,
  resources: [],
};

/* ==========================================
   EMPTY MODULE
========================================== */

const emptyModule = {
  title: "",
  description: "",
  order: 1,
  lessons: [],
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
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Courses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>

            <option value="Published">Published</option>

            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* COURSE TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <BookOpen size={45} className="mx-auto text-slate-300" />

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first course or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
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
                            <h3 className="font-bold text-slate-900">
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

                          <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                            {course.instructor}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {course.category || "General"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {course.level || "Beginner"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {getLessonCount(course)}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
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
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit course"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(course)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
          <div className="mx-auto my-6 max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* FORM HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingId ? "Edit Course" : "Create Course"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add and manage your course content.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 p-6">
              {/* BASIC INFORMATION */}

              <FormSection
                title="Basic Information"
                description="Core information displayed to learners."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Course Title"
                    required
                    value={form.title}
                    onChange={(value) => updateField("title", value)}
                    placeholder="e.g. Modern React Development"
                  />

                  <Field
                    label="Instructor"
                    value={form.instructor}
                    onChange={(value) => updateField("instructor", value)}
                    placeholder="KanuorieTech"
                  />

                  <SelectField
                    label="Category"
                    value={form.category}
                    onChange={(value) => updateField("category", value)}
                    options={categories}
                  />

                  <SelectField
                    label="Level"
                    value={form.level}
                    onChange={(value) => updateField("level", value)}
                    options={levels}
                  />

                  <Field
                    label="Language"
                    value={form.language}
                    onChange={(value) => updateField("language", value)}
                    placeholder="English"
                  />

                  <Field
                    label="Duration (hours)"
                    type="number"
                    value={form.duration}
                    onChange={(value) => updateField("duration", value)}
                    placeholder="20"
                  />

                  <Field
                    label="Course Image URL"
                    type="url"
                    value={form.image}
                    onChange={(value) => updateField("image", value)}
                    placeholder="https://..."
                  />

                  <Field
                    label="Course Link"
                    type="url"
                    value={form.link}
                    onChange={(value) => updateField("link", value)}
                    placeholder="https://..."
                  />
                </div>

                <TextAreaField
                  label="Description"
                  required
                  value={form.description}
                  onChange={(value) => updateField("description", value)}
                  placeholder="Describe what learners will gain from this course..."
                  rows={5}
                />
              </FormSection>

              {/* SETTINGS */}

              <FormSection
                title="Publishing & Settings"
                description="Control how this course appears on the platform."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <Toggle
                    label="Published"
                    checked={form.published}
                    onChange={(value) => updateField("published", value)}
                  />

                  <Toggle
                    label="Featured"
                    checked={form.featured}
                    onChange={(value) => updateField("featured", value)}
                  />

                  <Toggle
                    label="Premium"
                    checked={form.premium}
                    onChange={(value) => updateField("premium", value)}
                  />
                </div>
              </FormSection>

              {/* METADATA */}

              <FormSection
                title="Course Metadata"
                description="Use comma-separated values."
              >
                <Field
                  label="Tags"
                  value={form.tags.join(", ")}
                  onChange={(value) => updateArrayField("tags", value)}
                  placeholder="React, JavaScript, Frontend"
                />

                <Field
                  label="Prerequisites"
                  value={form.prerequisites.join(", ")}
                  onChange={(value) => updateArrayField("prerequisites", value)}
                  placeholder="HTML, CSS, JavaScript"
                />

                <Field
                  label="Learning Outcomes"
                  value={form.outcomes.join(", ")}
                  onChange={(value) => updateArrayField("outcomes", value)}
                  placeholder="Build React apps, Manage state, Work with APIs"
                />
              </FormSection>

              {/* CURRICULUM */}

              <FormSection
                title="Course Curriculum"
                description="Organize your course into modules and lessons."
              >
                <div className="space-y-5">
                  {form.modules.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                      <BookOpen size={35} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-500">
                        No modules added yet.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Create a module and then add lessons to it.
                      </p>
                    </div>
                  ) : (
                    form.modules.map((module, moduleIndex) => {
                      const moduleOpen = activeModule === moduleIndex;

                      return (
                        <div
                          key={moduleIndex}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                          {/* MODULE HEADER */}

                          <div className="flex items-center gap-3 bg-slate-50 px-4 py-4">
                            <GripVertical
                              size={18}
                              className="text-slate-400"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setActiveModule(moduleOpen ? null : moduleIndex)
                              }
                              className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                  Module {moduleIndex + 1}
                                </p>

                                <p className="truncate font-bold text-slate-800">
                                  {module.title || "Untitled module"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {module.lessons?.length || 0} lesson
                                  {module.lessons?.length === 1 ? "" : "s"}
                                </p>
                              </div>

                              {moduleOpen ? (
                                <ChevronUp size={19} />
                              ) : (
                                <ChevronDown size={19} />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeModule(moduleIndex)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete module"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          {/* MODULE CONTENT */}

                          {moduleOpen && (
                            <div className="space-y-5 p-5">
                              <Field
                                label="Module Title"
                                required
                                value={module.title}
                                onChange={(value) =>
                                  updateModule(moduleIndex, "title", value)
                                }
                                placeholder="e.g. React Fundamentals"
                              />

                              <TextAreaField
                                label="Module Description"
                                value={module.description}
                                onChange={(value) =>
                                  updateModule(
                                    moduleIndex,
                                    "description",
                                    value,
                                  )
                                }
                                placeholder="Describe what learners will cover in this module..."
                                rows={3}
                              />

                              {/* MODULE LESSONS */}

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-bold text-slate-800">
                                      Module Lessons
                                    </h4>

                                    <p className="text-xs text-slate-500">
                                      Add lessons belonging to this module.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => addModuleLesson(moduleIndex)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                  >
                                    <Plus size={16} />
                                    Add Lesson
                                  </button>
                                </div>

                                {module.lessons?.length === 0 ? (
                                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
                                    <p className="text-sm text-slate-500">
                                      No lessons in this module yet.
                                    </p>
                                  </div>
                                ) : (
                                  module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lessonIndex}
                                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                      <div className="mb-4 flex items-center justify-between">
                                        <div>
                                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            Lesson {lessonIndex + 1}
                                          </p>

                                          <p className="font-semibold text-slate-800">
                                            {lesson.title || "Untitled lesson"}
                                          </p>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeModuleLesson(
                                              moduleIndex,
                                              lessonIndex,
                                            )
                                          }
                                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                          title="Delete lesson"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>

                                      <div className="grid gap-4 md:grid-cols-2">
                                        <Field
                                          label="Lesson Title"
                                          required
                                          value={lesson.title}
                                          onChange={(value) =>
                                            updateModuleLesson(
                                              moduleIndex,
                                              lessonIndex,
                                              "title",
                                              value,
                                            )
                                          }
                                          placeholder="Introduction to React"
                                        />

                                        <Field
                                          label="Video URL"
                                          type="url"
                                          value={lesson.videoUrl}
                                          onChange={(value) =>
                                            updateModuleLesson(
                                              moduleIndex,
                                              lessonIndex,
                                              "videoUrl",
                                              value,
                                            )
                                          }
                                          placeholder="https://..."
                                        />

                                        <Field
                                          label="Duration (minutes)"
                                          type="number"
                                          value={lesson.duration}
                                          onChange={(value) =>
                                            updateModuleLesson(
                                              moduleIndex,
                                              lessonIndex,
                                              "duration",
                                              value,
                                            )
                                          }
                                          placeholder="20"
                                        />

                                        <Field
                                          label="Resources"
                                          value={
                                            Array.isArray(lesson.resources)
                                              ? lesson.resources.join(", ")
                                              : ""
                                          }
                                          onChange={(value) =>
                                            updateModuleLesson(
                                              moduleIndex,
                                              lessonIndex,
                                              "resources",
                                              value
                                                .split(",")
                                                .map((item) => item.trim())
                                                .filter(Boolean),
                                            )
                                          }
                                          placeholder="https://resource.com, https://..."
                                        />

                                        <div className="md:col-span-2">
                                          <TextAreaField
                                            label="Lesson Description"
                                            value={lesson.description}
                                            onChange={(value) =>
                                              updateModuleLesson(
                                                moduleIndex,
                                                lessonIndex,
                                                "description",
                                                value,
                                              )
                                            }
                                            placeholder="Explain what this lesson covers..."
                                            rows={3}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {/* ADD MODULE */}

                  <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    <Plus size={18} />
                    Add Module
                  </button>
                </div>
              </FormSection>

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Course"
                      : "Create Course"}
                </button>
              </div>
            </form>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-black text-slate-900">
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
        <h3 className="text-lg font-black text-slate-900">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
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
      <span className="mb-2 block text-sm font-semibold text-slate-700">
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <textarea
        required={required}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        <span className="block text-sm font-bold text-slate-800">{label}</span>

        <span className="mt-1 block text-xs text-slate-500">
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
