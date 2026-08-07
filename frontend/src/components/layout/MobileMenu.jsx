import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function MobileMenu({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">
            Menu
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

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
            Library
          </Link>

          <Link
            to="/courses"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            Courses
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
            About
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="px-6 py-4 hover:bg-gray-100"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}