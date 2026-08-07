import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  ResourceCard,
} from ".";

export default function TrendingResources({
  resources,
  savedIds,
  savingId,
  onSave,
}) {

  if (!resources.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Popular Picks
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Trending Resources
          </h2>

          <p className="mt-2 text-gray-600">
            The most popular books and learning resources on KanuorieTech.
          </p>

        </div>

        <Link
          to="/library"
          className="hidden items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700 md:flex"
        >
          View All
          <ArrowRight size={18} />
        </Link>

      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">

        {resources.map((resource) => (

          <div
            key={resource.resourceId}
            className="min-w-[320px] max-w-[320px] flex-shrink-0"
          >

            <ResourceCard
              resource={resource}
              isSaved={savedIds.includes(resource.resourceId)}
              saving={savingId === resource.resourceId}
              onSave={onSave}
            />

          </div>

        ))}

      </div>

    </section>
  );
}