import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Settings,
  Bell,
  Home,
  LibraryBig,
  BookOpen,
  ShoppingBag,
  FolderKanban,
  BriefcaseBusiness,
  Info,
  Mail,
  LogOut,
  PlayCircle,
  Award,
  Bookmark,
  Users,
  Handshake,
  WalletCards,
  LifeBuoy,
} from "lucide-react";

import { useAuth } from "../../contexts";
import UserDropdown from "./UserDropdown";
export default function MobileMenu({ open, onClose, side = "left" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const firstName =
    user?.firstName ||
    user?.name?.trim().split(/\s+/)[0] ||
    user?.username ||
    "there";
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
      {/* Background overlay */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close mobile menu"
        className="absolute inset-0 z-0 h-full w-full cursor-default bg-black/40"
      />

      {/* Navigation panel */}
      <div className={`absolute ${side === "right" ? "right-0" : "left-0"} top-0 z-10 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto overscroll-contain bg-gray-300 shadow-xl dark:bg-gray-950`}>
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

        {/* Main navigation */}
        <nav className="flex flex-1 flex-col py-2">
          {/* Welcome banner */}
          {user && (
            <section className="mx-4 my-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-5 text-white shadow-lg">
               <div className="mt-4 flex items-center gap-3">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || user.username || "User"
                    )}&background=ffffff&color=1d4ed8&bold=true`
                  }
                  alt={`${user.name || user.username || "User"}'s avatar`}
                  className="h-14 w-14 shrink-0 rounded-full border-2 border-white/70 object-cover shadow-md"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "https://ui-avatars.com/api/?name=User&background=ffffff&color=1d4ed8";
                  }}
                />

                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold">
                    Welcome back, {firstName}!
                  </h2>
                  
                </div>
              </div>

              <Link
                to="/profile"
                onClick={onClose}
                className="mt-4 inline-flex rounded-xl border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                My Profile
              </Link>
            </section>
          )}

          {/* Admin dropdown */}
          {user?.role === "admin" && (
            <div className="mx-4 mb-3">
              <UserDropdown />
            </div>
          )}
          <Link to="/home" onClick={onClose} className={linkClasses}>
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

          <Link to="/learning" onClick={onClose} className={linkClasses}>
            <PlayCircle size={18} />
            My Learning
          </Link>

          <Link to="/certificates" onClick={onClose} className={linkClasses}>
            <Award size={18} />
            Certificates
          </Link>

          <Link to="/saved-resources" onClick={onClose} className={linkClasses}>
            <Bookmark size={18} />
            Saved Resources
          </Link>
          
          <Link to="/products" onClick={onClose} className={linkClasses}>
            <ShoppingBag size={18} />
            Tools & Products
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
            <LifeBuoy size={18} />
            Help & Support
          </Link>

          <Link to="/community" onClick={onClose} className={linkClasses}>
            <Users size={18} />
            Community
          </Link>

          <Link to="/affiliate" onClick={onClose} className={linkClasses}>
            <Handshake size={18} />
            Affiliate
          </Link>

          <Link to="/payments" onClick={onClose} className={linkClasses}>
            <WalletCards size={18} />
            Accounts & Payments
          </Link>

          {/* Account navigation */}
          {user && (
            <>
              <div className="mx-5 my-3 border-t border-gray-400 dark:border-gray-800" />
                <Link
                  to="/notifications"
                  onClick={onClose}
                  className={linkClasses}
                >
                  <Bell size={18} />
                  Notifications
                </Link>

                <Link to="/settings" onClick={onClose} className={linkClasses}>
                  <Settings size={18} />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="relative z-10 mt-3 flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut size={18} />
                  Logout
                </button>
            </>
          )}

          {/* Guest navigation */}
          {!user && (
            <>
              <div className="mx-5 my-3 border-t border-gray-400 dark:border-gray-800" />

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
