import { createContext, useContext, useEffect, useMemo } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "m4rs-theme";
const LOCKED_THEME = "dark";

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.dataset.theme = LOCKED_THEME;
    document.documentElement.style.colorScheme = LOCKED_THEME;
    window.localStorage.setItem(STORAGE_KEY, LOCKED_THEME);
  }, []);

  const value = useMemo(
    () => ({
      theme: LOCKED_THEME,
      setTheme: () => {},
      toggleTheme: () => {},
    }),
    []
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
