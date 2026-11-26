import React from "react";
import { AirQualityReading } from "@/types/air-quality";
import { getCpcbCategoryInfo } from "@/lib/cpcb/calculator";
import { MapPin, Clock, Database, Info, AlertCircle } from "lucide-react";

interface AirQualityHeroProps {
  reading: AirQualityReading;
  selectedCityName: string;
}

export const AirQualityHero: React.FC<AirQualityHeroProps> = ({
  reading,
  selectedCityName,
}) => {
  const categoryInfo = getCpcbCategoryInfo(reading.cpcbCategory);

  return (
    <section
      aria-label="Live Air Quality Summary"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-sm transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Location & Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-slate-900 dark:text-white text-base">
              {selectedCityName || reading.stationOrLocation}
            </span>
            <span className="text-xs text-slate-400">
              ({reading.latitude.toFixed(2)}°N, {reading.longitude.toFixed(2)}°E)
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {reading.aqi}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                CPCB AQI
              </span>
            </div>

            {/* CPCB Category Badge: Never color alone, always includes text & contrast */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${categoryInfo.bgClass} ${categoryInfo.colorClass} ${categoryInfo.borderClass}`}
              role="status"
              aria-label={`Air quality category: ${categoryInfo.category}. ${categoryInfo.shortDescription}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: categoryInfo.hexColor }}
                aria-hidden="true"
              />
              <span>{categoryInfo.category}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            {categoryInfo.healthImplication}
          </p>
        </div>

        {/* Right: Key Pollutant Numbers (PM2.5, PM10) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              PM 2.5
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {reading.pm25}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">µg/m³</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              CPCB std: 60 µg/m³
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              PM 10
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {reading.pm10}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">µg/m³</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              CPCB std: 100 µg/m³
            </p>
          </div>

          {reading.usAqi !== undefined && (
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5 text-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                US EPA AQI
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reading.usAqi}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">index</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Reference comparison
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Bar (Hard Rule 2: source, station, timestamp IST) */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5" title="Data provider">
            <Database className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>
              Source: <strong className="font-semibold text-slate-700 dark:text-slate-300">{reading.source}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Official measurement time in Indian Standard Time">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>
              Measured: <strong className="font-semibold text-slate-700 dark:text-slate-300">{reading.timestampIst}</strong>
            </span>
          </div>
        </div>

        {reading.isModelled && (
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
            <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Data may be atmospheric model-estimated for this coordinate</span>
          </div>
        )}
      </div>
    </section>
  );
};
