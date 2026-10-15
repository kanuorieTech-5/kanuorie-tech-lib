import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { ResourceCard } from ".";

export default function TrendingResources({
  resources = [],
  savedIds = [],
  savingId,
  onSave,
}) {
  if (!resources.length) return null;

  return (
    <section className="py-4">
      <div className="mb-4 flex items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Popular Picks
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-400">
            The most popular books and learning resources on KanuorieTech.
          </p>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto p-4 pb-6 sm:gap-6 sm:px-6 scrollbar-hide">
        {resources.map((resource, index) => {
          const resourceId =
            resource.resourceId || resource._id || resource.id || index;

          return (
            <div
              key={resourceId}
              className="w-[280px] flex-shrink-0 sm:w-[320px]"
            >
              <ResourceCard
                resource={resource}
                isSaved={savedIds.includes(resourceId)}
                saving={savingId === resourceId}
                onSave={onSave}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-end px-4 sm:px-6">
        <Link
          to="/library"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          See all resources
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function TrendingResourcesSkeleton() {
  return (
    <section className="py-4">
      <div className="mb-4 flex flex-col gap-2 px-4 sm:px-6">
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex gap-5 overflow-x-auto p-4 pb-6 sm:gap-6 sm:px-6 scrollbar-hide">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-[280px] flex-shrink-0 sm:w-[320px]"
          >
            <div className="h-48 animate-pulse rounded-t-2xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-3 rounded-b-2xl border border-slate-200 p-4 dark:border-gray-800">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}