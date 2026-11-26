import { AirQualityProvider, AirQualityReading, HourlyForecastPoint } from "@/types/air-quality";
import { calculateCpcbAqi } from "@/lib/cpcb/calculator";

export class OpenMeteoAirQualityProvider implements AirQualityProvider {
  name = "Open-Meteo Air Quality API";

  async fetchCurrentAirQuality(
    lat: number,
    lon: number,
    locationName = "Detected Location"
  ): Promise<AirQualityReading> {
    const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", lat.toFixed(4));
    url.searchParams.set("longitude", lon.toFixed(4));
    url.searchParams.set("current", "pm10,pm2_5,us_aqi,european_aqi");
    url.searchParams.set("hourly", "pm10,pm2_5,us_aqi");
    url.searchParams.set("forecast_days", "2");
    url.searchParams.set("timezone", "Asia/Kolkata");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "AirWiseIndia/2.0",
        },
        next: { revalidate: 600 },
      });

      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;

      if (!current) {
        throw new Error("No current air quality data returned from Open-Meteo");
      }

      const pm25 = typeof current.pm2_5 === "number" ? Math.max(0, Math.round(current.pm2_5 * 10) / 10) : 0;
      const pm10 = typeof current.pm10 === "number" ? Math.max(0, Math.round(current.pm10 * 10) / 10) : 0;
      const usAqi = typeof current.us_aqi === "number" ? current.us_aqi : undefined;
      const europeanAqi = typeof current.european_aqi === "number" ? current.european_aqi : undefined;

      const { aqi, category } = calculateCpcbAqi(pm25, pm10);

      // Process 24-hour forecast
      let hourlyForecast: HourlyForecastPoint[] = [];
      let bestWindow: { start: string; end: string; reason: string } | undefined;
      let avoidWindow: { start: string; end: string; reason: string } | undefined;

      if (data.hourly && Array.isArray(data.hourly.time)) {
        const times: string[] = data.hourly.time;
        const pm25Arr: number[] = data.hourly.pm2_5 || [];
        const pm10Arr: number[] = data.hourly.pm10 || [];

        // Find current time index or start from now
        const nowIsoPrefix = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
        let startIndex = times.findIndex((t) => t.startsWith(nowIsoPrefix));
        if (startIndex === -1) startIndex = 0;

        const next24Times = times.slice(startIndex, startIndex + 24);
        hourlyForecast = next24Times.map((t, i) => {
          const idx = startIndex + i;
          const hPm25 = Math.round((pm25Arr[idx] || pm25) * 10) / 10;
          const hPm10 = Math.round((pm10Arr[idx] || pm10) * 10) / 10;
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

        // Compute best and worst windows
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
      }

      const now = new Date();
      const istFormatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      return {
        aqi,
        cpcbCategory: category,
        pm25,
        pm10,
        usAqi,
        europeanAqi,
        source: "Open-Meteo CAMS Atmospheric Composition Model",
        stationOrLocation: locationName,
        latitude: lat,
        longitude: lon,
        timestampUtc: now.toISOString(),
        timestampIst: `${istFormatter.format(now)} IST`,
        isModelled: true,
        hourlyForecast,
        bestWindow,
        avoidWindow,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const defaultAirQualityProvider = new OpenMeteoAirQualityProvider();
