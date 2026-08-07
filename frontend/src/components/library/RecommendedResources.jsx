import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import { ResourceCard } from ".";

export default function RecommendedResources({
  resources,
  savedIds,
  savingId,
  onSave,
}) {

  if (!resources.length) return null;

  return (
    <section className="mb-20">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Recommended For You
          </div>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Continue Learning
          </h2>

          <p className="mt-2 max-w-2xl text-gray-600">
            Based on the resources you've already saved, you may also like these.
          </p>

        </div>

        <Link
          to="/library"
          className="hidden items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700 md:flex"
        >
          Browse Library
          <ArrowRight size={18} />
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {resources.slice(0, 4).map((resource) => (

          <ResourceCard
            key={resource.resourceId}
            resource={resource}
            isSaved={savedIds.includes(resource.resourceId)}
            saving={savingId === resource.resourceId}
            onSave={onSave}
          />

        ))}

      </div>

    </section>
  );
}