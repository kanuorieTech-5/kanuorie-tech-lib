import { ChevronRight } from "lucide-react";

export default function DashboardBreadcrumb({ items = [] }) {
  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          <span>{item.label}</span>

          {index !== items.length - 1 && <ChevronRight size={16} />}
        </div>
      ))}
    </div>
  );
}
