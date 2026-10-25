import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";
import HomeSidebar from "../components/layout/HomeSidebar";
import ServiceTicker from "../components/home/ServiceTicker";
import { useAuth } from "../contexts";

export default function DashboardLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <Navbar />
      {isHome && <ServiceTicker />}

      <div className="flex min-h-screen min-w-0 bg-gray-50 dark:bg-gray-950">
        {user && !isHome && <Sidebar />}

        <main className={`min-w-0 flex-1 ${isHome ? "" : "p-3 sm:p-6"}`}>
          <Outlet />
        </main>
        {isHome && <HomeSidebar />}
      </div>

      <Footer />
    </>
  );
}


