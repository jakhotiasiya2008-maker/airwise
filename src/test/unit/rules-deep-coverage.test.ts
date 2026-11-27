import { describe, it, expect } from "vitest";
import { generateRuleBasedGuidance } from "@/lib/rules/rule-engine";
import { buildHealthAdvisory } from "@/lib/rules/advisory";
import { buildDailyRoutinesCards } from "@/lib/rules/routines";
import { buildIndoorAirCards } from "@/lib/rules/indoor";
import { buildSustainableAlternativesCards } from "@/lib/rules/alternatives";
import { HouseholdProfile, CommuteMode } from "@/types/profile";

describe("Deep Rule Engine Coverage for All Personas & Categories", () => {
  const baseProfile: HouseholdProfile = {
    hasYoungChildren: false,
    hasSeniors: false,
    hasStudents: false,
    isDailyCommuter: false,
    hasRespiratorySensitivity: false,
    commuteMode: "walk",
    hasAirPurifier: false,
    hasIndoorPlants: false,
  };

  it("builds HealthAdvisory for Poor, Moderate, and Good categories", () => {
    // Poor
    const poorAdv = buildHealthAdvisory("Poor", 240, 110, baseProfile, false);
    expect(poorAdv.severity).toBe("high");
    expect(poorAdv.headline).toContain("Poor Air Quality");

    // Poor with vulnerable members
    const poorAdvVuln = buildHealthAdvisory("Poor", 240, 110, baseProfile, true);
    expect(poorAdvVuln.sensitiveGroupWarning).toContain("Children's higher respiration rate");

    // Moderate with respiratory sensitivity
    const modAdv = buildHealthAdvisory(
      "Moderate",
      150,
      65,
      { ...baseProfile, hasRespiratorySensitivity: true },
      false
    );
    expect(modAdv.severity).toBe("moderate");
    expect(modAdv.sensitiveGroupWarning).toContain("Keep prescribed quick-relief inhalers");

    // Satisfactory / Good
    const goodAdv = buildHealthAdvisory("Good", 45, 15, baseProfile, false);
    expect(goodAdv.severity).toBe("mild");
    expect(goodAdv.headline).toContain("Acceptable Air Quality");
  });

  it("builds DailyRoutinesCards across all commute modes", () => {
    const modes: CommuteMode[] = ["bike", "car", "metro", "bus", "walk"];

    for (const mode of modes) {
      const cards = buildDailyRoutinesCards("Poor", true, {
        ...baseProfile,
        commuteMode: mode,
      });
      expect(cards.length).toBeGreaterThan(0);
      expect(cards[0].urgency).toBeDefined();
    }
  });

  it("builds DailyRoutinesCards with non-poor air quality and senior presence", () => {
    const seniorCards = buildDailyRoutinesCards("Moderate", false, {
      ...baseProfile,
      hasSeniors: true,
    });
    expect(seniorCards.some((c) => c.id === "routine-vulnerable-care")).toBe(true);

    const normalCards = buildDailyRoutinesCards("Satisfactory", false, baseProfile);
    expect(normalCards.some((c) => c.id === "routine-timing-normal")).toBe(true);
    expect(normalCards.some((c) => c.id === "routine-hydration-diet")).toBe(true);
  });

  it("builds IndoorAirCards with purifier ownership, plants, and without either", () => {
    // With purifier & plants
    const cardsWithBoth = buildIndoorAirCards("Very Poor", true, {
      ...baseProfile,
      hasAirPurifier: true,
      hasIndoorPlants: true,
    });
    expect(cardsWithBoth.some((c) => c.id === "indoor-purifier-cadr")).toBe(true);
    expect(cardsWithBoth.some((c) => c.id === "indoor-filter-maintenance")).toBe(true);
    expect(cardsWithBoth.some((c) => c.id === "indoor-plants-reality")).toBe(true);

    // Without purifier (DIY sealing) & without plants (wet mopping)
    const cardsWithout = buildIndoorAirCards("Severe", true, {
      ...baseProfile,
      hasAirPurifier: false,
      hasIndoorPlants: false,
    });
    expect(cardsWithout.some((c) => c.id === "indoor-diy-sealing")).toBe(true);
    expect(cardsWithout.some((c) => c.id === "indoor-wet-mopping")).toBe(true);
    expect(cardsWithout.some((c) => c.id === "indoor-sources-combustion")).toBe(true);
  });

  it("builds SustainableAlternativesCards for metro commuters and non-metro", () => {
    const metroCards = buildSustainableAlternativesCards("Poor", {
      ...baseProfile,
      commuteMode: "metro",
    });
    expect(metroCards[0].action).toContain("Continue prioritizing metro rail");

    const carCards = buildSustainableAlternativesCards("Poor", {
      ...baseProfile,
      commuteMode: "car",
    });
    expect(carCards[0].action).toContain("Replace at least 2 private car or two-wheeler trips");
  });

  it("generates complete rule-based guidance payload", () => {
    const result = generateRuleBasedGuidance({
      aqi: 220,
      pm25: 105,
      pm10: 190,
      category: "Poor",
      city: "Kolkata",
      source: "Open-Meteo",
      timestampIst: "4:00 PM IST",
      profile: baseProfile,
    });

    expect(result.sourceEngine).toBe("rule-based");
    expect(result.sections.dailyRoutines.cards.length).toBeGreaterThan(0);
    expect(result.sections.indoorAir.cards.length).toBeGreaterThan(0);
    expect(result.sections.sustainableAlternatives.cards.length).toBeGreaterThan(0);
  });
});
