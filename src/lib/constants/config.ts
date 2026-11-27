/**
 * Application-wide configuration constants.
 * Centralizes magic numbers, timeout values, cache TTLs, and calculation constants.
 */

export const APP_CONFIG = {
  appName: "AirWise India",
  version: "1.0.0",
  defaultModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  
  // Cache Time-To-Live in milliseconds
  cache: {
    airQualityTtlMs: 10 * 60 * 1000, // 10 minutes
    guidanceTtlMs: 20 * 60 * 1000,   // 20 minutes
    geocodingTtlMs: 60 * 60 * 1000,  // 1 hour
    cleanupIntervalMs: 5 * 60 * 1000,// 5 minutes
    maxCacheEntries: 500,
  },

  // API Rate Limiting
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequestsPerWindow: 60,
  },

  // Air Purifier Calculation Constants
  purifier: {
    recommendedAch: 4,          // Recommended Air Changes per Hour for smoggy regions
    standardCeilingHeightM: 2.8, // Typical urban Indian apartment ceiling height in meters
    cubicMetersToFeet: 35.3147,
  },

  // Commute Emission Factors (g CO2 per passenger-km)
  commute: {
    car: { co2PerKm: 170, label: "Solo Petrol/Diesel Car" },
    bike: { co2PerKm: 45, label: "Two-Wheeler Petrol Motorcycle" },
    bus: { co2PerKm: 30, label: "CNG City Transit Bus" },
    metro: { co2PerKm: 12, label: "Electric Metro Rail" },
    walk: { co2PerKm: 0, label: "Zero-Emission Walking/Cycling" },
  },

  // API Endpoints
  endpoints: {
    openMeteoAirQuality: "https://air-quality-api.open-meteo.com/v1/air-quality",
    openMeteoGeocoding: "https://geocoding-api.open-meteo.com/v1/search",
  },
} as const;
