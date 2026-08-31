import { LayoutDashboard, User, Bell, Settings, LogOut } from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  return (
    <aside className="min-h-screen w-72 bg-slate-900 text-white">
      <div className="border-b border-slate-800 p-8">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <nav className="mt-6">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-8 py-4 transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            <Icon size={20} />

            {name}
          </NavLink>
        ))}

        <button className="mt-8 flex w-full items-center gap-4 px-8 py-4 hover:bg-red-600">
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
