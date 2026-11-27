import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getGeocoding } from "@/app/api/geocoding/route";
import { GET as getCompare } from "@/app/api/compare/route";
import { POST as postChat } from "@/app/api/chat/route";
import { defaultAirQualityProvider } from "@/lib/providers/open-meteo";

describe("API Routes Comprehensive Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/geocoding", () => {
    it("returns popular cities for empty query string", async () => {
      const req = new NextRequest("http://localhost:3000/api/geocoding?q=");
      const res = await getGeocoding(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.results.length).toBeGreaterThan(0);
    });

    it("returns search results for valid Indian query", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 101,
              name: "Noida",
              country_code: "IN",
              country: "India",
              admin1: "Uttar Pradesh",
              latitude: 28.53,
              longitude: 77.39,
            },
          ],
        }),
      } as Response);

      const req = new NextRequest("http://localhost:3000/api/geocoding?q=Noida");
      const res = await getGeocoding(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.results.length).toBe(1);
      expect(json.results[0].name).toBe("Noida");
    });
  });

  describe("GET /api/compare", () => {
    it("returns comparisons for default metro cities when parameter is omitted", async () => {
      vi.spyOn(defaultAirQualityProvider, "fetchCurrentAirQuality").mockResolvedValue({
        aqi: 180,
        cpcbCategory: "Moderate",
        pm25: 75,
        pm10: 120,
        source: "Open-Meteo",
        stationOrLocation: "Delhi",
        latitude: 28.61,
        longitude: 77.23,
        timestampUtc: "2026-11-27T12:00:00Z",
        timestampIst: "27 Nov 2026, 5:30 PM IST",
        isModelled: true,
      });

      const req = new NextRequest("http://localhost:3000/api/compare");
      const res = await getCompare(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.comparisons.length).toBeGreaterThanOrEqual(1);
    });

    it("fetches air quality for requested cities list", async () => {
      vi.spyOn(defaultAirQualityProvider, "fetchCurrentAirQuality").mockResolvedValue({
        aqi: 120,
        cpcbCategory: "Moderate",
        pm25: 45,
        pm10: 90,
        source: "Open-Meteo",
        stationOrLocation: "Mumbai",
        latitude: 19.07,
        longitude: 72.87,
        timestampUtc: "2026-11-27T12:00:00Z",
        timestampIst: "27 Nov 2026, 5:30 PM IST",
        isModelled: true,
      });

      const req = new NextRequest("http://localhost:3000/api/compare?cities=delhi,mumbai");
      const res = await getCompare(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.comparisons.length).toBe(2);
      expect(json.comparisons[0].reading).not.toBeNull();
    });
  });

  describe("POST /api/chat", () => {
    it("returns 400 when question is missing or too short", async () => {
      const req = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: "a" }),
      });
      const res = await postChat(req);
      expect(res.status).toBe(400);
    });

    it("returns a grounded answer using deterministic fallback", async () => {
      const req = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          question: "Can I go jogging this morning in Delhi?",
          city: "Delhi",
          aqi: 320,
          pm25: 180,
          pm10: 280,
          category: "Very Poor",
          profile: { hasYoungChildren: true },
          language: "en",
        }),
      });

      const res = await postChat(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.answer).toContain("Outdoor running or morning walks are strictly unadvisable");
      expect(json.sourceEngine).toBe("rule-based");
    });
  });
});
