import { Link } from "react-router-dom";
import { Bookmark, Check, BookOpen } from "lucide-react";

import { Card, Button, Badge } from "../common";

export default function ResourceCard({ resource, isSaved, saving, onSave }) {
  return (
    <Card
      className="
        group flex h-full flex-col overflow-hidden
        rounded-2xl border border-slate-200
        bg-white p-0 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        dark:border-gray-800 dark:bg-gray-900
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={
            resource.image ||
            resource.img ||
            resource.coverImage ||
            "https://placehold.co/600x400?text=Learning+Resource"
          }
          alt={resource.title || "Learning resource"}
          loading="lazy"
          className="
            h-48 w-full object-cover
            transition-transform duration-500
            group-hover:scale-105
            sm:h-52
          "
        />

        {/* Category */}
        <div className="absolute left-3 top-3">
          <Badge>{resource.category || "General"}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title */}
        <h3
          className="
            line-clamp-2 text-lg font-bold
            text-blue-600 transition-colors
            group-hover:text-blue-600
            dark:text-gray-100 dark:group-hover:text-blue-400
            sm:text-xl
          "
        >
          {resource.title}
        </h3>

        {/* Description */}
        <p
          className="
            mt-3 line-clamp-3 flex-1
            text-sm leading-6 text-slate-600
            dark:text-gray-400
          "
        >
          {resource.description || "Explore this learning resource."}
        </p>

        {/* Resource status */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div
            className="
              flex items-center gap-2 text-sm
              text-slate-500 dark:text-gray-400
            "
          >
            <BookOpen size={16} />
            <span>Resource</span>
          </div>

          {isSaved && (
            <div
              className="
                flex items-center gap-1 text-sm font-medium
                text-green-600 dark:text-green-400
              "
            >
              <Check size={16} />
              <span>Saved</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3">
          {resource.link ? (
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1"
            >
              <Button fullWidth>Read</Button>
            </a>
          ) : (
            <Link
              to={`/library/${resource.resourceId || resource._id}`}
              className="min-w-0 flex-1"
            >
              <Button fullWidth>Read</Button>
            </Link>
          )}

          <button
            type="button"
            onClick={() => onSave?.(resource)}
            disabled={saving}
            aria-label={
              isSaved
                ? `Remove ${resource.title} from saved resources`
                : `Save ${resource.title}`
            }
            aria-pressed={Boolean(isSaved)}
            title={isSaved ? "Saved resource" : "Save resource"}
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-xl border
              border-slate-200 bg-slate-50
              text-slate-600
              transition-all duration-200
              hover:border-blue-500 hover:bg-blue-600
              hover:text-white
              disabled:cursor-not-allowed disabled:opacity-50
              dark:border-gray-700 dark:bg-gray-800
              dark:text-gray-300
              dark:hover:border-blue-500 dark:hover:bg-blue-600
              dark:hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500
              focus-visible:ring-offset-2
              dark:focus-visible:ring-offset-gray-900
            "
          >
            {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>
    </Card>
  );
}
