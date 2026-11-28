import { describe, it, expect } from "vitest";
import { AppError } from "@/lib/errors/app-error";
import { errorResponse, getClientIp } from "@/lib/api-utils";
import { NextRequest } from "next/server";

describe("AppError and Error Response Helpers", () => {
  it("constructs AppError instances with status codes and optional details", () => {
    const err = new AppError("Bad request error", "VALIDATION_ERROR", 400, { field: "city" });
    expect(err.message).toBe("Bad request error");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual({ field: "city" });
  });

  it("produces standardized ApiErrorResponse using toResponse()", () => {
    const err = new AppError("Service unavailable", "PROVIDER_UNAVAILABLE", 503);
    const resp = err.toResponse();
    expect(resp.success).toBe(false);
    expect(resp.error.code).toBe("PROVIDER_UNAVAILABLE");
    expect(resp.error.message).toBe("Service unavailable");
    expect(resp.error.timestamp).toBeDefined();
  });

  it("detects AppError using static isAppError", () => {
    const appErr = new AppError("Test error");
    const stdErr = new Error("Standard error");
    expect(AppError.isAppError(appErr)).toBe(true);
    expect(AppError.isAppError(stdErr)).toBe(false);
    expect(AppError.isAppError(null)).toBe(false);
  });

  it("formats AppError into structured JSON response using errorResponse()", async () => {
    const appErr = new AppError("Rate limit hit", "RATE_LIMIT_EXCEEDED", 429);
    const res = errorResponse(appErr);
    expect(res.status).toBe(429);

    const json = await res.json();
    expect(json.error).toBe("Rate limit hit");
    expect(json.code).toBe("RATE_LIMIT_EXCEEDED");
  });

  it("formats raw string into structured JSON response using errorResponse()", async () => {
    const res = errorResponse("Something broke", 500, "INTERNAL_SERVER_ERROR");
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Something broke");
    expect(json.code).toBe("INTERNAL_SERVER_ERROR");
  });

  it("extracts client IP from request headers", () => {
    const reqWithForwarded = new NextRequest("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    expect(getClientIp(reqWithForwarded)).toBe("203.0.113.195");

    const reqWithRealIp = new NextRequest("http://localhost:3000/api/test", {
      headers: { "x-real-ip": "198.51.100.1" },
    });
    expect(getClientIp(reqWithRealIp)).toBe("198.51.100.1");

    const reqFallback = new NextRequest("http://localhost:3000/api/test");
    expect(getClientIp(reqFallback)).toBe("127.0.0.1");
  });
});
