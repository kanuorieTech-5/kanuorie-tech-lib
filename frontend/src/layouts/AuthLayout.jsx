import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="w-full rounded-2xl bg-white dark:bg-slate-900 shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}