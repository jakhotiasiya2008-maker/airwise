import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { HealthAdvisory } from "@/types/guidance";

/**
 * Builds deterministic health advisory messages tailored to CPCB AQI categories
 * and vulnerable household demographics (children, seniors, respiratory sensitivities).
 */
export function buildHealthAdvisory(
  category: CpcbCategory,
  aqi: number,
  pm25: number,
  profile: HouseholdProfile,
  hasVulnerableMembers: boolean
): HealthAdvisory {
  const disclaimer =
    "Informational guidance only. Not medical advice. Consult a certified medical practitioner for clinical symptoms or asthma action plans.";

  if (category === "Severe" || category === "Very Poor") {
    let headline = `Severe Air Quality Alert (AQI ${aqi})`;
    const summary = `Fine particulate PM2.5 is at ${pm25} µg/m³. At this concentration, prolonged outdoor breathing can trigger respiratory irritation, coughing, and cardiovascular strain even in healthy individuals.`;
    let sensitiveGroupWarning: string | undefined;

    if (hasVulnerableMembers) {
      headline = "Critical Protection Advisory for Vulnerable Members";
      sensitiveGroupWarning =
        "Your household includes young children, seniors, or respiratory-sensitive members. Inhalation of PM2.5 at this level deposits deep in pulmonary alveoli. Strictly suspend outdoor playtime, morning walks, and unmasked transit.";
    }

    return {
      severity: "severe",
      headline,
      summary,
      sensitiveGroupWarning,
      disclaimer,
    };
  }

  if (category === "Poor") {
    const headline = "Poor Air Quality: Precautionary Measures Recommended";
    const summary = `AQI is ${aqi} with PM2.5 at ${pm25} µg/m³. Healthy individuals may experience throat dryness and breathing discomfort on extended exertion.`;
    let sensitiveGroupWarning: string | undefined;

    if (hasVulnerableMembers) {
      sensitiveGroupWarning =
        "Children's higher respiration rate per kg and seniors' reduced lung capacity elevate risk. Limit outdoor exposure during early morning hours.";
    }

    return {
      severity: "high",
      headline,
      summary,
      sensitiveGroupWarning,
      disclaimer,
    };
  }

  if (category === "Moderate") {
    return {
      severity: "moderate",
      headline: "Moderate Air Quality: Sensitive Groups Take Note",
      summary: `AQI is currently ${aqi}. General population can continue normal routines, but people with asthma or lung ailments may notice mild respiratory irritation.`,
      sensitiveGroupWarning: profile.hasRespiratorySensitivity
        ? "Keep prescribed quick-relief inhalers accessible during transit."
        : undefined,
      disclaimer,
    };
  }

  return {
    severity: "mild",
    headline: `Acceptable Air Quality (${category})`,
    summary: `Current AQI (${aqi}) is within acceptable thresholds. Great time for outdoor exercise and airing out indoor living spaces.`,
    disclaimer,
  };
}
