import React from "react";
import { HourlyForecastPoint } from "@/types/air-quality";

interface ForecastTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: HourlyForecastPoint }>;
}

export const ForecastTooltip: React.FC<ForecastTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700 space-y-1">
        <span className="font-bold block text-blue-400">{data.hourLabel}</span>
        <div className="flex items-center gap-1.5">
          <span>CPCB AQI:</span>
          <strong className="text-sm font-extrabold">{data.aqi}</strong>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800">{data.category}</span>
        </div>
        <div className="text-[11px] text-slate-300">
          PM2.5: {data.pm25} µg/m³ • PM10: {data.pm10} µg/m³
        </div>
      </div>
    );
  }
  return null;
};
