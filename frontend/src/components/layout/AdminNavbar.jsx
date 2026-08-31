import { Bell, Settings } from "lucide-react";

import Avatar from "../common/Avatar";

export default function AdminNavbar() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <p className="text-sm text-gray-500">Welcome back</p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell size={22} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="rounded-full p-2 hover:bg-gray-100">
          <Settings size={22} />
        </button>

        <Avatar />
      </div>
    </header>
  );
}
