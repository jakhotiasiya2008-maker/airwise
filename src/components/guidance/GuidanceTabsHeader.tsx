"use client";

import React from "react";
import { Compass, Home, Leaf, Wrench } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export type GuidanceTabType = "all" | "routines" | "indoor" | "sustainable" | "tools";

interface GuidanceTabsHeaderProps {
  activeTab: GuidanceTabType;
  onSelectTab: (tab: GuidanceTabType) => void;
  routinesCount: number;
  indoorCount: number;
  sustainableCount: number;
}

export const GuidanceTabsHeader: React.FC<GuidanceTabsHeaderProps> = ({
  activeTab,
  onSelectTab,
  routinesCount,
  indoorCount,
  sustainableCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "all"}
        onClick={() => onSelectTab("all")}
        className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
          activeTab === "all"
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
        }`}
      >
        {t.tabs.all}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "routines"}
        onClick={() => onSelectTab("routines")}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
          activeTab === "routines"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
        }`}
      >
        <Compass className="w-3.5 h-3.5" aria-hidden="true" />
        <span>
          {t.tabs.routines} ({routinesCount})
        </span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "indoor"}
        onClick={() => onSelectTab("indoor")}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
          activeTab === "indoor"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
        }`}
      >
        <Home className="w-3.5 h-3.5" aria-hidden="true" />
        <span>
          {t.tabs.indoor} ({indoorCount})
        </span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "sustainable"}
        onClick={() => onSelectTab("sustainable")}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
          activeTab === "sustainable"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
        }`}
      >
        <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
        <span>
          {t.tabs.sustainable} ({sustainableCount})
        </span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "tools"}
        onClick={() => onSelectTab("tools")}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
          activeTab === "tools"
            ? "bg-indigo-600 text-white shadow-sm"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
        }`}
      >
        <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t.tabs.tools}</span>
      </button>
    </div>
  );
};
