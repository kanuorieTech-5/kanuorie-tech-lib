import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Logo, SearchBar, NotificationBell, UserDropdown, MobileMenu } from ".";
import { useAuth } from "../../contexts";

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <header className="relative z-30 w-full border-b border-gray-200 bg-gray-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex w-full items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link to="/">Home</Link>
            <Link to="/library">Library</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/products">Products</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/services">Services</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/profile">Profile</Link>
          </nav>

          {/* Search */}
          <div className="ml-auto hidden w-72 xl:block">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Right Side */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notifications - logged in users */}
            {user && <NotificationBell />}

            {/* Admin User Dropdown - desktop only */}
            {user?.role === "admin" && (
              <UserDropdown className="hidden lg:block" />
            )}

            {/* Login / Register - logged out users only */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-lg border px-4 py-2 lg:block"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hidden rounded-lg bg-blue-600 px-4 py-2 text-white lg:block"
                >
                  Register
                </Link>
              </>
            )}          
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-2 text-gray-900 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden dark:text-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-menu"
            >
              <Menu size={24} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}


