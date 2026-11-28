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
import { Table } from "lucide-react";
import { ForecastTooltip } from "./forecast/ForecastTooltip";
import { ForecastTableFallback } from "./forecast/ForecastTableFallback";
import { ForecastWindowPills } from "./forecast/ForecastWindowPills";

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
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.forecast.subtitle}</p>
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
      <ForecastWindowPills
        bestWindow={bestWindow}
        avoidWindow={avoidWindow}
        bestLabel={t.forecast.bestWindow}
        avoidLabel={t.forecast.avoidWindow}
      />

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
              <Tooltip content={<ForecastTooltip />} />
              <ReferenceLine
                y={100}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: "Satisfactory (100)",
                  fill: "#10b981",
                  fontSize: 10,
                  position: "insideTopLeft",
                }}
              />
              <ReferenceLine
                y={200}
                stroke="#f97316"
                strokeDasharray="3 3"
                label={{
                  value: "Poor (200)",
                  fill: "#f97316",
                  fontSize: 10,
                  position: "insideTopLeft",
                }}
              />
              <ReferenceLine
                y={400}
                stroke="#dc2626"
                strokeDasharray="3 3"
                label={{
                  value: "Severe (400)",
                  fill: "#dc2626",
                  fontSize: 10,
                  position: "insideTopLeft",
                }}
              />
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
        <ForecastTableFallback forecast={forecast} />
      )}
    </section>
  );
};
