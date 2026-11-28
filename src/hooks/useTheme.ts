"use client";

import { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";

const THEME_STORAGE_KEY = "airwise_theme_dark";

export interface UseThemeReturn {
  isDark: boolean;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === "true");
      } else {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    } catch (e) {
      logger.warn("Theme hydration notice:", e);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, String(next));
      } catch (e) {
        logger.warn("Could not save theme:", e);
      }
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
}
