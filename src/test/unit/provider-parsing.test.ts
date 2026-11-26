import { describe, it, expect, vi, beforeEach } from "vitest";
import { OpenMeteoAirQualityProvider } from "@/lib/providers/open-meteo";

describe("OpenMeteoAirQualityProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses air quality data correctly", async () => {
    const mockApiResponse = {
      current: {
        time: "2026-11-27T00:00",
        pm10: 165.4,
        pm2_5: 98.2,
        us_aqi: 173,
        european_aqi: 85,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const provider = new OpenMeteoAirQualityProvider();
    const result = await provider.fetchCurrentAirQuality(28.6139, 77.209, "Delhi (NCR)");

    expect(result.stationOrLocation).toBe("Delhi (NCR)");
    expect(result.pm25).toBe(98.2);
    expect(result.pm10).toBe(165.4);
    expect(result.usAqi).toBe(173);
    expect(result.cpcbCategory).toBe("Poor");
    expect(result.timestampIst).toContain("IST");
    expect(result.isModelled).toBe(true);
  });

  it("throws friendly error when API call fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const provider = new OpenMeteoAirQualityProvider();
    await expect(
      provider.fetchCurrentAirQuality(28.6139, 77.209, "Delhi (NCR)")
    ).rejects.toThrow("Open-Meteo API returned status 500");
  });
});
