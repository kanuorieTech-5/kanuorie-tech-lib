import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Package,
  FolderKanban,
  Briefcase,
  BriefcaseBusiness,
  FileText,
  MessageSquare,
  HelpCircle,
  Mail,
  Bell,
  Menu,
  X,
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
    name: "Careers",
    path: "/admin/careers",
    icon: BriefcaseBusiness,
  },
  {
    name: "Learning",
    path: "/admin/learning",
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
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ==========================================
          MOBILE MENU BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition hover:bg-slate-800 lg:hidden"
        aria-label="Open admin menu"
        aria-expanded={isOpen}
      >
        <Menu size={22} />
      </button>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-800
          bg-slate-900 text-white
          shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:translate-x-0
          lg:shadow-none
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-2xl font-bold">
            Admin Panel
          </h2>

          {/* Mobile close button */}

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close admin menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 overflow-y-auto p-4">
          {adminLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
