import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotification } from "../../contexts";

export default function NotificationBell() {
  const { unreadCount } =
  useNotification();

  return (
    <Link
      to="/notifications"
      className="relative rounded-lg p-2 hover:bg-gray-100"
    >
      <Bell size={20} />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}