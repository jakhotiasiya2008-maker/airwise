import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OpenMeteoAirQualityProvider } from "@/lib/providers/open-meteo";
import { searchCitiesInIndia } from "@/lib/providers/geocoding";

describe("OpenMeteoAirQualityProvider", () => {
  let provider: OpenMeteoAirQualityProvider;

  beforeEach(() => {
    provider = new OpenMeteoAirQualityProvider();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles network failure gracefully", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network connection dropped"));

    await expect(provider.fetchCurrentAirQuality(28.61, 77.23, "Delhi")).rejects.toThrow(
      "Network connection dropped"
    );
  });

  it("handles non-200 HTTP error responses from provider", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    } as Response);

    await expect(provider.fetchCurrentAirQuality(28.61, 77.23, "Delhi")).rejects.toThrow(
      "Open-Meteo API returned status 503"
    );
  });

  it("parses valid response and computes CPCB AQI correctly", async () => {
    const mockData = {
      latitude: 28.61,
      longitude: 77.23,
      current: {
        time: "2026-11-27T10:00",
        pm2_5: 180,
        pm10: 280,
        us_aqi: 230,
      },
      hourly: {
        time: ["2026-11-27T10:00"],
        pm2_5: [180],
        pm10: [280],
        us_aqi: [230],
      },
    };

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    const reading = await provider.fetchCurrentAirQuality(28.61, 77.23, "Delhi");
    expect(reading.pm25).toBe(180);
    expect(reading.pm10).toBe(280);
    expect(reading.aqi).toBeGreaterThan(0);
    expect(reading.cpcbCategory).toBe("Very Poor");
  });
});

describe("searchCitiesInIndia Geocoding Provider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns default popular cities when query is less than 2 characters", async () => {
    const res = await searchCitiesInIndia("a");
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].country).toBe("India");
  });

  it("searches and returns matching Indian locations", async () => {
    const mockGeocodingResponse = {
      results: [
        {
          id: 101,
          name: "Varanasi",
          country_code: "IN",
          country: "India",
          admin1: "Uttar Pradesh",
          latitude: 25.31,
          longitude: 82.97,
        },
      ],
    };

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeocodingResponse,
    } as Response);

    const results = await searchCitiesInIndia("Varanasi");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Varanasi");
    expect(results[0].country).toBe("India");
  });

  it("handles geocoding fetch error with local fallback matches", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Timeout"));
    const results = await searchCitiesInIndia("Delhi");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Delhi (NCR)");
  });
});
