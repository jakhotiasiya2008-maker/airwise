import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applyRateLimit, errorResponse } from "@/lib/api-utils";
import { defaultAirQualityProvider } from "@/lib/providers/open-meteo";
import { AQ_CACHE_TTL_MS, serverCache } from "@/lib/cache/memory-cache";
import { logger } from "@/lib/logger";

const QuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  city: z.string().max(100).optional(),
});

export async function GET(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = QuerySchema.safeParse(searchParams);

    if (!parseResult.success) {
      return errorResponse("Invalid latitude or longitude coordinates.", 400);
    }

    const { lat, lon, city = "Detected Location" } = parseResult.data;
    const cacheKey = `aq:${lat.toFixed(3)}:${lon.toFixed(3)}`;

    const cached = serverCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const reading = await defaultAirQualityProvider.fetchCurrentAirQuality(lat, lon, city);
    serverCache.set(cacheKey, reading, AQ_CACHE_TTL_MS);

    return NextResponse.json(reading);
  } catch (error) {
    logger.error("Air quality route error:", error);
    return errorResponse("Unable to fetch live air quality data at this time. Please retry.", 502);
  }
}
