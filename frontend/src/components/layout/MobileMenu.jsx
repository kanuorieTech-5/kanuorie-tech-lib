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

  const linkClasses =
    "relative z-10 flex items-center gap-3 px-5 py-3 text-gray-800 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700";

  return (
    <div
      id="mobile-navigation-menu"
      className="fixed inset-0 z-[100] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Background overlay: stays behind the navigation panel */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close mobile menu"
        className="absolute inset-0 z-0 h-full w-full cursor-default bg-black/40"
      />

      {/* Navigation panel: stays above the background overlay */}
      <div className="absolute left-0 top-0 z-10 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto overscroll-contain bg-gray-300 shadow-xl dark:bg-gray-950">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-400 p-5 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Menu
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="relative z-10 rounded-lg p-2 text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-1 flex-col py-2">
          <Link to="/" onClick={onClose} className={linkClasses}>
            <Home size={18} />
            Home
          </Link>

          <Link to="/library" onClick={onClose} className={linkClasses}>
            <LibraryBig size={18} />
            Library
          </Link>

          <Link to="/courses" onClick={onClose} className={linkClasses}>
            <BookOpen size={18} />
            Courses
          </Link>

          <Link to="/products" onClick={onClose} className={linkClasses}>
            <ShoppingBag size={18} />
            Products
          </Link>

          <Link to="/projects" onClick={onClose} className={linkClasses}>
            <FolderKanban size={18} />
            Projects
          </Link>

          <Link to="/services" onClick={onClose} className={linkClasses}>
            <BriefcaseBusiness size={18} />
            Services
          </Link>

          <Link to="/about" onClick={onClose} className={linkClasses}>
            <Info size={18} />
            About
          </Link>

          <Link to="/contact" onClick={onClose} className={linkClasses}>
            <Mail size={18} />
            Contact
          </Link>

          <Link to="/help" onClick={onClose} className={linkClasses}>
            <CircleHelp size={18} />
            Help
          </Link>

          {/* Authenticated user options */}
          {user && (
            <>
              <div className="my-2 border-t border-gray-400 dark:border-gray-800" />

              <Link to="/profile" onClick={onClose} className={linkClasses}>
                <User size={18} />
                Profile
              </Link>

              <Link to="/settings" onClick={onClose} className={linkClasses}>
                <Settings size={18} />
                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="relative z-10 flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}

          {/* Login and register options */}
          {!user && (
            <>
              <div className="my-2 border-t border-gray-400 dark:border-gray-800" />

              <Link
                to="/login"
                onClick={onClose}
                className="relative z-10 mx-4 my-1 rounded-lg border border-gray-400 px-4 py-3 text-center font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={onClose}
                className="relative z-10 mx-4 my-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}