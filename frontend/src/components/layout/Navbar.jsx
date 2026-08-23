import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import {
  Logo,
  SearchBar,
  // ThemeToggle,
  NotificationBell,
  UserDropdown,
  MobileMenu,
} from ".";

import { useAuth } from "../../contexts";

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <header className="border-b bg-gray-300 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex items-center gap-6 px-6 py-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link to="/">Home</Link>
            <Link to="/library">📚</Link>
            <Link to="/courses">🎓</Link>
            <Link to="/products">Products</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/services">Services</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">📞</Link>
            <Link to="/profile">👤</Link>
          </nav>

          {/* Search */}
          <div className="ml-auto hidden w-72 xl:block">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}

            {user && <NotificationBell />}

            {user ? (
              <UserDropdown />
            ) : (
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
              className="lg:hidden ml-30"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}