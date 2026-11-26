import { GoogleGenAI } from "@google/genai";
import { GuidanceResponse } from "@/types/guidance";
import { GuidanceResponseSchema } from "@/lib/validation/schemas";
import { generateRuleBasedGuidance, RuleEngineInput } from "@/lib/rules/rule-engine";
import {
  AIRWISE_SYSTEM_PROMPT,
  buildUserPrompt,
  GEMINI_RESPONSE_SCHEMA,
  UserPromptData,
} from "@/lib/prompt";

export async function generateAiGuidance(
  input: RuleEngineInput
): Promise<GuidanceResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

  // Hard Rule 4: If no Gemini key is provided, gracefully fall back to deterministic rule-based engine
  if (!apiKey) {
    return generateRuleBasedGuidance(input);
  }

  const promptData: UserPromptData = {
    city: input.city,
    aqi: input.aqi,
    pm25: input.pm25,
    pm10: input.pm10,
    category: input.category,
    source: input.source,
    timestampIst: input.timestampIst,
    profile: input.profile,
  };

  const userPrompt = buildUserPrompt(promptData);

  // Attempt with retry once
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        config: {
          systemInstruction: AIRWISE_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: GEMINI_RESPONSE_SCHEMA,
          temperature: 0.2, // Low temperature for deterministic, factual adherence
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error("Empty response returned from Gemini API");
      }

      const parsedJson = JSON.parse(responseText);

      // Validate schema with Zod
      const validated = GuidanceResponseSchema.parse({
        sourceEngine: "gemini",
        healthAdvisory: parsedJson.healthAdvisory,
        sections: parsedJson.sections,
        generatedAtIst: input.timestampIst,
      });

      return validated;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // If first attempt failed, loop will retry once
    }
  }

  // On repeated failure, log error and fall back to rules
  console.warn("Gemini API call failed after 2 attempts, falling back to rule-based engine:", lastError?.message);
  return generateRuleBasedGuidance(input);
}
