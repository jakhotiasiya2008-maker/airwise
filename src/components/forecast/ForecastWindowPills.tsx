import React from "react";
import { Sun, AlertTriangle } from "lucide-react";

interface ForecastWindowPillsProps {
  bestWindow?: { start: string; end: string; reason: string };
  avoidWindow?: { start: string; end: string; reason: string };
  bestLabel: string;
  avoidLabel: string;
}

export const ForecastWindowPills: React.FC<ForecastWindowPillsProps> = ({
  bestWindow,
  avoidWindow,
  bestLabel,
  avoidLabel,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {bestWindow && (
        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
          <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300 block">
              {bestLabel}: {bestWindow.start}
            </span>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5">
              {bestWindow.reason}
            </p>
          </div>
        </div>
      )}

      {avoidWindow && (
        <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-rose-950 dark:text-rose-300 block">
              {avoidLabel}: {avoidWindow.start}
            </span>
            <p className="text-[11px] text-rose-800 dark:text-rose-400 mt-0.5">
              {avoidWindow.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
