import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applyRateLimit, errorResponse } from "@/lib/api-utils";
import { searchCitiesInIndia } from "@/lib/providers/geocoding";
import { logger } from "@/lib/logger";

const SearchSchema = z.object({
  q: z.string().max(100).default(""),
});

export async function GET(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = SearchSchema.safeParse(searchParams);

    if (!parseResult.success) {
      return errorResponse("Invalid search parameters.", 400);
    }

    const { q } = parseResult.data;
    const cities = await searchCitiesInIndia(q);

    return NextResponse.json({ results: cities });
  } catch (error) {
    logger.error("Geocoding search route error:", error);
    return errorResponse("Unable to complete location search. Please retry.", 502);
  }
}
