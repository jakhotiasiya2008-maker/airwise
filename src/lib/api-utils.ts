import { NextRequest, NextResponse } from "next/server";
import { apiRateLimiter } from "@/lib/rate-limit/in-memory-limiter";
import { AppError, ErrorCode, ApiErrorResponse } from "@/lib/errors/app-error";

/**
 * Extracts client IP for rate limiting from forwarded headers or connection info.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Applies in-memory token bucket rate limiting per IP.
 * Returns a 429 response if limit exceeded, or null if allowed.
 */
export function applyRateLimit(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const { allowed, remaining, resetInMs } = apiRateLimiter.check(ip);

  if (!allowed) {
    const retrySecs = Math.ceil(resetInMs / 1000);
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: retrySecs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retrySecs.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  }
  return null;
}

/**
 * Standardized API error response builder supporting both AppError and raw string messages.
 */
export function errorResponse(
  messageOrError: string | AppError,
  status = 500,
  code: ErrorCode = "INTERNAL_SERVER_ERROR"
): NextResponse {
  if (AppError.isAppError(messageOrError)) {
    return NextResponse.json(
      {
        error: messageOrError.message,
        code: messageOrError.code,
        details: messageOrError.details,
      },
      { status: messageOrError.statusCode }
    );
  }

  return NextResponse.json(
    {
      error: messageOrError,
      code,
    },
    { status }
  );
}
