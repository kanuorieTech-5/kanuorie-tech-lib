import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import {
  Logo,
  SearchBar,
  ThemeToggle,
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
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link to="/">Home</Link>

            <Link to="/library">
              Library
            </Link>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/projects">
              Projects
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/blog">
              Blog
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden w-72 xl:block">
            <SearchBar
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <ThemeToggle />

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

            {/* Mobile */}
            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="lg:hidden"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />
    </>
  );
}