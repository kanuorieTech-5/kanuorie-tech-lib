
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
} from "lucide-react";

import {
  getAdminLearningPaths,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
} from "../../api/courseApi";

import { Button, Card, Loader } from "../../components/common";

const blank = {
  title: "",
  description: "",
  category: "Software Development",
  difficulty: "Beginner",
  featuredImage: "",
  published: false,
  displayOrder: 0,
  objectives: [],
  skills: [],
  stages: [],
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

const normalizeLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const parseStages = (value) => {
  const lines = normalizeLines(value);

  return lines.map((line) => {
    const [number, title, description = ""] = line
      .split("|")
      .map((item) => item.trim());

    return {
      number: Number(number),
      title,
      description,
    };
  });
};

const serializeStages = (stages = []) =>
  stages
    .map(
      (stage) =>
        `${stage.number}|${stage.title}|${stage.description || ""}`
    )
    .join("\n");

export default function AdminLearningPaths() {
  const [paths, setPaths] = useState([]);
  const [form, setForm] = useState(blank);

  const [objectivesText, setObjectivesText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [stagesText, setStagesText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const load = async () => {
    try {
      setError("");

      const response = await getAdminLearningPaths();

      // Supports either an Axios response or an already-unwrapped response.
      const data =
        response?.data?.data ??
        response?.data ??
        response?.data?.learningPaths ??
        response?.learningPaths ??
        response;

      setPaths(Array.isArray(data) ? data : []);
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

  const reset = () => {
    setForm({ ...blank });
    setObjectivesText("");
    setSkillsText("");
    setStagesText("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const edit = (path) => {
    setEditingId(path._id);

    setForm({
      title: path.title || "",
      description: path.description || "",
      category: path.category || "Software Development",
      difficulty: path.difficulty || "Beginner",
      featuredImage: path.featuredImage || "",
      published: Boolean(path.published),
      displayOrder: path.displayOrder ?? 0,
      objectives: path.objectives || [],
      skills: path.skills || [],
      stages: path.stages || [],
    });

    setObjectivesText((path.objectives || []).join("\n"));
    setSkillsText((path.skills || []).join("\n"));
    setStagesText(serializeStages(path.stages || []));

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Please enter a learning pathway title.";
    }

    if (!form.description.trim()) {
      return "Please enter a pathway description.";
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
      difficulty: form.difficulty,
      featuredImage: form.featuredImage.trim(),
      displayOrder: Number(form.displayOrder) || 0,
      objectives: normalizeLines(objectivesText),
      skills: normalizeLines(skillsText),
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

      reset();
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
        reset();
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
      {/* Page heading */}
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
            Organize existing courses into structured learning journeys.
          </p>
        </div>

        <Button
          type="button"
          onClick={load}
          className="inline-flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {/* Notifications */}
      {error && (
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

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols">
        {/* Existing pathways */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                All Pathways
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {paths.length} pathway{paths.length === 1 ? "" : "s"} found
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {paths.length}
            </span>
          </div>

          <div className="space-y-3 p-4">
            {paths.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
                <BookOpen
                  size={36}
                  className="mx-auto mb-3 text-slate-400"
                />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  No learning pathways yet
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Create your first pathway using the form.
                </p>
              </div>
            ) : (
              paths.map((path) => (
                <div
                  key={path._id}
                  className={`rounded-xl border p-4 transition ${
                    editingId === path._id
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/5"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {path.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {path.category || "Uncategorized"} ·{" "}
                        {path.difficulty || "Beginner"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`rounded-full px-2.5 py-1 font-semibold ${
                            path.published
                              ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}
                        >
                          {path.published ? "Published" : "Draft"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {path.stages?.length || 0} stages
                        </span>

                        {path.publishedCourseCount !== undefined && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {path.publishedCourseCount} courses
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => edit(path)}
                        title="Edit pathway"
                        className="rounded-lg border border-slate-200 p-2 text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(path)}
                        disabled={deletingId === path._id}
                        title="Delete pathway"
                        className="rounded-lg border border-slate-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-800"
                      >
                        {deletingId === path._id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {path.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {path.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Create / edit form */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Learning Pathway" : "Create Learning Pathway"}
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Define the pathway and its learning stages.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-6 p-5">
            {/* Basic details */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Pathway Title *</label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g. Frontend Development"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Description *</label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe what learners will achieve..."
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category</label>

                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    placeholder="Frontend"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Difficulty</label>

                  <select
                    value={form.difficulty}
                    onChange={(e) => setField("difficulty", e.target.value)}
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
                <label className={labelClass}>Featured Image URL</label>

                <input
                  type="text"
                  value={form.featuredImage}
                  onChange={(e) => setField("featuredImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Display Order</label>

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
            </div>

            {/* Learning objectives */}
            <div>
              <label className={labelClass}>Learning Objectives</label>

              <textarea
                rows={5}
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                placeholder={
                  "Understand web development fundamentals.\nBuild responsive websites.\nDevelop modern frontend applications."
                }
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Enter one objective per line.
              </p>
            </div>

            {/* Skills */}
            <div>
              <label className={labelClass}>Skills Acquired</label>

              <textarea
                rows={5}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder={"HTML5\nCSS3\nJavaScript\nReact.js"}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Enter one skill per line.
              </p>
            </div>

            {/* Learning stages */}
            <div>
              <label className={labelClass}>Learning Stages *</label>

              <textarea
                rows={8}
                value={stagesText}
                onChange={(e) => setStagesText(e.target.value)}
                placeholder={
                  "1|HTML and CSS Fundamentals|Learn HTML and CSS.\n2|JavaScript Fundamentals|Learn programming with JavaScript.\n3|Modern React Development|Build applications with React."
                }
                className={`${inputClass} font-mono text-xs leading-6`}
                required
              />

              <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
                <p className="mb-1 font-semibold text-slate-800 dark:text-slate-200">
                  Stage format:
                </p>

                <code>stage number|stage title|stage description</code>

                <p className="mt-2">
                  Enter one stage per line. Example:
                </p>

                <code>
                  1|HTML and CSS Fundamentals|Learn how to build responsive websites.
                </code>
              </div>
            </div>

            {/* Publishing */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <input
                id="published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setField("published", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <label
                  htmlFor="published"
                  className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white"
                >
                  Publish this learning pathway
                </label>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Published pathways can appear on the public Courses page,
                  subject to the public API's visibility rules.
                </p>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row">
              <Button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2"
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
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Clear Form
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
