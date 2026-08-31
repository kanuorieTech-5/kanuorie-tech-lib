import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function DashboardTopbar() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/admin") {
      return "Dashboard";
    }

    const segment = location.pathname.split("/").filter(Boolean).pop();

    if (!segment) return "Admin";

    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {getPageTitle()}
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              KanuorieTech Admin Panel
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 sm:block"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="ml-2 hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              A
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">
                Administrator
              </p>

              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
