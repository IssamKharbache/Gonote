import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ThemeType = "light" | "dark" | "system";

const useTheme = (): [ThemeType, Dispatch<SetStateAction<ThemeType>>] => {
  // Use proper type safety with ThemeType
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as ThemeType) || "system";
  });

  const element = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Apply theme based on system preference or stored value
  const applyThemeClass = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && darkQuery.matches)
    ) {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    applyThemeClass();
  }, []);

  // Handle theme changes
  useEffect(() => {
    switch (theme) {
      case "dark":
        element.classList.add("dark");
        localStorage.setItem("theme", "dark");
        break;
      case "light":
        element.classList.remove("dark");
        localStorage.setItem("theme", "light");
        break;
      case "system":
        localStorage.removeItem("theme");
        applyThemeClass();
        break;
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        if (e.matches) {
          element.classList.add("dark");
        } else {
          element.classList.remove("dark");
        }
      }
    };

    darkQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      darkQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return [theme, setTheme];
};

export default useTheme;
