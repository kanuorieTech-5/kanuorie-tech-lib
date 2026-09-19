import { Link, useNavigate } from "react-router-dom";

import {
  X,
  User,
  Settings,
  Home,
  LibraryBig,
  BookOpen,
  ShoppingBag,
  FolderKanban,
  BriefcaseBusiness,
  Info,
  Mail,
  CircleHelp,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../contexts";

export default function MobileMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!open) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-gray-300 shadow-xl dark:bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-400 p-5 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Menu
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-2">
          {/* Home */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Home size={18} />
            Home
          </Link>

          {/* Library */}
          <Link
            to="/library"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <LibraryBig size={18} />
            Library
          </Link>

          {/* Courses */}
          <Link
            to="/courses"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <BookOpen size={18} />
            Courses
          </Link>

          {/* Products */}
          <Link
            to="/products"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ShoppingBag size={18} />
            Products
          </Link>

          {/* Projects */}
          <Link
            to="/projects"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <FolderKanban size={18} />
            Projects
          </Link>

          {/* Services */}
          <Link
            to="/services"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <BriefcaseBusiness size={18} />
            Services
          </Link>

          {/* About */}
          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Info size={18} />
            About
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Mail size={18} />
            Contact
          </Link>

          {/* Help */}
          <Link
            to="/help"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <CircleHelp size={18} />
            Help
          </Link>

          {/* Authenticated User Options */}
          {user && (
            <>
              <div className="my-2 border-t border-gray-400 dark:border-gray-800" />

              {/* Profile */}
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <User size={18} />
                Profile
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Settings size={18} />
                Settings
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}

          {/* Login / Register */}
          {!user && (
            <>
              <div className="my-2 border-t border-gray-400 dark:border-gray-800" />

              <Link
                to="/login"
                onClick={onClose}
                className="mx-4 my-1 rounded-lg border border-gray-400 px-4 py-3 text-center font-medium text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={onClose}
                className="mx-4 my-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Background overlay */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close mobile menu"
        className="absolute inset-0 -z-10 bg-black/40"
      />
    </div>
  );
}