import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getAirQuality } from "@/app/api/air-quality/route";
import { POST as postGuidance } from "@/app/api/guidance/route";
import { defaultAirQualityProvider } from "@/lib/providers/open-meteo";

describe("API Routes", () => {
  it("GET /api/air-quality returns 400 for invalid coordinates", async () => {
    const req = new NextRequest("http://localhost:3000/api/air-quality?lat=999&lon=77.2");
    const res = await getAirQuality(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid latitude or longitude");
  });

  it("GET /api/air-quality returns 200 with reading for valid coordinates", async () => {
    vi.spyOn(defaultAirQualityProvider, "fetchCurrentAirQuality").mockResolvedValue({
      aqi: 220,
      cpcbCategory: "Poor",
      pm25: 105,
      pm10: 215,
      source: "Mock Provider",
      stationOrLocation: "Delhi",
      latitude: 28.61,
      longitude: 77.2,
      timestampUtc: "2026-11-26T18:00:00Z",
      timestampIst: "27 Nov 2026, 12:00 AM IST",
      isModelled: true,
    });

    const req = new NextRequest("http://localhost:3000/api/air-quality?lat=28.61&lon=77.2&city=Delhi");
    const res = await getAirQuality(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.aqi).toBe(220);
    expect(data.cpcbCategory).toBe("Poor");
  });

  it("POST /api/guidance returns 400 for invalid request body", async () => {
    const req = new NextRequest("http://localhost:3000/api/guidance", {
      method: "POST",
      body: JSON.stringify({
        city: "Delhi",
        // missing required fields
      }),
    });

    const res = await postGuidance(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/guidance returns guidance response with rule-based fallback when no API key", async () => {
    const validBody = {
      city: "Noida",
      latitude: 28.53,
      longitude: 77.39,
      aqi: 310,
      pm25: 165,
      pm10: 310,
      category: "Very Poor",
      source: "Open-Meteo",
      timestampIst: "27 Nov 2026, 12:00 AM IST",
      profile: {
        hasYoungChildren: true,
        hasSeniors: false,
        hasStudents: false,
        isDailyCommuter: true,
        hasRespiratorySensitivity: true,
        commuteMode: "car",
        hasAirPurifier: true,
        hasIndoorPlants: false,
      },
    };

    const req = new NextRequest("http://localhost:3000/api/guidance", {
      method: "POST",
      body: JSON.stringify(validBody),
    });

    const res = await postGuidance(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.sourceEngine).toBeDefined();
    expect(data.healthAdvisory).toBeDefined();
    expect(data.sections.dailyRoutines.cards.length).toBeGreaterThanOrEqual(3);
  });
});
