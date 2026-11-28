import { AirQualityProvider, AirQualityReading } from "@/types/air-quality";
import { calculateCpcbAqi } from "@/lib/cpcb/calculator";
import { APP_CONFIG } from "@/lib/constants/config";
import { processHourlyForecast } from "./forecast-processor";

export class OpenMeteoAirQualityProvider implements AirQualityProvider {
  name = "Open-Meteo Air Quality API";

  async fetchCurrentAirQuality(
    lat: number,
    lon: number,
    locationName = "Detected Location"
  ): Promise<AirQualityReading> {
    const url = new URL(APP_CONFIG.endpoints.openMeteoAirQuality);
    url.searchParams.set("latitude", lat.toFixed(4));
    url.searchParams.set("longitude", lon.toFixed(4));
    url.searchParams.set("current", "pm10,pm2_5,us_aqi,european_aqi");
    url.searchParams.set("hourly", "pm10,pm2_5,us_aqi");
    url.searchParams.set("forecast_days", "2");
    url.searchParams.set("timezone", "Asia/Kolkata");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG.defaults.timeoutMs.airQuality);

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

      const pm25 =
        typeof current.pm2_5 === "number" ? Math.max(0, Math.round(current.pm2_5 * 10) / 10) : 0;
      const pm10 =
        typeof current.pm10 === "number" ? Math.max(0, Math.round(current.pm10 * 10) / 10) : 0;
      const usAqi = typeof current.us_aqi === "number" ? current.us_aqi : undefined;
      const europeanAqi =
        typeof current.european_aqi === "number" ? current.european_aqi : undefined;

      const { aqi, category } = calculateCpcbAqi(pm25, pm10);
      const { hourlyForecast, bestWindow, avoidWindow } = processHourlyForecast(
        data.hourly,
        pm25,
        pm10
      );

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
