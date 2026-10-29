import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Bookmark, RefreshCw } from "lucide-react";
import { getSavedResources, removeSavedResource } from "../services";
import ResourceCard from "../components/library/ResourceCard";

const extractItems = (response) => {
  const candidates = [response, response?.data, response?.data?.data];
  for (const result of candidates) {
    if (Array.isArray(result)) return result;
    for (const key of ["items", "resources", "savedResources"]) {
      if (Array.isArray(result?.[key])) return result[key];
      if (Array.isArray(result?.data?.[key])) return result.data[key];
    }
  }
  return [];
};
const getId = (item) => String(item?.resourceId ?? item?._id ?? item?.id ?? "");

export default function SavedResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = extractItems(await getSavedResources())
        .map((item) => ({
          ...item,
          resourceId: getId(item),
          resourceType: item.resourceType || "external",
          description: item.description ?? item.desc ?? "",
          image: item.image ?? item.coverImage ?? item.img ?? "",
          link: item.link ?? item.url ?? "",
        }))
        .filter((item) => item.resourceId);
      setResources(items);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "We couldn't load your saved resources. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleRemove = async (resource) => {
    if (removingId) return;
    setRemovingId(resource.resourceId);
    try {
      await removeSavedResource(resource.resourceId, resource.resourceType);
      setResources((current) =>
        current.filter(
          (item) =>
            !(
              item.resourceId === resource.resourceId &&
              item.resourceType === resource.resourceType
            ),
        ),
      );
      window.dispatchEvent(new Event("library-update"));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to remove this resource. Please try again.",
      );
    } finally {
      setRemovingId("");
    }
  };

  return (
    <section>
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 py-8 text-white sm:px-9 sm:py-10 mb-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Bookmark className="h-4 w-4" />
              Your collection
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Saved Resources
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Keep your books, courses, and useful learning links together so
              you can pick up where you left off.
            </p>
          </div>
          {!loading && (
            <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
              {resources.length}{" "}
              {resources.length === 1 ? "resource" : "resources"}
            </span>
          )}
        </div>
      </header>
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadResources}
            className="inline-flex items-center gap-2 font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : resources.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <div key={resource.resourceType + "-" + resource.resourceId}>
              <ResourceCard
                resource={resource}
                isSaved
                saving={removingId === resource.resourceId}
                onSave={handleRemove}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
            <BookOpen className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-xl font-bold dark:text-white">
            Your saved list is empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            Browse the library and use the bookmark button on a resource to keep
            it here.
          </p>
          <Link
            to="/library"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Explore the library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
