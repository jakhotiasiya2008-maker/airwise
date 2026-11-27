"use client";

import { useState, useCallback, useEffect } from "react";
import { CityLocation, AirQualityReading } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { GuidanceResponse } from "@/types/guidance";

const LAST_AQ_STORAGE_KEY = "airwise_last_aq_reading";

export interface UseAirQualityDataReturn {
  airQuality: AirQualityReading | null;
  guidance: GuidanceResponse | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  loadData: (city: CityLocation, profile: HouseholdProfile, isManualRefresh?: boolean) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook to manage fetching and caching of live air quality data
 * and AI/rule-based guidance, including offline recovery.
 */
export function useAirQualityData(
  city: CityLocation,
  profile: HouseholdProfile,
  language: string
): UseAirQualityDataReturn {
  const [airQuality, setAirQuality] = useState<AirQualityReading | null>(null);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cached reading on initial client mount if offline
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LAST_AQ_STORAGE_KEY);
      if (cached && !navigator.onLine) {
        setAirQuality(JSON.parse(cached));
      }
    } catch {}
  }, []);

  const loadData = useCallback(
    async (targetCity: CityLocation, currentProfile: HouseholdProfile, isManualRefresh = false) => {
      if (isManualRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch live air quality reading (Open-Meteo)
        const aqUrl = `/api/air-quality?lat=${targetCity.latitude}&lon=${targetCity.longitude}&city=${encodeURIComponent(
          targetCity.name
        )}`;
        const aqRes = await fetch(aqUrl);

        if (!aqRes.ok) {
          throw new Error("Unable to fetch live air quality reading. Please try again.");
        }

        const aqData: AirQualityReading = await aqRes.json();
        setAirQuality(aqData);

        // Cache for offline resilience
        try {
          localStorage.setItem(LAST_AQ_STORAGE_KEY, JSON.stringify(aqData));
        } catch {}

        // 2. Fetch AI or Rule-Based Guidance
        const guidanceRes = await fetch("/api/guidance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: targetCity.name,
            latitude: targetCity.latitude,
            longitude: targetCity.longitude,
            aqi: aqData.aqi,
            pm25: aqData.pm25,
            pm10: aqData.pm10,
            category: aqData.cpcbCategory,
            source: aqData.source,
            timestampIst: aqData.timestampIst,
            profile: currentProfile,
          }),
        });

        if (!guidanceRes.ok) {
          throw new Error("Failed to generate personalized guidance. Please try again.");
        }

        const guidanceData: GuidanceResponse = await guidanceRes.json();
        setGuidance(guidanceData);
      } catch (err: unknown) {
        console.error("Data loading error:", err);
        setError(err instanceof Error ? err.message : "An unexpected network error occurred.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Trigger whenever city, profile, or language changes
  useEffect(() => {
    loadData(city, profile);
  }, [city, profile, language, loadData]);

  const clearError = useCallback(() => setError(null), []);

  return {
    airQuality,
    guidance,
    isLoading,
    isRefreshing,
    error,
    loadData,
    clearError,
  };
}
