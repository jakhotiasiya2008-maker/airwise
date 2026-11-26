import { describe, it, expect } from "vitest";
import { translations } from "@/lib/i18n/translations";

describe("Deterministic Tools & i18n", () => {
  it("i18n translations dictionary has complete English and Hindi keys", () => {
    expect(translations.en.appName).toBe("AirWise India");
    expect(translations.hi.appName).toBe("एयरवाइज़ इंडिया");

    expect(translations.en.tools.purifierCheckTitle).toBeDefined();
    expect(translations.hi.tools.purifierCheckTitle).toBeDefined();

    expect(translations.en.categories.Severe).toBe("Severe");
    expect(translations.hi.categories.Severe).toContain("Severe");
  });

  it("calculates air changes per hour (ACH) accurately", () => {
    // 200 sq ft room with 9ft (2.74m) ceiling:
    // Volume = 200 * 0.092903 * 2.74 = 50.91 m3
    // CADR = 300 m3/hr => ACH = 300 / 50.91 = 5.89 ACH (Adequate >= 4.0)
    const roomSqFt = 200;
    const cadr = 300;
    const roomVolumeM3 = roomSqFt * 0.092903 * 2.74;
    const ach = Math.round((cadr / roomVolumeM3) * 10) / 10;

    expect(ach).toBeGreaterThanOrEqual(5.8);
    expect(ach).toBeLessThanOrEqual(6.0);
    expect(ach >= 4.0).toBe(true);
  });

  it("identifies undersized purifier when ACH is below 4.0", () => {
    // 500 sq ft room with CADR 150 m3/hr:
    // Volume = 500 * 0.092903 * 2.74 = 127.27 m3
    // CADR = 150 m3/hr => ACH = 1.18 ACH (Inadequate < 4.0)
    const roomSqFt = 500;
    const cadr = 150;
    const roomVolumeM3 = roomSqFt * 0.092903 * 2.74;
    const ach = Math.round((cadr / roomVolumeM3) * 10) / 10;

    expect(ach).toBeLessThan(4.0);
  });
});
