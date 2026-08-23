import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/layout/AdminSidebar";

import {
  DashboardTopbar,
  DashboardBreadcrumb,
} from "../components/dashboard";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            <DashboardBreadcrumb />

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}