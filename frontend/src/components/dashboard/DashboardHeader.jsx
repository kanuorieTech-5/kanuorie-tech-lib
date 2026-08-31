import { useLocation } from "react-router-dom";
export default function DashboardHeader({
  title = "Dashboard",
  subtitle = "",
  action = null,
}) {
  const location = useLocation();

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-blue-600">
          {location.pathname.startsWith("/admin") ? "Admin Panel" : "Dashboard"}
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
