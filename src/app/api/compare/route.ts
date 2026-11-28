import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit, errorResponse } from "@/lib/api-utils";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { defaultAirQualityProvider } from "@/lib/providers/open-meteo";
import { AQ_CACHE_TTL_MS, serverCache } from "@/lib/cache/memory-cache";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawIds = request.nextUrl.searchParams.get("cities") || "delhi,mumbai,bengaluru";
    const requestedIds = rawIds
      .split(",")
      .map((id) => id.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 4);

    const selectedCities = DEFAULT_CITIES.filter((c) => requestedIds.includes(c.id.toString()));

    // If none matched, default to Delhi, Mumbai, Bengaluru
    const targetCities = selectedCities.length > 0 ? selectedCities : DEFAULT_CITIES.slice(0, 3);

    // Fetch in parallel
    const readings = await Promise.all(
      targetCities.map(async (city) => {
        const cacheKey = `aq:${city.latitude.toFixed(3)}:${city.longitude.toFixed(3)}`;
        const cached = serverCache.get(cacheKey);
        if (cached) {
          return { city, reading: cached };
        }

        try {
          const fresh = await defaultAirQualityProvider.fetchCurrentAirQuality(
            city.latitude,
            city.longitude,
            city.name
          );
          serverCache.set(cacheKey, fresh, AQ_CACHE_TTL_MS);
          return { city, reading: fresh };
        } catch (err) {
          logger.warn(`Failed air quality fetch for compare city ${city.name}:`, err);
          return { city, reading: null };
        }
      })
    );

    return NextResponse.json({ comparisons: readings });
  } catch (error) {
    logger.error("Compare route error:", error);
    return errorResponse("Failed to fetch city comparison data.", 502);
  }
}
