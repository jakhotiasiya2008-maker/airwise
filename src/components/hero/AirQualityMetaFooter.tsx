"use client";

import React, { useState, useEffect } from "react";
import { Database, Clock, RefreshCw, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface AirQualityMetaFooterProps {
  source: string;
  timestampUtc: string;
  timestampIst: string;
  isModelled?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AirQualityMetaFooter: React.FC<AirQualityMetaFooterProps> = ({
  source,
  timestampUtc,
  timestampIst,
  isModelled,
  onRefresh,
  isRefreshing = false,
}) => {
  const { t } = useLanguage();
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    const updateElapsed = (): void => {
      const diffMs = Date.now() - new Date(timestampUtc).getTime();
      const mins = Math.max(0, Math.floor(diffMs / 60000));
      setMinutesAgo(mins);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 60000);
    return () => clearInterval(interval);
  }, [timestampUtc]);

  return (
    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5" title="Data provider">
          <Database className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>
            {t.source}:{" "}
            <strong className="font-semibold text-slate-700 dark:text-slate-300">{source}</strong>
          </span>
        </div>

        <div
          className="flex items-center gap-1.5"
          title="Official measurement time in Indian Standard Time"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>
            {t.measured}:{" "}
            <strong className="font-semibold text-slate-700 dark:text-slate-300">
              {timestampIst}
            </strong>
            <span className="text-slate-400 ml-1">
              ({minutesAgo === 0 ? "just now" : `${minutesAgo}m ago`})
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{t.refresh}</span>
          </button>
        )}

        {isModelled && (
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50 text-[11px]">
            <Info className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>{t.modelledNote}</span>
          </div>
        )}
      </div>
    </div>
  );
};
