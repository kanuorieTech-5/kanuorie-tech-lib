import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Package,
  FolderKanban,
  Briefcase,
  FileText,
  MessageSquare,
  HelpCircle,
  Mail,
  Bell,
} from "lucide-react";

const adminLinks = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Books",
    path: "/admin/books",
    icon: BookOpen,
  },
  {
    name: "Courses",
    path: "/admin/courses",
    icon: GraduationCap,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Projects",
    path: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Services",
    path: "/admin/services",
    icon: Briefcase,
  },
  {
    name: "Blog",
    path: "/admin/blog",
    icon: FileText,
  },
  {
    name: "Testimonials",
    path: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    name: "FAQ",
    path: "/admin/faq",
    icon: HelpCircle,
  },
  {
    name: "Newsletter",
    path: "/admin/newsletter",
    icon: Mail,
  },
  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 text-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <div>
            <h2 className="text-lg font-bold">KanuorieTech</h2>

            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {adminLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <p className="text-center text-xs text-slate-500">
            KanuorieTech © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </aside>
  );
}
