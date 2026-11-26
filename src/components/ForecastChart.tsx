"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { HourlyForecastPoint } from "@/types/air-quality";
import { useLanguage } from "@/lib/i18n/context";
import { Sun, AlertTriangle, Table } from "lucide-react";

interface ForecastChartProps {
  forecast?: HourlyForecastPoint[];
  bestWindow?: { start: string; end: string; reason: string };
  avoidWindow?: { start: string; end: string; reason: string };
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  forecast = [],
  bestWindow,
  avoidWindow,
}) => {
  const { t } = useLanguage();
  const [showTableFallback, setShowTableFallback] = useState(false);

  if (!forecast || forecast.length === 0) return null;

  return (
    <section
      aria-label="24-Hour Air Quality Forecast Chart"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.forecast.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.forecast.subtitle}
          </p>
        </div>

        {/* Table toggle button for accessibility */}
        <button
          type="button"
          onClick={() => setShowTableFallback(!showTableFallback)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 self-start sm:self-auto py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          aria-expanded={showTableFallback}
        >
          <Table className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showTableFallback ? "Show Visual Chart" : "Text Table View"}</span>
        </button>
      </div>

      {/* Window Callout Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bestWindow && (
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
            <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300 block">
                {t.forecast.bestWindow}: {bestWindow.start}
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
                {t.forecast.avoidWindow}: {avoidWindow.start}
              </span>
              <p className="text-[11px] text-rose-800 dark:text-rose-400 mt-0.5">
                {avoidWindow.reason}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Chart or Table Fallback */}
      {!showTableFallback ? (
        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hourLabel"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                interval={2}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, "auto"]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as HourlyForecastPoint;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700 space-y-1">
                        <span className="font-bold block text-blue-400">{data.hourLabel}</span>
                        <div className="flex items-center gap-1.5">
                          <span>CPCB AQI:</span>
                          <strong className="text-sm font-extrabold">{data.aqi}</strong>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800">
                            {data.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          PM2.5: {data.pm25} µg/m³ • PM10: {data.pm10} µg/m³
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Reference line for CPCB Satisfactory standard (100) */}
              <ReferenceLine y={100} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Satisfactory (100)", fill: "#10b981", fontSize: 10, position: "insideTopLeft" }} />
              {/* Reference line for CPCB Poor threshold (200) */}
              <ReferenceLine y={200} stroke="#f97316" strokeDasharray="3 3" label={{ value: "Poor (200)", fill: "#f97316", fontSize: 10, position: "insideTopLeft" }} />
              {/* Reference line for Severe threshold (400) */}
              <ReferenceLine y={400} stroke="#dc2626" strokeDasharray="3 3" label={{ value: "Severe (400)", fill: "#dc2626", fontSize: 10, position: "insideTopLeft" }} />

              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#aqiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Accessible Text Table Fallback */
        <div className="overflow-x-auto max-h-72 border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <caption className="sr-only">Hourly Air Quality Forecast Table</caption>
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold sticky top-0 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th scope="col" className="p-2.5">Time</th>
                <th scope="col" className="p-2.5">CPCB AQI</th>
                <th scope="col" className="p-2.5">Category</th>
                <th scope="col" className="p-2.5">PM2.5 (µg/m³)</th>
                <th scope="col" className="p-2.5">Recommendation</th>
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
      )}
    </section>
  );
};
