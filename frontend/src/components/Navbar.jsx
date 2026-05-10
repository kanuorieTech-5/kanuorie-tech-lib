import { useState, useContext, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  Book,
  User,
  Settings,
  Bell,
  HelpCircle,
  Info,
  Phone,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/Logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const { user, token, logout, unreadCount } = useContext(AuthContext);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const navItem = ({ isActive }) =>
    `flex items-center gap-2 py-2 px-3 rounded-lg transition ${
      isActive
        ? "bg-purple-100 text-purple-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const closeMenu = () => setOpen(false);

  return (
    <nav className="bg-black sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
        >
          <img src={logo} className="w-10 rounded-lg" alt="KanuorieTech Logo" />
          <h1 className="font-bold text-xl text-white">
            KanuorieTechLib
          </h1>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* ADMIN QUICK LINK */}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="text-white hover:text-purple-400 transition"
            >
              Admin
            </NavLink>
          )}

          {/* 🔔 NOTIFICATIONS */}
          <Link
            to="/notifications"
            className="relative text-white text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            aria-label="Notifications"
          >
            🔔
            {(unreadCount || 0) > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="text-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
      )}

      {/* DROPDOWN */}
      {open && (
        <div
          ref={menuRef}
          className="absolute top-16 right-4 bg-white shadow-2xl rounded-xl p-4 w-60 space-y-2 z-50 animate-fadeIn"
        >
          {user && (
            <div className="px-3 pb-2 border-b text-sm text-gray-500">
              👋 {user.name}
            </div>
          )}

          <NavLink to="/" onClick={closeMenu} className={navItem}>
            <Home size={18} /> Home
          </NavLink>

          {token && (
            <>
              <NavLink to="/profile" onClick={closeMenu} className={navItem}>
                <User size={18} /> Profile
              </NavLink>

              <NavLink to="/library" onClick={closeMenu} className={navItem}>
                <Book size={18} /> Library
              </NavLink>

              <NavLink to="/courses" onClick={closeMenu} className={navItem}>
                🎓 Courses
              </NavLink>

              <NavLink to="/notifications" onClick={closeMenu} className={navItem}>
                <Bell size={18} /> Notifications
              </NavLink>

              <NavLink to="/settings" onClick={closeMenu} className={navItem}>
                <Settings size={18} /> Settings
              </NavLink>

              {user?.role === "admin" && (
                <NavLink to="/admin" onClick={closeMenu} className={navItem}>
                  ⚡ Admin dashboard
                </NavLink>
              )}
            </>
          )}

          {/* PUBLIC */}
          <NavLink to="/about" onClick={closeMenu} className={navItem}>
            <Info size={18} /> About
          </NavLink>

          <NavLink to="/help" onClick={closeMenu} className={navItem}>
            <HelpCircle size={18} /> Help
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu} className={navItem}>
            <Phone size={18} /> Contact
          </NavLink>

          <NavLink to="/faq" onClick={closeMenu} className={navItem}>
            <Info size={18} /> FAQ
          </NavLink>

          {/* AUTH */}
          <div className="pt-2 border-t">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-2 px-3 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu} className={navItem}>
                  <User size={18} /> Login
                </NavLink>

                <NavLink to="/register" onClick={closeMenu} className={navItem}>
                  ✨ Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}