import { z } from "zod";

export const CommuteModeEnum = z.enum([
  "metro",
  "bus",
  "car",
  "bike",
  "walk",
  "auto_rickshaw",
  "wfh",
]);

export const HouseholdProfileSchema = z.object({
  hasYoungChildren: z.boolean().default(false),
  hasSeniors: z.boolean().default(false),
  hasStudents: z.boolean().default(false),
  isDailyCommuter: z.boolean().default(false),
  hasRespiratorySensitivity: z.boolean().default(false),
  commuteMode: CommuteModeEnum.default("metro"),
  hasAirPurifier: z.boolean().default(false),
  hasIndoorPlants: z.boolean().default(false),
  customNotes: z.string().max(300).optional(),
});

export const CpcbCategoryEnum = z.enum([
  "Good",
  "Satisfactory",
  "Moderate",
  "Poor",
  "Very Poor",
  "Severe",
]);

export const UrgencyLevelEnum = z.enum(["low", "medium", "high", "critical"]);

export const GuidanceCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(120),
  action: z.string().min(10).max(400),
  whyThisMatters: z.string().min(10).max(500),
  expectedImpact: z.string().min(10).max(400),
  urgency: UrgencyLevelEnum,
  tags: z.array(z.string()).optional(),
});

export const GuidanceSectionSchema = z.object({
  id: z.enum(["daily_routines", "indoor_air", "sustainable_alternatives"]),
  title: z.string().min(3).max(100),
  subtitle: z.string().min(5).max(200),
  cards: z.array(GuidanceCardSchema).min(3).max(5),
});

export const HealthAdvisorySchema = z.object({
  severity: z.enum(["mild", "moderate", "high", "severe"]),
  headline: z.string().min(5).max(150),
  summary: z.string().min(15).max(500),
  sensitiveGroupWarning: z.string().max(400).optional(),
  disclaimer: z.string().min(10).max(300),
});

export const GuidanceResponseSchema = z.object({
  sourceEngine: z.enum(["gemini", "rule-based"]),
  healthAdvisory: HealthAdvisorySchema,
  sections: z.object({
    dailyRoutines: GuidanceSectionSchema,
    indoorAir: GuidanceSectionSchema,
    sustainableAlternatives: GuidanceSectionSchema,
  }),
  generatedAtIst: z.string(),
});

export const GuidanceRequestSchema = z.object({
  city: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  aqi: z.number().min(0).max(1000),
  pm25: z.number().min(0).max(1000),
  pm10: z.number().min(0).max(1000),
  category: CpcbCategoryEnum,
  source: z.string().max(150),
  timestampIst: z.string().max(100),
  profile: HouseholdProfileSchema,
});
