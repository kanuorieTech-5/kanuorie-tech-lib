import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../contexts";

export default function UserDropdown() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-100"
      >
        <img
          src={
            user.avatar ||
            "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
          }
          alt={user.name}
          className="h-9 w-9 rounded-full object-cover"
        />

        <span className="hidden md:block">{user.name}</span>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white shadow-xl">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <User size={18} />
            Profile
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <Settings size={18} />
            Settings
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
