/**
 * Application Logger
 * Provides safe, structured logging across server and client modules.
 * Suppresses debug and noisy outputs in production environments.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

function formatMessage(level: LogLevel, args: unknown[]): unknown[] {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level.toUpperCase()}]`, ...args];
}

export const logger: Logger = {
  debug: (...args: unknown[]) => {
    if (!isProduction && !isTest) {
      // eslint-disable-next-line no-console
      console.debug(...formatMessage("debug", args));
    }
  },
  info: (...args: unknown[]) => {
    if (!isProduction && !isTest) {
      // eslint-disable-next-line no-console
      console.info(...formatMessage("info", args));
    }
  },
  warn: (...args: unknown[]) => {
    if (!isTest) {
      // eslint-disable-next-line no-console
      console.warn(...formatMessage("warn", args));
    }
  },
  error: (...args: unknown[]) => {
    if (!isTest) {
      // eslint-disable-next-line no-console
      console.error(...formatMessage("error", args));
    }
  },
};
