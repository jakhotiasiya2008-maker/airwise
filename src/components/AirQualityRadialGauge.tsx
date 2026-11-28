"use client";

import React from "react";
import { getCpcbCategoryInfo } from "@/lib/cpcb/calculator";
import { CpcbCategory } from "@/types/air-quality";

interface AirQualityRadialGaugeProps {
  aqi: number;
  category: CpcbCategory;
  size?: number;
}

export const AirQualityRadialGauge: React.FC<AirQualityRadialGaugeProps> = ({
  aqi,
  category,
  size = 180,
}) => {
  const categoryInfo = getCpcbCategoryInfo(category);

  // SVG Gauge calculations (semi-circle arc or 240-degree arc)
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // 240 degree arc gauge
  const arcLength = circumference * (240 / 360);
  const maxAqi = 500;
  const clampedAqi = Math.min(maxAqi, Math.max(0, aqi));
  const progressRatio = clampedAqi / maxAqi;
  const strokeDashoffset = arcLength * (1 - progressRatio);

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size * 0.9 }}
      role="meter"
      aria-valuenow={aqi}
      aria-valuemin={0}
      aria-valuemax={500}
      aria-label={`Air Quality Index: ${aqi}, category ${category}`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-[210deg] overflow-visible"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="text-slate-200 dark:text-slate-800 transition-colors"
        />

        {/* Dynamic colored progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={categoryInfo.hexColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Values */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {aqi}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
          CPCB AQI
        </span>
        <span className="text-base mt-1" aria-hidden="true">
          {categoryInfo.emoji}
        </span>
      </div>
    </div>
  );
};
