import React, { useState, useEffect, useCallback } from "react";
import { AirQualityReading, CityLocation } from "@/types/air-quality";
import { getCpcbCategoryInfo } from "@/lib/cpcb/calculator";
import { ArrowLeftRight, Loader2, RefreshCw } from "lucide-react";

interface ComparisonItem {
  city: CityLocation;
  reading: AirQualityReading | null;
}

export const CompareCitiesView: React.FC = () => {
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCompareData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/compare?cities=delhi,mumbai,bengaluru,kolkata");
      if (res.ok) {
        const data = await res.json();
        setComparisons(data.comparisons || []);
      }
    } catch (err) {
      console.warn("Failed to load comparisons:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && comparisons.length === 0) {
      fetchCompareData();
    }
  }, [isOpen, comparisons.length, fetchCompareData]);

  return (
    <section
      aria-label="Compare Indian Metros"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Compare Indian Metros (Live CPCB Data)
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-expanded={isOpen}
        >
          {isOpen ? "Hide Comparison" : "Compare Metros"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-sm text-slate-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Fetching live sensor data across Indian metros...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {comparisons.map(({ city, reading }) => {
                  if (!reading) {
                    return (
                      <div
                        key={city.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                      >
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{city.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">Data currently unavailable</p>
                      </div>
                    );
                  }

                  const categoryInfo = getCpcbCategoryInfo(reading.cpcbCategory);

                  return (
                    <div
                      key={city.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{city.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryInfo.bgClass} ${categoryInfo.colorClass} ${categoryInfo.borderClass}`}
                        >
                          {reading.cpcbCategory}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {reading.aqi}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">CPCB AQI</span>
                        </div>
                        <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                          PM2.5: <strong className="text-slate-700 dark:text-slate-300">{reading.pm25}</strong> µg/m³
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Direct real-time readings from Open-Meteo API</span>
                <button
                  type="button"
                  onClick={fetchCompareData}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Metros</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
