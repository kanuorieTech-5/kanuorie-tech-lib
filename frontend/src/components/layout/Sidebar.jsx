import { NavLink } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  User,
  Settings,
  Bell,
  Home,
} from "lucide-react";

const links = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Library",
    path: "/library",
    icon: BookOpen,
  },
  {
    name: "Courses",
    path: "/courses",
    icon: GraduationCap,
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

export default function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-white lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <nav className="flex-1 p-4">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />

                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
