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
  const firstName =
  user?.firstName ||
  user?.name?.trim().split(/\s+/)[0] ||
  user?.username ||
  "there";
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
    <div ref={menuRef} className="relative z-50 flex items-center gap-2 p-">
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
        <p className="hidden text-sm font-medium text-gray-800 dark:text-slate-200 md:block">
          {user.name}
        </p>

        <span className="hidden md:block">{user.name}</span>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white dark:bg-slate-900 shadow-xl">
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-800 dark:hover:bg-slate-800 dark:text-slate-200"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
}


