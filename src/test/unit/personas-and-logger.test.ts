import { describe, it, expect, vi, beforeEach } from "vitest";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { logger } from "@/lib/logger";

describe("Persona Presets", () => {
  it("defines standard preset personas", () => {
    expect(PERSONA_PRESETS.length).toBeGreaterThanOrEqual(4);
    const ids = PERSONA_PRESETS.map((p) => p.id);
    expect(ids).toContain("vulnerable_family");
    expect(ids).toContain("two_wheeler_commuter");
    expect(ids).toContain("asthma_sensitive");
    expect(ids).toContain("student_campus");
  });

  it("ensures each preset has required metadata and profile attributes", () => {
    for (const preset of PERSONA_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.badge).toBeTruthy();
      expect(preset.tagline).toBeTruthy();
      expect(Array.isArray(preset.focusHighlights)).toBe(true);
      expect(typeof preset.profile.hasYoungChildren).toBe("boolean");
      expect(typeof preset.profile.hasSeniors).toBe("boolean");
      expect(typeof preset.profile.hasStudents).toBe("boolean");
      expect(typeof preset.profile.hasRespiratorySensitivity).toBe("boolean");
      expect(typeof preset.profile.isDailyCommuter).toBe("boolean");
      expect(typeof preset.profile.hasAirPurifier).toBe("boolean");
      expect(typeof preset.profile.hasIndoorPlants).toBe("boolean");
    }
  });
});

describe("Application Logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("executes debug, info, warn, and error without throwing", () => {
    expect(() => {
      logger.debug("Test debug message");
      logger.info("Test info message");
      logger.warn("Test warning message");
      logger.error("Test error message", new Error("Sample error"));
    }).not.toThrow();
  });
});
