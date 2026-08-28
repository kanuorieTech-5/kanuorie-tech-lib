import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">

        {/* ================================
            BRAND
        ================================= */}

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-white">
            KanuorieTech
          </h2>

          <p className="max-w-md leading-7 text-gray-400">
            Empowering developers through
            technology, education, and digital
            innovation.
          </p>
        </div>


        {/* ================================
            EXPLORE
        ================================= */}

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Explore
          </h3>

          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="transition hover:text-white"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/library"
                className="transition hover:text-white"
              >
                Library
              </Link>
            </li>

            <li>
              <Link
                to="/courses"
                className="transition hover:text-white"
              >
                Courses
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="transition hover:text-white"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to="/projects"
                className="transition hover:text-white"
              >
                Projects
              </Link>
            </li>

            <li>
              <Link
                to="/services"
                className="transition hover:text-white"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>


        {/* ================================
            COMPANY
        ================================= */}

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Company
          </h3>

          <ul className="space-y-3">
            <li>
              <Link
                to="/about"
                className="transition hover:text-white"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="transition hover:text-white"
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                to="/blog"
                className="transition hover:text-white"
              >
                Blog
              </Link>
            </li>

            <li>
              <Link
                to="/faq"
                className="transition hover:text-white"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>


        {/* ================================
            LEGAL
        ================================= */}

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Legal
          </h3>

          <ul className="space-y-3">
            <li>
              <Link
                to="/privacy-policy"
                className="transition hover:text-white"
              >
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link
                to="/terms-of-service"
                className="transition hover:text-white"
              >
                Terms of Service
              </Link>
            </li>

            <li>
              <Link
                to="/cookie-policy"
                className="transition hover:text-white"
              >
                Cookie Policy
              </Link>
            </li>

            <li>
              <Link
                to="/refund-policy"
                className="transition hover:text-white"
              >
                Refund Policy
              </Link>
            </li>

            <li>
              <Link
                to="/disclaimer"
                className="transition hover:text-white"
              >
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>


      {/* ================================
          SOCIAL + COPYRIGHT
      ================================= */}

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-5 sm:flex-row">

          {/* Copyright */}

          <p className="text-center text-sm text-gray-500 sm:text-left">
            © {year} KanuorieTech. All rights reserved.
          </p>


          {/* Social */}

          <div className="flex items-center gap-5 text-xl">
            <a
              href="#"
              aria-label="KanuorieTech Facebook"
              className="transition hover:text-white"
            >
              <FaFacebook />
            </a>

            <a
              href="#"
              aria-label="KanuorieTech Instagram"
              className="transition hover:text-white"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="KanuorieTech LinkedIn"
              className="transition hover:text-white"
            >
              <FaLinkedin />
            </a>

            <a
              href="#"
              aria-label="KanuorieTech GitHub"
              className="transition hover:text-white"
            >
              <FaGithub />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}