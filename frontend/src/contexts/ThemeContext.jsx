import { createContext, useContext, useEffect, useState } from "react";

import { getSettings, updateSettings } from "../api/userApi";

const ThemeContext = createContext(null);

const STORAGE_KEY = "kanuorietech-theme";

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

    let shouldUseDark;

    if (theme === "dark") {
      shouldUseDark = true;
    } else if (theme === "light") {
      shouldUseDark = false;
    } else {
      shouldUseDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setDarkMode(shouldUseDark);

    if (shouldUseDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  /* ==========================================
     LOAD USER THEME
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadUserTheme = async () => {
      try {
        const response = await getSettings();

        const settings =
          response?.data?.settings || response?.data || response?.settings;

        const savedTheme = settings?.theme;

        if (mounted && ["light", "dark", "system"].includes(savedTheme)) {
          setTheme(savedTheme);
          localStorage.setItem(STORAGE_KEY, savedTheme);
        }
      } catch (error) {
        /*
         * A visitor may not be authenticated.
         * In that case, keep the local/system theme.
         */
        console.debug("Unable to load account theme:", error?.message || error);
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

    /* Apply immediately */
    setTheme(newTheme);

    try {
      await updateSettings({
        theme: newTheme,
      });

      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);

      /*
       * Keep the UI responsive even if the
       * server request fails.
       */
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
