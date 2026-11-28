import React from "react";
import { Command, Languages, Moon, SlidersHorizontal, Sun } from "lucide-react";
import { SupportedLanguage } from "@/lib/i18n/types";

interface HeaderNavControlsProps {
  onOpenCommandPalette: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  onOpenProfile: () => void;
  activePersonaName?: string;
}

export const HeaderNavControls: React.FC<HeaderNavControlsProps> = ({
  onOpenCommandPalette,
  onToggleTheme,
  isDark,
  language,
  onToggleLanguage,
  onOpenProfile,
  activePersonaName,
}) => {
  return (
    <>
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 hidden sm:flex items-center gap-1"
        aria-label="Open command palette (Ctrl+K)"
        title="Command Palette (Ctrl+K)"
      >
        <Command className="w-4 h-4" />
        <span className="text-[10px] font-mono font-bold">K</span>
      </button>

      <button
        type="button"
        onClick={onToggleLanguage}
        className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
        aria-label={`Toggle language to ${language === "en" ? "Hindi" : "English"}`}
      >
        <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>{language === "en" ? "हिं" : "EN"}</span>
      </button>

      <button
        type="button"
        onClick={onToggleTheme}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
      </button>

      <button
        type="button"
        onClick={onOpenProfile}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        aria-label={`Household profile: ${activePersonaName || "Customize profile"}`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden md:inline">{activePersonaName || "Profile"}</span>
        <span className="md:hidden">Profile</span>
      </button>
    </>
  );
};
