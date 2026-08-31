import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-2">
          {i !== 0 && "/"}

          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
