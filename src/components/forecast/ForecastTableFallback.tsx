import React from "react";
import { HourlyForecastPoint } from "@/types/air-quality";

interface ForecastTableFallbackProps {
  forecast: HourlyForecastPoint[];
}

export const ForecastTableFallback: React.FC<ForecastTableFallbackProps> = ({ forecast }) => {
  return (
    <div className="overflow-x-auto max-h-72 border border-slate-200 dark:border-slate-800 rounded-xl">
      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <caption className="sr-only">Hourly Air Quality Forecast Table</caption>
        <thead className="bg-slate-50 dark:bg-slate-800 font-semibold sticky top-0 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th scope="col" className="p-2.5">
              Time
            </th>
            <th scope="col" className="p-2.5">
              CPCB AQI
            </th>
            <th scope="col" className="p-2.5">
              Category
            </th>
            <th scope="col" className="p-2.5">
              PM2.5 (µg/m³)
            </th>
            <th scope="col" className="p-2.5">
              Recommendation
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {forecast.map((h, i) => (
            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-2.5 font-medium">{h.hourLabel}</td>
              <td className="p-2.5 font-bold">{h.aqi}</td>
              <td className="p-2.5">{h.category}</td>
              <td className="p-2.5">{h.pm25}</td>
              <td className="p-2.5 capitalize">{h.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
