import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceResponse } from "@/types/guidance";
import { buildHealthAdvisory } from "./advisory";
import { buildDailyRoutinesCards } from "./routines";
import { buildIndoorAirCards } from "./indoor";
import { buildSustainableAlternativesCards } from "./alternatives";

export interface RuleEngineInput {
  aqi: number;
  pm25: number;
  pm10: number;
  category: CpcbCategory;
  city: string;
  source: string;
  timestampIst: string;
  profile: HouseholdProfile;
}

/**
 * Deterministic rule-based guidance engine.
 * Serves as an uncompromised zero-quota offline fallback providing science-backed,
 * actionable recommendations across daily routines, indoor air quality, and sustainable community habits.
 */
export function generateRuleBasedGuidance(input: RuleEngineInput): GuidanceResponse {
  const { aqi, pm25, category, city, profile, timestampIst } = input;
  const isSevereOrVeryPoor = category === "Severe" || category === "Very Poor";
  const isPoorOrWorse = isSevereOrVeryPoor || category === "Poor";
  const hasVulnerableMembers =
    profile.hasYoungChildren || profile.hasSeniors || profile.hasRespiratorySensitivity;

  // 1. Health Advisory
  const healthAdvisory = buildHealthAdvisory(category, aqi, pm25, profile, hasVulnerableMembers);

  // 2. Daily Routines Cards
  const dailyRoutinesCards = buildDailyRoutinesCards(category, isPoorOrWorse, profile);

  // 3. Indoor Air Cards
  const indoorAirCards = buildIndoorAirCards(category, isPoorOrWorse, profile);

  // 4. Sustainable Alternatives Cards
  const sustainableCards = buildSustainableAlternativesCards(category, profile);

  return {
    sourceEngine: "rule-based",
    healthAdvisory,
    sections: {
      dailyRoutines: {
        id: "daily_routines",
        title: "Low-Emission Daily Routines",
        subtitle: `Optimized schedules and commute safety for ${city} based on current ${category} air quality.`,
        cards: dailyRoutinesCards,
      },
      indoorAir: {
        id: "indoor_air",
        title: "Indoor Air Quality & Purification",
        subtitle: "Science-backed indoor protection, purifier guidelines, and source emission control.",
        cards: indoorAirCards,
      },
      sustainableAlternatives: {
        id: "sustainable_alternatives",
        title: "Sustainable Community Alternatives",
        subtitle: "Collective actions to lower local neighborhood emissions during pollution spikes.",
        cards: sustainableCards,
      },
    },
    generatedAtIst: timestampIst || `${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
  };
}
