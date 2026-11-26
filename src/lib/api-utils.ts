import { NextRequest, NextResponse } from "next/server";
import { apiRateLimiter } from "@/lib/rate-limit/in-memory-limiter";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export function applyRateLimit(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const { allowed, remaining, resetInMs } = apiRateLimiter.check(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        retryAfterSeconds: Math.ceil(resetInMs / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(resetInMs / 1000).toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  }
  return null;
}

export function errorResponse(message: string, status = 500): NextResponse {
  return NextResponse.json(
    {
      error: message,
    },
    { status }
  );
}
