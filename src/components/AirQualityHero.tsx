"use client";

import React, { useState, useEffect } from "react";
import { AirQualityReading } from "@/types/air-quality";
import { getCpcbCategoryInfo } from "@/lib/cpcb/calculator";
import { AirQualityRadialGauge } from "@/components/AirQualityRadialGauge";
import { useLanguage } from "@/lib/i18n/context";
import { MapPin, Clock, Database, Info, RefreshCw, Share2 } from "lucide-react";

interface AirQualityHeroProps {
  reading: AirQualityReading;
  selectedCityName: string;
  onRefresh?: () => void;
  onOpenShare?: () => void;
  isRefreshing?: boolean;
}

export const AirQualityHero: React.FC<AirQualityHeroProps> = ({
  reading,
  selectedCityName,
  onRefresh,
  onOpenShare,
  isRefreshing = false,
}) => {
  const { t } = useLanguage();
  const categoryInfo = getCpcbCategoryInfo(reading.cpcbCategory);

  // Time elapsed since measurement
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    const updateElapsed = () => {
      const diffMs = Date.now() - new Date(reading.timestampUtc).getTime();
      const mins = Math.max(0, Math.floor(diffMs / 60000));
      setMinutesAgo(mins);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 60000);
    return () => clearInterval(interval);
  }, [reading.timestampUtc]);

  // One-line plain-language headline tailored to Indian smog
  const getPlainLanguageHeadline = () => {
    switch (reading.cpcbCategory) {
      case "Severe":
        return "Air is severe today — suspend outdoor play and keep bedroom purifiers running.";
      case "Very Poor":
        return "Heavy smog layer detected — avoid early morning runs and wear an N95 mask outside.";
      case "Poor":
        return "Air quality is poor — limit prolonged outdoor exertion, especially for seniors.";
      case "Moderate":
        return "Moderate air — acceptable for most, but keep rescue inhalers handy if sensitive.";
      case "Satisfactory":
        return "Satisfactory conditions — great time for outdoor exercise and airing out rooms.";
      case "Good":
      default:
        return "Clean air day! Enjoy outdoor activities without restriction.";
    }
  };

  return (
    <section
      aria-label="Live Air Quality Hero Panel"
      className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-7 shadow-sm transition-all"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Radial Gauge + Category Label */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <AirQualityRadialGauge aqi={reading.aqi} category={reading.cpcbCategory} size={170} />

          <div className="space-y-2 max-w-md">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {selectedCityName || reading.stationOrLocation}
              </span>
              <span className="text-xs text-slate-400">
                ({reading.latitude.toFixed(2)}°N, {reading.longitude.toFixed(2)}°E)
              </span>
            </div>

            {/* Category Badge with Emoji & Text */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryInfo.bgClass} ${categoryInfo.colorClass} ${categoryInfo.borderClass}`}
                role="status"
                aria-label={`Air quality category: ${categoryInfo.category}. ${categoryInfo.shortDescription}`}
              >
                <span>{categoryInfo.emoji}</span>
                <span>{categoryInfo.category}</span>
              </div>

              {/* Share Button */}
              {onOpenShare && (
                <button
                  type="button"
                  onClick={onOpenShare}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-colors"
                  aria-label="Share current air quality report"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Share</span>
                </button>
              )}
            </div>

            {/* Plain-Language Headline */}
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {getPlainLanguageHeadline()}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {categoryInfo.healthImplication}
            </p>
          </div>
        </div>

        {/* Right: Key Pollutant Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 text-center min-w-[100px]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.pm25}
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {reading.pm25}
              </span>
              <span className="text-[11px] text-slate-500">µg/m³</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">CPCB std: 60</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 text-center min-w-[100px]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.pm10}
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {reading.pm10}
              </span>
              <span className="text-[11px] text-slate-500">µg/m³</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">CPCB std: 100</p>
          </div>

          {reading.usAqi !== undefined && (
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 text-center min-w-[100px]">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                US AQI
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {reading.usAqi}
                </span>
                <span className="text-[11px] text-slate-500">index</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">EPA standard</p>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Bar (Hard Rule 2: source, station, timestamp IST + refreshed X mins ago) */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5" title="Data provider">
            <Database className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>
              {t.source}: <strong className="font-semibold text-slate-700 dark:text-slate-300">{reading.source}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Official measurement time in Indian Standard Time">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>
              {t.measured}: <strong className="font-semibold text-slate-700 dark:text-slate-300">{reading.timestampIst}</strong>
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

          {reading.isModelled && (
            <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50 text-[11px]">
              <Info className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>{t.modelledNote}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
