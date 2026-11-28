"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";

interface AirQualityMetricsGridProps {
  pm25: number;
  pm10: number;
  usAqi?: number;
}

export const AirQualityMetricsGrid: React.FC<AirQualityMetricsGridProps> = ({
  pm25,
  pm10,
  usAqi,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 text-center min-w-[100px]">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t.pm25}
        </span>
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{pm25}</span>
          <span className="text-[11px] text-slate-500">µg/m³</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">CPCB std: 60</p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 text-center min-w-[100px]">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t.pm10}
        </span>
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{pm10}</span>
          <span className="text-[11px] text-slate-500">µg/m³</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">CPCB std: 100</p>
      </div>

      {usAqi !== undefined && (
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 text-center min-w-[100px]">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            US AQI
          </span>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{usAqi}</span>
            <span className="text-[11px] text-slate-500">index</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">EPA standard</p>
        </div>
      )}
    </div>
  );
};
