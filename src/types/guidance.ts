export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface GuidanceCard {
  id: string;
  title: string;
  action: string;
  whyThisMatters: string;
  expectedImpact: string;
  urgency: UrgencyLevel;
  tags?: string[];
}

export interface GuidanceSection {
  id: "daily_routines" | "indoor_air" | "sustainable_alternatives";
  title: string;
  subtitle: string;
  cards: GuidanceCard[];
}

export interface HealthAdvisory {
  severity: "mild" | "moderate" | "high" | "severe";
  headline: string;
  summary: string;
  sensitiveGroupWarning?: string;
  disclaimer: string;
}

export interface GuidanceResponse {
  sourceEngine: "gemini" | "rule-based";
  healthAdvisory: HealthAdvisory;
  sections: {
    dailyRoutines: GuidanceSection;
    indoorAir: GuidanceSection;
    sustainableAlternatives: GuidanceSection;
  };
  generatedAtIst: string;
}
