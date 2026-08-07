import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">

        {/* Company */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            KanuorieTech
          </h2>

          <p className="leading-7">
            Empowering developers through
            technology, education and digital
            innovation.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-4 font-semibold text-white">
            Explore
          </h3>

          <ul className="space-y-3">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/library">Library</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-4 font-semibold text-white">
            Company
          </h3>

          <ul className="space-y-3">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li>
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/termsOfService">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 font-semibold text-white">
            Follow Us
          </h3>

          <div className="flex gap-4 text-2xl">
            <a href="#">
              <FaFacebook />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaLinkedin />
            </a>

            <a href="#">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-sm">
        © {year} KanuorieTech.
        All rights reserved.
      </div>
    </footer>
  );
}