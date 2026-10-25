import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  User,
  Settings,
  Bell,
  Home,
  PlayCircle,
  Award,
  Bookmark,
  Users,
  Handshake,
  LifeBuoy,
  WalletCards,
  LogOut,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../../contexts";

const links = [
  { name: "Home", path: "/", icon: Home },
  { name: "Profile", path: "/profile", icon: User },
  { name: "My Learning", path: "/learning", icon: PlayCircle },
  { name: "Certificates", path: "/certificates", icon: Award },
  { name: "Saved Resources", path: "/saved-resources", icon: Bookmark },
  { name: "Community", path: "/community", icon: Users },
  { name: "Affiliate", path: "/affiliate", icon: Handshake },
  { name: "Accounts & Payments", path: "/payments", icon: WalletCards },
  { name: "Help & Support", path: "/help", icon: LifeBuoy },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <nav className="flex-1 overflow-y-auto p-4">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mb-2 mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            {loggingOut ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <LogOut size={20} />
            )}

            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}