import { describe, it, expect } from "vitest";
import { calculateCpcbAqi, getCpcbCategory, getCpcbCategoryInfo } from "@/lib/cpcb/calculator";

describe("CPCB AQI Calculator", () => {
  it("correctly calculates Good category (AQI 0-50)", () => {
    const result = calculateCpcbAqi(15, 25);
    expect(result.aqi).toBeLessThanOrEqual(50);
    expect(result.category).toBe("Good");
  });

  it("correctly calculates Satisfactory category (AQI 51-100)", () => {
    const result = calculateCpcbAqi(45, 80);
    expect(result.aqi).toBeGreaterThanOrEqual(51);
    expect(result.aqi).toBeLessThanOrEqual(100);
    expect(result.category).toBe("Satisfactory");
  });

  it("correctly calculates Moderate category (AQI 101-200)", () => {
    const result = calculateCpcbAqi(75, 180);
    expect(result.aqi).toBeGreaterThanOrEqual(101);
    expect(result.aqi).toBeLessThanOrEqual(200);
    expect(result.category).toBe("Moderate");
  });

  it("correctly calculates Poor category (AQI 201-300)", () => {
    const result = calculateCpcbAqi(105, 280);
    expect(result.aqi).toBeGreaterThanOrEqual(201);
    expect(result.aqi).toBeLessThanOrEqual(300);
    expect(result.category).toBe("Poor");
  });

  it("correctly calculates Very Poor category (AQI 301-400)", () => {
    const result = calculateCpcbAqi(180, 390);
    expect(result.aqi).toBeGreaterThanOrEqual(301);
    expect(result.aqi).toBeLessThanOrEqual(400);
    expect(result.category).toBe("Very Poor");
  });

  it("correctly calculates Severe category (AQI 401-500)", () => {
    const result = calculateCpcbAqi(320, 520);
    expect(result.aqi).toBeGreaterThanOrEqual(401);
    expect(result.category).toBe("Severe");
  });

  it("takes the maximum of PM2.5 and PM10 sub-indices", () => {
    // High PM2.5 (Severe) but low PM10 (Moderate)
    const result = calculateCpcbAqi(260, 150);
    expect(result.aqi).toBeGreaterThanOrEqual(401);
    expect(result.category).toBe("Severe");
  });

  it("provides complete accessibility metadata for every category", () => {
    const categories = ["Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"] as const;
    for (const cat of categories) {
      const info = getCpcbCategoryInfo(cat);
      expect(info.category).toBe(cat);
      expect(info.colorClass).toBeDefined();
      expect(info.bgClass).toBeDefined();
      expect(info.hexColor).toBeDefined();
      expect(info.shortDescription).toBeDefined();
      expect(info.healthImplication).toBeDefined();
    }
  });
});
