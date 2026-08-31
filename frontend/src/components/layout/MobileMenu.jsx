import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../contexts";

export default function MobileMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!open) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="absolute left-0 top-0 h-full w-72 bg-gray-300 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">Menu</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col">
          <Link
            to="/"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            Home
          </Link>

          <Link
            to="/library"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            📚 Library
          </Link>

          <Link
            to="/courses"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            🎓 Courses
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            to="/projects"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            Projects
          </Link>

          <Link
            to="/services"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            Services
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            ℹ️ About
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            📞 Contact
          </Link>

          <Link
            to="/help"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            ❓ Help
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-6 py-4 text-left text-red-500 transition hover:bg-red-50 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
