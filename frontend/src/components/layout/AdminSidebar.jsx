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
    <aside className="w-72 border-r bg-slate-900 text-white">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="p-4">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
