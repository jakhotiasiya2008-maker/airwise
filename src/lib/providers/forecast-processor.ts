import { HourlyForecastPoint } from "@/types/air-quality";
import { calculateCpcbAqi } from "@/lib/cpcb/calculator";

export interface HourlyForecastResult {
  hourlyForecast: HourlyForecastPoint[];
  bestWindow?: { start: string; end: string; reason: string };
  avoidWindow?: { start: string; end: string; reason: string };
}

interface RawHourlyData {
  time?: string[];
  pm2_5?: number[];
  pm10?: number[];
}

export function processHourlyForecast(
  hourly: RawHourlyData | undefined,
  fallbackPm25: number,
  fallbackPm10: number
): HourlyForecastResult {
  if (!hourly || !Array.isArray(hourly.time)) {
    return { hourlyForecast: [] };
  }

  const times: string[] = hourly.time;
  const pm25Arr: number[] = hourly.pm2_5 || [];
  const pm10Arr: number[] = hourly.pm10 || [];

  const nowIsoPrefix = new Date().toISOString().slice(0, 13);
  let startIndex = times.findIndex((t) => t.startsWith(nowIsoPrefix));
  if (startIndex === -1) startIndex = 0;

  const next24Times = times.slice(startIndex, startIndex + 24);
  const hourlyForecast: HourlyForecastPoint[] = next24Times.map((t, i) => {
    const idx = startIndex + i;
    const hPm25 = Math.round((pm25Arr[idx] || fallbackPm25) * 10) / 10;
    const hPm10 = Math.round((pm10Arr[idx] || fallbackPm10) * 10) / 10;
    const calc = calculateCpcbAqi(hPm25, hPm10);

    const dateObj = new Date(t);
    const hourLabel = dateObj.toLocaleTimeString("en-IN", {
      hour: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    let rec: "optimal" | "acceptable" | "avoid" = "acceptable";
    if (calc.category === "Good" || calc.category === "Satisfactory") {
      rec = "optimal";
    } else if (calc.category === "Very Poor" || calc.category === "Severe") {
      rec = "avoid";
    }

    return {
      time: t,
      hourLabel,
      pm25: hPm25,
      pm10: hPm10,
      aqi: calc.aqi,
      category: calc.category,
      recommendation: rec,
    };
  });

  let bestWindow: { start: string; end: string; reason: string } | undefined;
  let avoidWindow: { start: string; end: string; reason: string } | undefined;

  if (hourlyForecast.length > 0) {
    const sortedByAqi = [...hourlyForecast].sort((a, b) => a.aqi - b.aqi);
    const best = sortedByAqi[0];
    const worst = sortedByAqi[sortedByAqi.length - 1];

    bestWindow = {
      start: best.hourLabel,
      end: `${best.hourLabel} - 3 hrs later`,
      reason: `Lowest predicted diurnal AQI (~${best.aqi}) due to maximum solar vertical dispersion.`,
    };

    avoidWindow = {
      start: worst.hourLabel,
      end: "Early morning / Night",
      reason: `Peak nocturnal thermal inversion trap (~${worst.aqi} AQI).`,
    };
  }

  return { hourlyForecast, bestWindow, avoidWindow };
}
