"use client";

import React from "react";
import { AirQualityReading } from "@/types/air-quality";
import { getCpcbCategoryInfo } from "@/lib/cpcb/calculator";
import { AirQualityRadialGauge } from "@/components/AirQualityRadialGauge";
import { MapPin, Share2 } from "lucide-react";
import { AirQualityMetricsGrid } from "./hero/AirQualityMetricsGrid";
import { AirQualityMetaFooter } from "./hero/AirQualityMetaFooter";

interface AirQualityHeroProps {
  reading: AirQualityReading;
  selectedCityName: string;
  onRefresh?: () => void;
  onOpenShare?: () => void;
  isRefreshing?: boolean;
}

/**
 * Hero AQI Panel featuring animated radial gauge, CPCB category badge,
 * plain-language headline, fine particulate tiles (PM2.5/PM10),
 * and transparent live API data source attribution with IST timestamps.
 */
export const AirQualityHero: React.FC<AirQualityHeroProps> = ({
  reading,
  selectedCityName,
  onRefresh,
  onOpenShare,
  isRefreshing = false,
}) => {
  const categoryInfo = getCpcbCategoryInfo(reading.cpcbCategory);

  const getPlainLanguageHeadline = (): string => {
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
              <MapPin
                className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
                aria-hidden="true"
              />
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
        <AirQualityMetricsGrid pm25={reading.pm25} pm10={reading.pm10} usAqi={reading.usAqi} />
      </div>

      {/* Metadata Bar */}
      <AirQualityMetaFooter
        source={reading.source}
        timestampUtc={reading.timestampUtc}
        timestampIst={reading.timestampIst}
        isModelled={reading.isModelled}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    </section>
  );
};
