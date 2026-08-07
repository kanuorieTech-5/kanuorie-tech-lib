import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } =
    useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border p-2 transition hover:bg-gray-100"
    >
      {darkMode ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}