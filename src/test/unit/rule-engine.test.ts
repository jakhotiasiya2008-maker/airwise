import { describe, it, expect } from "vitest";
import { generateRuleBasedGuidance } from "@/lib/rules/rule-engine";
import { HouseholdProfile } from "@/types/profile";

describe("Deterministic Rule-Based Guidance Engine", () => {
  const baseProfile: HouseholdProfile = {
    hasYoungChildren: true,
    hasSeniors: true,
    hasStudents: false,
    isDailyCommuter: false,
    hasRespiratorySensitivity: true,
    commuteMode: "metro",
    hasAirPurifier: true,
    hasIndoorPlants: true,
  };

  it("generates complete guidance structure with source labeled rule-based", () => {
    const guidance = generateRuleBasedGuidance({
      aqi: 385,
      pm25: 220,
      pm10: 380,
      category: "Very Poor",
      city: "Delhi (NCR)",
      source: "Open-Meteo CAMS Model",
      timestampIst: "27 Nov 2026, 12:30 AM IST",
      profile: baseProfile,
    });

    expect(guidance.sourceEngine).toBe("rule-based");
    expect(guidance.healthAdvisory).toBeDefined();
    expect(guidance.healthAdvisory.disclaimer).toContain("Not medical advice");

    // Must have all 3 sections
    expect(guidance.sections.dailyRoutines).toBeDefined();
    expect(guidance.sections.indoorAir).toBeDefined();
    expect(guidance.sections.sustainableAlternatives).toBeDefined();

    // Each section must have 3-5 cards
    expect(guidance.sections.dailyRoutines.cards.length).toBeGreaterThanOrEqual(3);
    expect(guidance.sections.dailyRoutines.cards.length).toBeLessThanOrEqual(5);

    expect(guidance.sections.indoorAir.cards.length).toBeGreaterThanOrEqual(3);
    expect(guidance.sections.indoorAir.cards.length).toBeLessThanOrEqual(5);

    expect(guidance.sections.sustainableAlternatives.cards.length).toBeGreaterThanOrEqual(3);
    expect(guidance.sections.sustainableAlternatives.cards.length).toBeLessThanOrEqual(5);
  });

  it("ensures every card has title, action, whyThisMatters, expectedImpact, and urgency", () => {
    const guidance = generateRuleBasedGuidance({
      aqi: 420,
      pm25: 280,
      pm10: 450,
      category: "Severe",
      city: "Noida",
      source: "Open-Meteo CAMS Model",
      timestampIst: "27 Nov 2026, 12:30 AM IST",
      profile: baseProfile,
    });

    const allCards = [
      ...guidance.sections.dailyRoutines.cards,
      ...guidance.sections.indoorAir.cards,
      ...guidance.sections.sustainableAlternatives.cards,
    ];

    for (const card of allCards) {
      expect(card.title).toBeTruthy();
      expect(card.action).toBeTruthy();
      expect(card.whyThisMatters).toBeTruthy();
      expect(card.expectedImpact).toBeTruthy();
      expect(["low", "medium", "high", "critical"]).toContain(card.urgency);
    }
  });

  it("adapts commute advice when profile commuteMode is bike", () => {
    const bikeProfile: HouseholdProfile = {
      ...baseProfile,
      commuteMode: "bike",
      isDailyCommuter: true,
    };

    const guidance = generateRuleBasedGuidance({
      aqi: 340,
      pm25: 195,
      pm10: 320,
      category: "Very Poor",
      city: "Gurugram",
      source: "Open-Meteo",
      timestampIst: "27 Nov 2026, 12:30 AM IST",
      profile: bikeProfile,
    });

    const bikeCard = guidance.sections.dailyRoutines.cards.find(
      (c) =>
        c.title.toLowerCase().includes("two-wheeler") ||
        c.title.toLowerCase().includes("respirator")
    );
    expect(bikeCard).toBeDefined();
    expect(bikeCard?.action).toContain("N95");
  });

  it("includes scientifically honest advice regarding indoor plants", () => {
    const guidance = generateRuleBasedGuidance({
      aqi: 310,
      pm25: 160,
      pm10: 290,
      category: "Very Poor",
      city: "Mumbai",
      source: "Open-Meteo",
      timestampIst: "27 Nov 2026, 12:30 AM IST",
      profile: { ...baseProfile, hasIndoorPlants: true },
    });

    const plantCard = guidance.sections.indoorAir.cards.find((c) =>
      c.title.toLowerCase().includes("plant")
    );
    expect(plantCard).toBeDefined();
    expect(plantCard?.whyThisMatters).toContain("NASA");
    expect(plantCard?.action).toContain("do NOT rely on them to scrub PM2.5");
  });
});
