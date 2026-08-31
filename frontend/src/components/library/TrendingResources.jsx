import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { ResourceCard } from ".";

export default function TrendingResources({
  resources,
  savedIds,
  savingId,
  onSave,
}) {
  if (!resources.length) return null;

  return (
    <section className=" py-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Popular Picks
          </p>

          <p className="mt-2 text-gray-300">
            The most popular books and learning resources on KanuorieTech.
          </p>
        </div>
      </div>
      <Link
        to="/library"
        className="items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700 md:flex ml-58 p-2"
      >
        View All
      </Link>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {resources.map((resource) => (
          <div
            key={resource.resourceId}
            className="min-w-[320px] max-w-[320px] flex-shrink-0"
          >
            <ResourceCard
              resource={resource}
              // isSaved={savedIds.includes(resource.resourceId)}
              saving={savingId === resource.resourceId}
              onSave={onSave}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
