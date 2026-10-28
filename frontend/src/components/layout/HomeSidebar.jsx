import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts";
import { primaryNavLinks } from "../../constants/primaryNavLinks";

export default function HomeSidebar() {
  const { user } = useAuth();
  const links = primaryNavLinks.filter((item) => !item.requiresAuth || user);

  return (
    <aside className="hidden w-60 shrink-0 border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="sticky top-16 flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Explore
        </p>
        <nav aria-label="Home page navigation" className="space-y-1">
          {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
