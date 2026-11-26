"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CityLocation, AirQualityReading } from "@/types/air-quality";
import { HouseholdProfile, PersonaPreset } from "@/types/profile";
import { GuidanceResponse } from "@/types/guidance";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { AirQualityHero } from "@/components/AirQualityHero";
import { PersonaSelector } from "@/components/PersonaSelector";
import { ProfileModal } from "@/components/ProfileModal";
import { HealthAdvisoryBanner } from "@/components/HealthAdvisoryBanner";
import { GuidanceSectionView } from "@/components/GuidanceSectionView";
import { CompareCitiesView } from "@/components/CompareCitiesView";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";

const PROFILE_STORAGE_KEY = "airwise_india_profile";
const PERSONA_STORAGE_KEY = "airwise_india_persona_id";

export default function HomePage() {
  // Default to Delhi (NCR) and flagship "Vulnerable Family" persona
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITIES[0]);
  const [activePersonaId, setActivePersonaId] = useState<string>("vulnerable_family");
  const [profile, setProfile] = useState<HouseholdProfile>(PERSONA_PRESETS[0].profile);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Data states
  const [airQuality, setAirQuality] = useState<AirQualityReading | null>(null);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load persisted profile from localStorage on mount
  useEffect(() => {
    try {
      const savedPersona = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (savedPersona) {
        setActivePersonaId(savedPersona);
      }
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
  }, []);

  // Fetch live air quality and guidance
  const loadData = useCallback(async (city: CityLocation, currentProfile: HouseholdProfile) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch live air quality (Real API: Open-Meteo)
      const aqUrl = `/api/air-quality?lat=${city.latitude}&lon=${city.longitude}&city=${encodeURIComponent(
        city.name
      )}`;
      const aqRes = await fetch(aqUrl);

      if (!aqRes.ok) {
        throw new Error("Unable to fetch live air quality reading. Please try again.");
      }

      const aqData: AirQualityReading = await aqRes.json();
      setAirQuality(aqData);

      // 2. Fetch AI / Rule-Based Guidance
      const guidanceRes = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
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
        throw new Error("Failed to generate guidance. Please try again.");
      }

      const guidanceData: GuidanceResponse = await guidanceRes.json();
      setGuidance(guidanceData);
    } catch (err: unknown) {
      console.error("Data loading error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on city or profile change
  useEffect(() => {
    loadData(currentCity, profile);
  }, [currentCity, profile, loadData]);

  // Handle preset selection
  const handleSelectPreset = (preset: PersonaPreset) => {
    setActivePersonaId(preset.id);
    setProfile(preset.profile);
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, preset.id);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(preset.profile));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  // Handle saving custom profile
  const handleSaveCustomProfile = (newProfile: HouseholdProfile) => {
    setProfile(newProfile);
    setActivePersonaId("custom");
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, "custom");
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  const activePreset = PERSONA_PRESETS.find((p) => p.id === activePersonaId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header
        onOpenProfile={() => setIsProfileModalOpen(true)}
        engine={isLoading ? "loading" : guidance?.sourceEngine || "rule-based"}
        activePersonaName={activePreset ? activePreset.name : "Custom Profile"}
      />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* City and Location Search */}
        <LocationSearch
          currentCity={currentCity}
          onSelectCity={(city) => setCurrentCity(city)}
          isLoading={isLoading}
        />

        {/* Persona Selector (Highlighting Vulnerable Families / Chosen Persona) */}
        <PersonaSelector
          currentProfile={profile}
          activePersonaId={activePersonaId}
          onSelectPreset={handleSelectPreset}
          onOpenCustomModal={() => setIsProfileModalOpen(true)}
        />

        {/* Loading State with Accessible Live Region */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State with Retry Button */}
        {!isLoading && error && (
          <ErrorDisplay
            message={error}
            onRetry={() => loadData(currentCity, profile)}
          />
        )}

        {/* Live Content */}
        {!isLoading && !error && airQuality && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Air Panel (Hard Rules: exact numbers, IST timestamp, source, CPCB categories) */}
            <AirQualityHero
              reading={airQuality}
              selectedCityName={currentCity.name}
            />

            {/* Top Tailored Health Advisory with Disclaimer */}
            {guidance && (
              <HealthAdvisoryBanner advisory={guidance.healthAdvisory} />
            )}

            {/* AI / Rule-Based Guidance Sections (3 sections x 3-5 cards with "Why" & "Impact") */}
            {guidance && <GuidanceSectionView guidance={guidance} />}

            {/* Compare Cities Mini-View (Real data) */}
            <CompareCitiesView />
          </div>
        )}
      </main>

      {/* Profile Drawer / Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveCustomProfile}
      />

      {/* Semantic Accessible Footer */}
      <footer
        role="contentinfo"
        className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              AirWise India • PromptWars Challenge 6
            </p>
            <p>
              Data: Open-Meteo Air Quality & CPCB NAQI standards. AI engine: Gemini 2.5 Flash with deterministic fallback.
            </p>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <p>WCAG 2.2 AA Compliant • Zero committed secrets</p>
            <p>Non-medical educational smog advisory</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
