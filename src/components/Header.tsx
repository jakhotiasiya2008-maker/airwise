"use client";

import React from "react";
import { Wind } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { HeaderStatusBadges } from "./header/HeaderStatusBadges";
import { HeaderNavControls } from "./header/HeaderNavControls";

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
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
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
            <HeaderStatusBadges isOffline={isOffline} engine={engine} />

            <HeaderNavControls
              onOpenCommandPalette={onOpenCommandPalette}
              onToggleTheme={onToggleTheme}
              isDark={isDark}
              language={language}
              onToggleLanguage={() => setLanguage(language === "en" ? "hi" : "en")}
              onOpenProfile={onOpenProfile}
              activePersonaName={activePersonaName}
            />
          </div>
        </div>
      </header>
    </>
  );
};
