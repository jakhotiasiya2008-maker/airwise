import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateAiGuidance } from "@/lib/ai/gemini";
import { RuleEngineInput } from "@/lib/rules/rule-engine";

describe("Gemini Guidance AI Service", () => {
  const mockInput: RuleEngineInput = {
    city: "Delhi",
    aqi: 312,
    pm25: 180,
    pm10: 280,
    category: "Very Poor",
    source: "Open-Meteo",
    timestampIst: "2:00 PM IST",
    profile: {
      hasYoungChildren: true,
      hasSeniors: true,
      hasStudents: false,
      isDailyCommuter: false,
      hasRespiratorySensitivity: true,
      commuteMode: "car",
      hasAirPurifier: true,
      hasIndoorPlants: false,
    },
  };

  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns rule-based guidance when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;

    const guidance = await generateAiGuidance(mockInput);

    expect(guidance.sourceEngine).toBe("rule-based");
    expect(guidance.sections.dailyRoutines.cards.length).toBeGreaterThan(0);
    expect(guidance.sections.indoorAir.cards.length).toBeGreaterThan(0);
    expect(guidance.sections.sustainableAlternatives.cards.length).toBeGreaterThan(0);
    expect(guidance.healthAdvisory.severity).toBe("severe");
  });

  it("falls back to rule engine if Gemini throws an error", async () => {
    process.env.GEMINI_API_KEY = "test_key_fake";

    const guidance = await generateAiGuidance(mockInput);
    expect(guidance.sourceEngine).toBe("rule-based");
    expect(guidance.healthAdvisory.disclaimer).toContain("Informational guidance only");
  });
});
