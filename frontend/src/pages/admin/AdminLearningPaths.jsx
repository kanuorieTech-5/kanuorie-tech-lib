
import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Save,
  Trash2,
  Edit,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  getAdminLearningPaths,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
} from "../../api/courseApi";

import { Card, Loader } from "../../components/common";

const blank = {
  title: "",
  description: "",
  category: "Frontend",
  difficulty: "Beginner",
  featuredImage: "",
  published: false,
  displayOrder: 0,
  learningObjectives: [],
  skillsAcquired: [],
  stages: [],
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

const normalizeLines = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const parseStages = (value) =>
  normalizeLines(value).map((line) => {
    const [number, title, description = ""] = line
      .split("|")
      .map((item) => item.trim());

    return {
      number: Number(number),
      title,
      description,
    };
  });

const serializeStages = (stages = []) =>
  stages
    .map(
      (stage) =>
        `${stage.number}|${stage.title}|${stage.description || ""}`
    )
    .join("\n");

export default function AdminLearningPaths() {
  const [paths, setPaths] = useState([]);

  const [form, setForm] = useState({ ...blank });

  const [objectivesText, setObjectivesText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [stagesText, setStagesText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FORM HELPERS
  // ==========================================

  const setField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({ ...blank });
    setObjectivesText("");
    setSkillsText("");
    setStagesText("");
    setEditingId(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    resetForm();
  };

  // ==========================================
  // LOAD LEARNING PATHWAYS
  // ==========================================

  const load = async () => {
    try {
      setError("");

      const response = await getAdminLearningPaths();

      // Supports both Axios responses and unwrapped API responses.
      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.learningPaths)
            ? response.data.learningPaths
            : Array.isArray(response?.learningPaths)
              ? response.learningPaths
              : Array.isArray(response)
                ? response
                : [];

      setPaths(data);
    } catch (err) {
      console.error("Unable to load learning pathways:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load learning pathways. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ==========================================
  // MODAL KEYBOARD AND SCROLL BEHAVIOUR
  // ==========================================

  useEffect(() => {
    if (!modalOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen, saving]);

  // ==========================================
  // EDIT LEARNING PATHWAY
  // ==========================================

  const edit = (path) => {
    setEditingId(path._id);

    setForm({
      title: path.title || "",
      description: path.description || "",
      category: path.category || "Frontend",
      difficulty: path.difficulty || "Beginner",
      featuredImage: path.featuredImage || "",
      published: Boolean(path.published),
      displayOrder: path.displayOrder ?? 0,
      learningObjectives: path.learningObjectives || [],
      skillsAcquired: path.skillsAcquired || [],
      stages: path.stages || [],
    });

    setObjectivesText(
      (path.learningObjectives || []).join("\n")
    );

    setSkillsText(
      (path.skillsAcquired || []).join("\n")
    );

    setStagesText(
      serializeStages(path.stages || [])
    );

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Please enter a learning pathway title.";
    }

    if (!form.description.trim()) {
      return "Please enter a pathway description.";
    }

    if (!form.category.trim()) {
      return "Please enter a pathway category.";
    }

    const stages = parseStages(stagesText);

    if (!stages.length) {
      return "Please add at least one learning stage.";
    }

    const invalidStage = stages.find(
      (stage) =>
        !Number.isInteger(stage.number) ||
        stage.number < 1 ||
        !stage.title
    );

    if (invalidStage) {
      return "Each stage must have a valid stage number and title.";
    }

    const stageNumbers = stages.map((stage) => stage.number);

    if (new Set(stageNumbers).size !== stageNumbers.length) {
      return "Each learning stage must have a unique number.";
    }

    return "";
  };

  // ==========================================
  // CREATE / UPDATE LEARNING PATHWAY
  // ==========================================

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      featuredImage: form.featuredImage.trim(),
      displayOrder: Number(form.displayOrder) || 0,
      learningObjectives: normalizeLines(objectivesText),
      skillsAcquired: normalizeLines(skillsText),
      stages: parseStages(stagesText),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateLearningPath(editingId, payload);

        setSuccess("Learning pathway updated successfully.");
      } else {
        await createLearningPath(payload);

        setSuccess("Learning pathway created successfully.");
      }

      setModalOpen(false);
      resetForm();

      await load();
    } catch (err) {
      console.error("Unable to save learning pathway:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to save learning pathway. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE LEARNING PATHWAY
  // ==========================================

  const remove = async (path) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${path.title}"? Courses assigned to this pathway may be detached.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      setDeletingId(path._id);

      await deleteLearningPath(path._id);

      if (editingId === path._id) {
        setModalOpen(false);
        resetForm();
      }

      setSuccess("Learning pathway deleted successfully.");

      await load();
    } catch (err) {
      console.error("Unable to delete learning pathway:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete this learning pathway."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return <Loader />;
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              <BookOpen size={24} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Learning Pathways
            </h1>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Organize your courses into structured learning journeys.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Learning Pathway
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {error && !modalOpen && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
          <CheckCircle size={19} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* PATHWAY STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <BookOpen size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Pathways
            </p>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {paths.length}
            </h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <Eye size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Published
            </p>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {paths.filter((path) => path.published).length}
            </h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <EyeOff size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drafts
            </p>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {paths.filter((path) => !path.published).length}
            </h3>
          </div>
        </Card>
      </div>

      {/* PATHWAY LIST */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All Learning Pathways
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage your published pathways and drafts.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            {paths.length}
          </span>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          {paths.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-5 py-16 text-center dark:border-slate-700">
              <BookOpen
                size={42}
                className="mx-auto mb-4 text-slate-400"
              />

              <h3 className="font-semibold text-slate-800 dark:text-white">
                No learning pathways yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Create your first learning pathway and organize your courses
                into a structured learning journey.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Create First Pathway
              </button>
            </div>
          ) : (
            paths.map((path) => (
              <div
                key={path._id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 sm:p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {path.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          path.published
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        }`}
                      >
                        {path.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {path.category || "Uncategorized"} ·{" "}
                      {path.difficulty || "Beginner"}
                    </p>

                    {path.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {path.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Layers size={14} />
                        {path.stages?.length || 0} stages
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <BookOpen size={14} />
                        {path.publishedCourseCount ?? path.count ?? 0} courses
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => edit(path)}
                      title="Edit pathway"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(path)}
                      disabled={deletingId === path._id}
                      title="Delete pathway"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-800"
                    >
                      {deletingId === path._id ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* ==========================================
          CREATE / EDIT MODAL
      ========================================== */}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="learning-path-modal-title"
            className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-h-[90vh]"
          >
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {editingId ? (
                    <Edit size={21} />
                  ) : (
                    <Plus size={21} />
                  )}
                </div>

                <div>
                  <h2
                    id="learning-path-modal-title"
                    className="text-lg font-bold text-slate-900 dark:text-white"
                  >
                    {editingId
                      ? "Edit Learning Pathway"
                      : "Add Learning Pathway"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Configure pathway details, objectives, skills, and stages.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* MODAL ERROR */}
            {error && (
              <div className="mx-5 mt-4 flex shrink-0 items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 sm:mx-7">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* MODAL FORM */}
            <form
              onSubmit={submit}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-6 p-5 sm:p-7">

                {/* BASIC DETAILS */}
                <section className="space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Basic Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Provide the main information about this learning pathway.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Pathway Title *
                    </label>

                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setField("title", e.target.value)
                      }
                      placeholder="e.g. Frontend Development"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Description *
                    </label>

                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        setField("description", e.target.value)
                      }
                      placeholder="Describe what learners will achieve..."
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Category *
                      </label>

                      <input
                        type="text"
                        value={form.category}
                        onChange={(e) =>
                          setField("category", e.target.value)
                        }
                        placeholder="Frontend"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Difficulty
                      </label>

                      <select
                        value={form.difficulty}
                        onChange={(e) =>
                          setField("difficulty", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Featured Image URL
                    </label>

                    <input
                      type="url"
                      value={form.featuredImage}
                      onChange={(e) =>
                        setField("featuredImage", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Display Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.displayOrder}
                      onChange={(e) =>
                        setField("displayOrder", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </section>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* LEARNING OBJECTIVES */}
                <section>
                  <h3 className="mb-3 font-bold text-slate-900 dark:text-white">
                    Learning Objectives
                  </h3>

                  <textarea
                    rows={5}
                    value={objectivesText}
                    onChange={(e) =>
                      setObjectivesText(e.target.value)
                    }
                    placeholder={
                      "Understand web development fundamentals.\nBuild responsive websites.\nDevelop modern frontend applications."
                    }
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Enter one objective per line.
                  </p>
                </section>

                {/* SKILLS */}
                <section>
                  <h3 className="mb-3 font-bold text-slate-900 dark:text-white">
                    Skills Acquired
                  </h3>

                  <textarea
                    rows={5}
                    value={skillsText}
                    onChange={(e) =>
                      setSkillsText(e.target.value)
                    }
                    placeholder={
                      "HTML5\nCSS3\nJavaScript\nReact.js"
                    }
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Enter one skill per line.
                  </p>
                </section>

                {/* LEARNING STAGES */}
                <section>
                  <h3 className="mb-3 font-bold text-slate-900 dark:text-white">
                    Learning Stages *
                  </h3>

                  <textarea
                    rows={8}
                    value={stagesText}
                    onChange={(e) =>
                      setStagesText(e.target.value)
                    }
                    placeholder={
                      "1|HTML and CSS Fundamentals|Learn HTML and CSS.\n2|JavaScript Fundamentals|Learn programming with JavaScript.\n3|Modern React Development|Build applications with React."
                    }
                    className={`${inputClass} font-mono text-xs leading-6`}
                    required
                  />

                  <div className="mt-3 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                    <p className="mb-1 font-semibold text-slate-800 dark:text-slate-200">
                      Stage format
                    </p>

                    <code>
                      stage number|stage title|stage description
                    </code>

                    <p className="mt-2">
                      Enter one stage per line. Each stage must have a
                      unique number.
                    </p>

                    <p className="mt-2 font-mono">
                      1|HTML and CSS Fundamentals|Learn how to build responsive websites.
                    </p>
                  </div>
                </section>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* PUBLISHING */}
                <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <input
                      id="published"
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) =>
                        setField("published", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <div>
                      <label
                        htmlFor="published"
                        className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white"
                      >
                        Publish this learning pathway
                      </label>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Published pathways can appear on the public Courses
                        page, subject to the public API visibility rules.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* MODAL FOOTER */}
              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Pathway"
                      : "Create Pathway"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
