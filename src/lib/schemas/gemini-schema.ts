import { Type, Schema } from "@google/genai";

// Schema definition for Gemini response format using @google/genai Schema
export const GEMINI_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    healthAdvisory: {
      type: Type.OBJECT,
      properties: {
        severity: { type: Type.STRING, enum: ["mild", "moderate", "high", "severe"] },
        headline: { type: Type.STRING },
        summary: { type: Type.STRING },
        sensitiveGroupWarning: { type: Type.STRING },
        disclaimer: { type: Type.STRING },
      },
      required: ["severity", "headline", "summary", "disclaimer"],
    },
    sections: {
      type: Type.OBJECT,
      properties: {
        dailyRoutines: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, enum: ["daily_routines"] },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  action: { type: Type.STRING },
                  whyThisMatters: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "title", "action", "whyThisMatters", "expectedImpact", "urgency"],
              },
            },
          },
          required: ["id", "title", "subtitle", "cards"],
        },
        indoorAir: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, enum: ["indoor_air"] },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  action: { type: Type.STRING },
                  whyThisMatters: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "title", "action", "whyThisMatters", "expectedImpact", "urgency"],
              },
            },
          },
          required: ["id", "title", "subtitle", "cards"],
        },
        sustainableAlternatives: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, enum: ["sustainable_alternatives"] },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  action: { type: Type.STRING },
                  whyThisMatters: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "title", "action", "whyThisMatters", "expectedImpact", "urgency"],
              },
            },
          },
          required: ["id", "title", "subtitle", "cards"],
        },
      },
      required: ["dailyRoutines", "indoorAir", "sustainableAlternatives"],
    },
  },
  required: ["healthAdvisory", "sections"],
};
