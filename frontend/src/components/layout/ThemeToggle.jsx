import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="
        rounded-lg
        border
        border-gray-200
        bg-white
        p-2
        text-gray-700
        transition
        hover:bg-gray-100
        dark:border-gray-700
        dark:bg-gray-800
        dark:text-gray-200
        dark:hover:bg-gray-700
      "
    >
      {darkMode ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}
