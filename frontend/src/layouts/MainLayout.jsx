import { Outlet } from "react-router-dom";
import ServiceTicker from "../components/home/ServiceTicker";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <ServiceTicker />
      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}


