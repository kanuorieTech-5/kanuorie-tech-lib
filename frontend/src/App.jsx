import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Library from "./pages/Library";
import Courses from "./pages/courses";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import TermsOfService from "./pages/TermsOfService.jsx";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import ProtectedRoute from "./components/ProtectedRoute";
import CookieBanner from "./components/CookieBanner";
function App() {
  const { settings, loadingAuth } = useContext(AuthContext);

  // ⏳ Prevent UI crash during auth hydration
  if (loadingAuth) return null;

  return (
    <div
      className={
        settings?.darkMode
          ? "bg-gray-900 text-gray-200 min-h-screen"
          : "bg-gray-50 min-h-screen"
      }
    >
      <Toaster position="top-right" reverseOrder={false} />
      <CookieBanner />
      
      <Routes>
        {/* PUBLIC ROUTES */}
        {/* <Route path="/" element={<Register />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/termsOfService" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* <Route path="/faq" element={<FAQ />} /> */}
        {/* PROTECTED ROUTES */}
        <Route path="/library" element={<Library />}/>
        <Route path="/courses" element={<Courses />}/>

        <Route path="/profile" element={<Profile />}/>

        {/* 🔐 ADMIN PROTECTED (FIXED) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;