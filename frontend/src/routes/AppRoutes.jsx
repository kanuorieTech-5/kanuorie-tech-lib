import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

/* =========================
   PUBLIC PAGES
========================= */

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Help = lazy(() => import("../pages/Help"));
const Books = lazy(() => import("../pages/Books"));
const BookDetails = lazy(() => import("../pages/BookDetails"));
const Library = lazy(() => import("../pages/Library"));

const Courses = lazy(() => import("../pages/Courses"));
const CourseDetails = lazy(() =>
  import("../pages/CourseDetails")
);

const Products = lazy(() => import("../pages/Products"));
const ProductDetails = lazy(() =>
  import("../pages/ProductDetails")
);

const Projects = lazy(() => import("../pages/Projects"));
const ProjectDetails = lazy(() =>
  import("../pages/ProjectDetails")
);

const Services = lazy(() => import("../pages/Services"));
const ServiceDetails = lazy(() =>
  import("../pages/ServiceDetails")
);

const Blog = lazy(() => import("../pages/Blog"));
const BlogDetails = lazy(() =>
  import("../pages/BlogDetails")
);

const Team = lazy(() => import("../pages/Team"));
const FAQ = lazy(() => import("../pages/FAQ"));
const Testimonials = lazy(() =>
  import("../pages/Testimonials")
);

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() =>
  import("../pages/Register")
);

const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() =>
  import("../pages/Settings")
);
const Notifications = lazy(() =>
  import("../pages/Notifications")
);

const PrivacyPolicy = lazy(() =>
  import("../pages/PrivacyPolicy")
);

const CookiePolicy = lazy(() =>
  import("../pages/CookiePolicy")
);

const TermsOfService = lazy(() =>
  import("../pages/TermsOfService")
);

/* =========================
   ADMIN DASHBOARD
========================= */

const AdminDashboard = lazy(() =>
  import("../pages/Admin")
);

const AdminUsers = lazy(() =>
  import("../pages/admin/AdminUsers")
);

const AdminBooks = lazy(() =>
  import("../pages/admin/AdminBooks")
);

const AdminCourses = lazy(() =>
  import("../pages/admin/AdminCourses")
);

const AdminProducts = lazy(() =>
  import("../pages/admin/AdminProducts")
);

const AdminProjects = lazy(() =>
  import("../pages/admin/AdminProjects")
);

const AdminServices = lazy(() =>
  import("../pages/admin/AdminServices")
);

const AdminBlog = lazy(() =>
  import("../pages/admin/AdminBlog")
);

const AdminTestimonials = lazy(() =>
  import("../pages/admin/AdminTestimonials")
);

const AdminFAQ = lazy(() =>
  import("../pages/admin/AdminFAQ")
);

const AdminNewsletter = lazy(() =>
  import("../pages/admin/AdminNewsletter")
);

const AdminNotifications = lazy(() =>
  import("../pages/admin/AdminNotifications")
);

const NotFound = lazy(() =>
  import("../pages/NotFound")
);

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        </div>
      }
    >
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route element={<MainLayout />}>

          <Route index element={<Home />} />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />

          <Route
            path="help"
            element={<Help />}
          />

          <Route
            path="books"
            element={<Books />}
          />

          <Route
            path="books/:id"
            element={<BookDetails />}
          />

          <Route
            path="library"
            element={<Library />}
          />

          <Route
            path="courses"
            element={<Courses />}
          />

          <Route
            path="courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="projects"
            element={<Projects />}
          />

          <Route
            path="projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="services"
            element={<Services />}
          />

          <Route
            path="services/:id"
            element={<ServiceDetails />}
          />

          <Route
            path="blog"
            element={<Blog />}
          />

          <Route
            path="blog/:id"
            element={<BlogDetails />}
          />

          <Route
            path="team"
            element={<Team />}
          />

          <Route
            path="faq"
            element={<FAQ />}
          />

          <Route
            path="testimonials"
            element={<Testimonials />}
          />

          <Route
            path="privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="cookie-policy"
            element={<CookiePolicy />}
          />

          <Route
            path="terms-of-service"
            element={<TermsOfService />}
          />

        </Route>

        {/* =========================
            AUTH ROUTES
        ========================= */}

        <Route element={<AuthLayout />}>

          <Route element={<PublicRoute />}>

            <Route
              path="login"
              element={<Login />}
            />

            <Route
              path="register"
              element={<Register />}
            />

          </Route>

        </Route>

        {/* =========================
            USER DASHBOARD
        ========================= */}

        <Route element={<DashboardLayout />}>

          <Route element={<ProtectedRoute />}>

            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />

          </Route>

        </Route>

        {/* =========================
            ADMIN DASHBOARD
        ========================= */}

        <Route element={<AdminLayout />}>

          <Route element={<AdminRoute />}>

            <Route path="admin">

              {/* Dashboard */}
              <Route
                index
                element={<AdminDashboard />}
              />

              {/* Users */}
              <Route
                path="users"
                element={<AdminUsers />}
              />

              {/* Content */}
              <Route
                path="books"
                element={<AdminBooks />}
              />

              <Route
                path="courses"
                element={<AdminCourses />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />

              <Route
                path="projects"
                element={<AdminProjects />}
              />

              <Route
                path="services"
                element={<AdminServices />}
              />

              <Route
                path="blog"
                element={<AdminBlog />}
              />

              <Route
                path="testimonials"
                element={<AdminTestimonials />}
              />

              <Route
                path="faq"
                element={<AdminFAQ />}
              />

              {/* Communication */}
              <Route
                path="newsletter"
                element={<AdminNewsletter />}
              />

              <Route
                path="notifications"
                element={<AdminNotifications />}
              />

            </Route>

          </Route>

        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </Suspense>
  );
}