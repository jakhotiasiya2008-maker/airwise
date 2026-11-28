"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Compass, Home, Leaf, Wrench, SlidersHorizontal } from "lucide-react";

interface BottomNavBarProps {
  onOpenProfile: () => void;
  onOpenTools: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenProfile, onOpenTools }) => {
  const { t } = useLanguage();

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex items-center justify-around shadow-lg transition-colors"
    >
      <a
        href="#main-content"
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600"
      >
        <Compass className="w-5 h-5 text-blue-600" />
        <span>Routines</span>
      </a>

      <button
        type="button"
        onClick={onOpenTools}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
      >
        <Wrench className="w-5 h-5 text-indigo-600" />
        <span>{t.tabs.tools}</span>
      </button>

      <button
        type="button"
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600"
      >
        <SlidersHorizontal className="w-5 h-5 text-blue-600" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
