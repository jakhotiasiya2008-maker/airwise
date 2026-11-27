"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface GuidanceProgressTrackerProps {
  progressPercent: number;
  completedCount: number;
  totalTasks: number;
}

export const GuidanceProgressTracker: React.FC<GuidanceProgressTrackerProps> = ({
  progressPercent,
  completedCount,
  totalTasks,
}) => {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 dark:border-blue-500 flex items-center justify-center font-black text-sm text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 shadow-sm shrink-0">
          {progressPercent}%
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Smog Action Plan Progress</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            <strong className="font-semibold text-slate-900 dark:text-white">
              {completedCount} of {totalTasks}
            </strong>{" "}
            {t.cards.completedCount}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
