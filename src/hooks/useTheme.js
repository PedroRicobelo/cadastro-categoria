import { useState, useEffect } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verifica se há preferência salva no localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }

    // Verifica preferência do sistema
    if (window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return false;
  });

  useEffect(() => {
    // Aplica o tema ao documento
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }

    // Salva no localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return { isDarkMode, toggleTheme };
}
