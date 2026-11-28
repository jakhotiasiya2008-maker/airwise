import { describe, it, expect } from "vitest";
import { processHourlyForecast } from "@/lib/providers/forecast-processor";

describe("processHourlyForecast", () => {
  it("returns empty forecast when hourly data is undefined or invalid", () => {
    const result = processHourlyForecast(undefined, 50, 80);
    expect(result.hourlyForecast).toEqual([]);
    expect(result.bestWindow).toBeUndefined();
    expect(result.avoidWindow).toBeUndefined();
  });

  it("processes 24h hourly points correctly and calculates diurnal windows", () => {
    const sampleTimes: string[] = [];
    const pm25Arr: number[] = [];
    const pm10Arr: number[] = [];

    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() + i * 3600 * 1000);
      sampleTimes.push(d.toISOString());
      // Morning higher smog, afternoon lower
      const val = 40 + Math.sin(i / 3) * 30;
      pm25Arr.push(val);
      pm10Arr.push(val * 1.6);
    }

    const rawHourly = {
      time: sampleTimes,
      pm2_5: pm25Arr,
      pm10: pm10Arr,
    };

    const result = processHourlyForecast(rawHourly, 45, 75);
    expect(result.hourlyForecast.length).toBeLessThanOrEqual(24);
    expect(result.hourlyForecast[0]).toHaveProperty("hourLabel");
    expect(result.hourlyForecast[0]).toHaveProperty("aqi");
    expect(result.hourlyForecast[0]).toHaveProperty("recommendation");

    expect(result.bestWindow).toBeDefined();
    expect(result.bestWindow?.reason).toContain("diurnal AQI");
    expect(result.avoidWindow).toBeDefined();
    expect(result.avoidWindow?.reason).toContain("inversion");
  });
});
