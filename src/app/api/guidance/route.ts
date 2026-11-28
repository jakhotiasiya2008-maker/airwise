import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit, errorResponse } from "@/lib/api-utils";
import { GuidanceRequestSchema } from "@/lib/validation/schemas";
import { generateAiGuidance } from "@/lib/ai/gemini";
import { logger } from "@/lib/logger";
import {
  buildGuidanceCacheKey,
  GUIDANCE_CACHE_TTL_MS,
  hashProfile,
  serverCache,
} from "@/lib/cache/memory-cache";

export async function POST(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const parseResult = GuidanceRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const profileHash = hashProfile(data.profile as unknown as Record<string, unknown>);
    const cacheKey = buildGuidanceCacheKey(data.city, data.category, profileHash);

    const cached = serverCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const guidance = await generateAiGuidance({
      aqi: data.aqi,
      pm25: data.pm25,
      pm10: data.pm10,
      category: data.category,
      city: data.city,
      source: data.source,
      timestampIst: data.timestampIst,
      profile: data.profile,
    });

    serverCache.set(cacheKey, guidance, GUIDANCE_CACHE_TTL_MS);

    return NextResponse.json(guidance);
  } catch (error) {
    logger.error("Guidance route error:", error);
    return errorResponse("Unable to generate recommendations. Please retry.", 500);
  }
}
