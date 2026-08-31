import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
