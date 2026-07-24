import { useState, useContext } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import logo from "../assets/Logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    token,
    logout,
    unreadCount,
  } = useContext(AuthContext);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    ["Home", "/"],
    ["Services", "/services"],
    ["Products", "/products"],
    ["Library", "/library"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  const navClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-purple-600 font-semibold"
        : "text-gray-700 hover:text-purple-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">

      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="logo"
            className="w-12"
          />

          <div>
            <h1 className="font-black text-xl">
              KanuorieTech
            </h1>

            <p className="text-xs text-gray-500">
              Build • Scale • Innovate
            </p>
          </div>
        </Link>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">

          {links.map(([label, path]) => (
            <NavLink
              key={label}
              to={path}
              className={navClass}
            >
              {label}
            </NavLink>
          ))}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {token && (
            <Link
              to="/notifications"
              className="relative"
            >
              <Bell size={20} />

              {!!unreadCount && (
                <span
                  className="
                  absolute
                  -top-2
                  -right-2
                  w-5
                  h-5
                  rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() =>
                navigate("/admin")
              }
              className="
              hidden
              md:block
              text-purple-600
              font-semibold
            "
            >
              Admin
            </button>
          )}

          {token ? (
            <Link
              to="/profile"
              className="
              hidden
              md:flex
              items-center
              gap-2
            "
            >
              <User size={18} />
              {user?.name}
            </Link>
          ) : (
            <button
              onClick={() => navigate("/contact")}
              className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Start Project
              <ChevronRight size={18} />
            </button>
          )}

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* MOBILE */}
      {open && (
        <div className="lg:hidden bg-white border-t">

          <div className="px-6 py-6 space-y-5">

            {links.map(([label, path]) => (
              <NavLink
                key={label}
                to={path}
                onClick={closeMenu}
                className="
                block
                font-medium
                hover:text-purple-600
              "
              >
                {label}
              </NavLink>
            ))}

            <hr />

            {token ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="
                  flex
                  items-center
                  gap-2
                  text-red-500
                "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  closeMenu();
                }}
                className="
                w-full
                py-3
                rounded-xl
                bg-blue-600
                text-white
              "
              >
                Login
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}