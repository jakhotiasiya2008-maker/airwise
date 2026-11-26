import React from "react";
import { Wind, SlidersHorizontal, ShieldAlert, Cpu } from "lucide-react";

interface HeaderProps {
  onOpenProfile: () => void;
  engine: "gemini" | "rule-based" | "loading";
  activePersonaName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  engine,
  activePersonaName,
}) => {
  return (
    <>
      {/* WCAG 2.2 Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Wind className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  AirWise India
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                  PromptWars #6
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden xs:block">
                GenAI Urban Air Quality & Smog Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Engine status indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              title={
                engine === "gemini"
                  ? "Powered by Gemini 2.5 Flash via @google/genai"
                  : engine === "rule-based"
                  ? "Rule-based guidance engine (Fallback active)"
                  : "Checking guidance engine..."
              }
            >
              {engine === "gemini" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="hidden sm:inline font-medium">Gemini AI</span>
                </>
              ) : engine === "rule-based" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span className="hidden sm:inline font-medium">Rule Engine</span>
                </>
              ) : (
                <span className="text-slate-400">Loading...</span>
              )}
            </div>

            {/* Profile Drawer Button */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label={`Household profile: ${activePersonaName || "Customize profile"}`}
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="hidden sm:inline">Profile</span>
              {activePersonaName && (
                <span className="max-w-[120px] truncate text-xs text-blue-700 dark:text-blue-300 font-semibold hidden md:inline">
                  {activePersonaName}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
