import { createContext, useContext, useEffect, useState } from "react";
import { getSettings, updateSettings } from "../api/userApi";

const ThemeContext = createContext(null);

const STORAGE_KEY = "kanuorietech-theme";
const TOKEN_KEY = "kanuorietech_token";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "system";
  });

  const [loadingTheme, setLoadingTheme] = useState(true);

  /* ==========================================
     APPLY THEME
  ========================================== */

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const shouldUseDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      setDarkMode(shouldUseDark);
      root.classList.toggle("dark", shouldUseDark);
    };

    applyTheme();

    localStorage.setItem(STORAGE_KEY, theme);

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);

      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  /* ==========================================
     LOAD USER THEME
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadUserTheme = async () => {
      try {
        // Public visitors should use their local/system theme.
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
          return;
        }

        const response = await getSettings();

        const settings =
          response?.data?.settings ||
          response?.data ||
          response?.settings;

        const savedTheme = settings?.theme;

        if (
          mounted &&
          ["light", "dark", "system"].includes(savedTheme)
        ) {
          setTheme(savedTheme);
          localStorage.setItem(STORAGE_KEY, savedTheme);
        }
      } catch (error) {
        console.debug(
          "Unable to load account theme:",
          error?.message || error,
        );
      } finally {
        if (mounted) {
          setLoadingTheme(false);
        }
      }
    };

    loadUserTheme();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     SET THEME
  ========================================== */

  const setThemePreference = async (newTheme) => {
    if (!["light", "dark", "system"].includes(newTheme)) {
      return;
    }

    // Update the interface immediately.
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);

    // Do not call protected APIs for logged-out visitors.
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    try {
      await updateSettings({
        theme: newTheme,
      });
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  /* ==========================================
     TOGGLE DARK MODE
  ========================================== */

  const toggleTheme = async () => {
    const nextTheme = darkMode ? "light" : "dark";
    await setThemePreference(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        theme,
        loadingTheme,
        setTheme: setThemePreference,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
