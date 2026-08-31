import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();

  const paths = location.pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
      <Link to="/">Home</Link>

      {paths.map((item, index) => {
        const url = "/" + paths.slice(0, index + 1).join("/");

        return (
          <div key={url} className="flex items-center gap-2">
            <ChevronRight size={14} />

            <Link to={url} className="capitalize">
              {item.replace("-", " ")}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
