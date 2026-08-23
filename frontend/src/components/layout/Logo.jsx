import { Link } from "react-router-dom";
import logo from "../../assets/Logo.jpeg";
export default function Logo({
  size = "md",
  showText = true,
}) {
  const sizes = {
    sm: {
      logo: "h-8 w-8",
      text: "text-lg",
    },
    md: {
      logo: "h-10 w-10",
      text: "text-xl",
    },
    lg: {
      logo: "h-12 w-12",
      text: "text-2xl",
    },
  };

  const current = sizes[size] || sizes.md;

  return (
    <Link
      to="/"
      className="flex items-center gap-3"
    >
      <img
        src={logo}
        alt="KanuorieTech"
        className={`${current.logo} object-contain`}
      />

      {showText && (
        <div>
          <h1
            className={`font-bold text-slate-900 ${current.text}`}
          >
            KanuorieTech
          </h1>

          <p className="text-xs text-gray-500">
            Learn • Build • Grow
          </p>
        </div>
      )}
    </Link>
  );
}