"use client";

import React from "react";
import { Wind, SlidersHorizontal, ShieldAlert, Cpu, Sun, Moon, Languages, Command, WifiOff } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenCommandPalette: () => void;
  engine: "gemini" | "rule-based" | "loading";
  activePersonaName?: string;
  isDark: boolean;
  onToggleTheme: () => void;
  isOffline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenCommandPalette,
  engine,
  activePersonaName,
  isDark,
  onToggleTheme,
  isOffline = false,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* WCAG 2.2 Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t.skipLink}
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Wind className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 uppercase">
                  Challenge #6
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block truncate max-w-xs">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Offline badge */}
            {isOffline && (
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                role="status"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline Mode</span>
              </div>
            )}

            {/* Engine status indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300"
              title={
                engine === "gemini"
                  ? "Powered by Gemini 2.5 Flash via @google/genai"
                  : engine === "rule-based"
                  ? "Deterministic rule engine active"
                  : "Loading engine..."
              }
            >
              {engine === "gemini" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="hidden md:inline">Gemini AI</span>
                </>
              ) : engine === "rule-based" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span className="hidden md:inline">Rule Engine</span>
                </>
              ) : (
                <span className="text-slate-400">...</span>
              )}
            </div>

            {/* Command Palette Button */}
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

            {/* Language Toggle (EN / HI) */}
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
              aria-label={`Toggle language to ${language === "en" ? "Hindi" : "English"}`}
            >
              <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language === "en" ? "हिं" : "EN"}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Profile Drawer Button */}
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
          </div>
        </div>
      </header>
    </>
  );
};
