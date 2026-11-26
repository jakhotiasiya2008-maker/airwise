import { describe, it, expect } from "vitest";
import {
  HouseholdProfileSchema,
  GuidanceRequestSchema,
  GuidanceResponseSchema,
} from "@/lib/validation/schemas";

describe("Zod Validation Schemas", () => {
  it("validates valid HouseholdProfile", () => {
    const valid = {
      hasYoungChildren: true,
      hasSeniors: false,
      hasStudents: false,
      isDailyCommuter: true,
      hasRespiratorySensitivity: false,
      commuteMode: "metro",
      hasAirPurifier: true,
      hasIndoorPlants: false,
      customNotes: "Near highway",
    };
    const result = HouseholdProfileSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid commute mode", () => {
    const invalid = {
      commuteMode: "rocket_ship",
    };
    const result = HouseholdProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates GuidanceRequest with boundaries", () => {
    const validRequest = {
      city: "Delhi",
      latitude: 28.61,
      longitude: 77.2,
      aqi: 320,
      pm25: 180,
      pm10: 310,
      category: "Very Poor",
      source: "Open-Meteo",
      timestampIst: "27 Nov 2026, 12:30 AM IST",
      profile: {
        commuteMode: "car",
      },
    };
    const result = GuidanceRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("rejects coordinates outside geographical limits", () => {
    const invalidCoords = {
      city: "Invalid",
      latitude: 150, // invalid lat > 90
      longitude: 77.2,
      aqi: 100,
      pm25: 50,
      pm10: 80,
      category: "Satisfactory",
      source: "Open-Meteo",
      timestampIst: "27 Nov 2026, 12:30 AM IST",
      profile: {},
    };
    const result = GuidanceRequestSchema.safeParse(invalidCoords);
    expect(result.success).toBe(false);
  });
});
