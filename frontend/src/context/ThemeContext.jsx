import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("system");
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(savedTheme, prefersDark);
    setIsLoading(false);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (theme === "system") {
        applyTheme("system", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const applyTheme = (selectedTheme, systemIsDark = false) => {
    let shouldBeDark = false;

    if (selectedTheme === "system") {
      shouldBeDark = systemIsDark;
    } else if (selectedTheme === "dark") {
      shouldBeDark = true;
    }

    setIsDark(shouldBeDark);

    // Apply to document element
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply CSS variables
    const root = document.documentElement;
    if (shouldBeDark) {
      root.style.colorScheme = "dark";
      root.style.setProperty("--bg-primary", "#0f172a");
      root.style.setProperty("--bg-secondary", "#1e293b");
      root.style.setProperty("--bg-tertiary", "#334155");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#cbd5e1");
      root.style.setProperty("--text-tertiary", "#94a3b8");
      root.style.setProperty("--border-color", "#475569");
      root.style.setProperty("--input-bg", "#1e293b");
      root.style.setProperty("--input-border", "#475569");
    } else {
      root.style.colorScheme = "light";
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f8fafc");
      root.style.setProperty("--bg-tertiary", "#f1f5f9");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#334155");
      root.style.setProperty("--text-tertiary", "#64748b");
      root.style.setProperty("--border-color", "#e2e8f0");
      root.style.setProperty("--input-bg", "#f8fafc");
      root.style.setProperty("--input-border", "#e2e8f0");
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply immediately
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(newTheme, prefersDark);
  };

  const value = {
    theme,
    isDark,
    changeTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
