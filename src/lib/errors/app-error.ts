/**
 * Centralized typed Application Error class and standardized API response types.
 */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "PROVIDER_UNAVAILABLE"
  | "GEOLOCATION_DENIED"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    timestamp: string;
  };
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, code: ErrorCode = "INTERNAL_SERVER_ERROR", statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toResponse(): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: new Date().toISOString(),
      },
    };
  }

  public static isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
  }
}
