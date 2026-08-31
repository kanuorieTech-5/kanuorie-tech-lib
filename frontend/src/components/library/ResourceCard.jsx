import { Link } from "react-router-dom";
import { Bookmark, Check, BookOpen } from "lucide-react";

import { Card, Button, Badge } from "../common";

export default function ResourceCard({ resource, isSaved, saving, onSave }) {
  return (
    <Card className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-xl h-100 p-">
      {/* Image */}
      <div className="relative">
        <img
          src={
            resource.image ||
            resource.img ||
            resource.coverImage ||
            "https://via.placeholder.com/150"
          }
          alt={resource.title}
          className="max-h-50 w-full object-cover"
        />
        <div className="absolute left-4 top-4">
          <Badge>{resource.category || "General"}</Badge>
        </div>
      </div>
      {/* Content */}
      <div className="p-2">
        <h3 className="line-clamp-2 text-xl font-bold text-slate-500">
          {resource.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
          {resource.description || "Explore this learning resource."}
        </p>
        <div className=" mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen size={16} />
            Resource
          </div>
          {isSaved && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Check size={16} />
              Saved
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          {resource.link ? (
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button fullWidth>Read</Button>
            </a>
          ) : (
            <Link
              to={`/library/${resource.resourceId || resource._id}`}
              className="flex-1"
            >
              <Button fullWidth>Read</Button>
            </Link>
          )}

          <button
            // disabled={saving || isSaved}
            onClick={() => onSave(resource)}
            className="flex items-center justify-center
              rounded-lg border px-4 transition hover:bg-blue-600
              disabled:cursor-not-allowed bg-white"
          >
            {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>
    </Card>
  );
}
