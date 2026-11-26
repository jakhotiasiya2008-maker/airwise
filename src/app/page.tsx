"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CityLocation, AirQualityReading } from "@/types/air-quality";
import { HouseholdProfile, PersonaPreset } from "@/types/profile";
import { GuidanceResponse } from "@/types/guidance";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { useLanguage } from "@/lib/i18n/context";

// Components
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { AirQualityHero } from "@/components/AirQualityHero";
import { ForecastChart } from "@/components/ForecastChart";
import { PersonaSelector } from "@/components/PersonaSelector";
import { ProfileModal } from "@/components/ProfileModal";
import { HealthAdvisoryBanner } from "@/components/HealthAdvisoryBanner";
import { GuidanceSectionView } from "@/components/GuidanceSectionView";
import { AskFollowUpChat } from "@/components/AskFollowUpChat";
import { CompareCitiesView } from "@/components/CompareCitiesView";
import { ShareSummaryModal } from "@/components/ShareSummaryModal";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { CommandPalette } from "@/components/CommandPalette";
import { BottomNavBar } from "@/components/BottomNavBar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";

const PROFILE_STORAGE_KEY = "airwise_india_profile";
const PERSONA_STORAGE_KEY = "airwise_india_persona_id";
const ONBOARDING_KEY = "airwise_onboarding_completed_v2";
const THEME_STORAGE_KEY = "airwise_theme_dark";
const LAST_AQ_STORAGE_KEY = "airwise_last_aq_reading";

export default function HomePage() {
  const { language } = useLanguage();

  // Primary state
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITIES[0]);
  const [activePersonaId, setActivePersonaId] = useState<string>("vulnerable_family");
  const [profile, setProfile] = useState<HouseholdProfile>(PERSONA_PRESETS[0].profile);

  // Dialog & Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Theme state (Dark/Light mode)
  const [isDark, setIsDark] = useState(false);

  // Network offline state
  const [isOffline, setIsOffline] = useState(false);

  // Data states
  const [airQuality, setAirQuality] = useState<AirQualityReading | null>(null);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load theme and onboarding on client mount
  useEffect(() => {
    try {
      // Check online status
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Check dark mode
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === "true");
      } else {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }

      // Check onboarding
      const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY);
      if (!onboardingCompleted) {
        setIsOnboardingOpen(true);
      }

      // Load profile & persona
      const savedPersona = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (savedPersona) setActivePersonaId(savedPersona);

      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      // Offline shell cache check
      const lastCachedReading = localStorage.getItem(LAST_AQ_STORAGE_KEY);
      if (lastCachedReading && !navigator.onLine) {
        setAirQuality(JSON.parse(lastCachedReading));
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    } catch (e) {
      console.warn("Storage initialization notice:", e);
    }
  }, []);

  // Sync dark class to html document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, String(next));
      } catch (e) {
        console.warn("Could not save theme:", e);
      }
      return next;
    });
  };

  // Fetch live air quality and guidance
  const loadData = useCallback(
    async (city: CityLocation, currentProfile: HouseholdProfile, isManualRefresh = false) => {
      if (isManualRefresh) setIsRefreshing(true);
      else setIsLoading(true);
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

        // Cache for offline usage
        try {
          localStorage.setItem(LAST_AQ_STORAGE_KEY, JSON.stringify(aqData));
        } catch {}

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

  // Trigger on city, profile, or language change
  useEffect(() => {
    loadData(currentCity, profile);
  }, [currentCity, profile, language, loadData]);

  // Handle Preset selection
  const handleSelectPreset = (preset: PersonaPreset) => {
    setActivePersonaId(preset.id);
    setProfile(preset.profile);
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, preset.id);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(preset.profile));
    } catch {}
  };

  // Handle saving custom profile
  const handleSaveCustomProfile = (newProfile: HouseholdProfile) => {
    setProfile(newProfile);
    setActivePersonaId("custom");
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, "custom");
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch {}
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (city: CityLocation, completedProfile: HouseholdProfile) => {
    setCurrentCity(city);
    setProfile(completedProfile);
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(completedProfile));
    } catch {}
  };

  const handleOnboardingSkip = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {}
  };

  // Background tint calculation based on CPCB category (subtle gradient, maintaining 4.5:1 contrast)
  const getCategoryBgClass = () => {
    if (!airQuality) return "bg-slate-50 dark:bg-slate-950";
    switch (airQuality.cpcbCategory) {
      case "Severe":
        return "bg-gradient-to-b from-purple-50/40 via-slate-50 to-slate-50 dark:from-purple-950/20 dark:via-slate-950 dark:to-slate-950";
      case "Very Poor":
        return "bg-gradient-to-b from-rose-50/40 via-slate-50 to-slate-50 dark:from-rose-950/20 dark:via-slate-950 dark:to-slate-950";
      case "Poor":
        return "bg-gradient-to-b from-orange-50/40 via-slate-50 to-slate-50 dark:from-orange-950/20 dark:via-slate-950 dark:to-slate-950";
      case "Moderate":
        return "bg-gradient-to-b from-amber-50/30 via-slate-50 to-slate-50 dark:from-amber-950/15 dark:via-slate-950 dark:to-slate-950";
      case "Satisfactory":
      case "Good":
      default:
        return "bg-gradient-to-b from-emerald-50/30 via-slate-50 to-slate-50 dark:from-emerald-950/15 dark:via-slate-950 dark:to-slate-950";
    }
  };

  const activePreset = PERSONA_PRESETS.find((p) => p.id === activePersonaId);

  return (
    <div className={`min-h-screen flex flex-col ${getCategoryBgClass()} text-slate-900 dark:text-slate-100 transition-colors pb-16 sm:pb-0`}>
      {/* Top Header */}
      <Header
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        engine={isLoading ? "loading" : guidance?.sourceEngine || "rule-based"}
        activePersonaName={activePreset ? activePreset.name : "Custom"}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isOffline={isOffline}
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
            {/* Live Air Panel with Radial Gauge, Headline, & Details */}
            <AirQualityHero
              reading={airQuality}
              selectedCityName={currentCity.name}
              onRefresh={() => loadData(currentCity, profile, true)}
              onOpenShare={() => setIsShareModalOpen(true)}
              isRefreshing={isRefreshing}
            />

            {/* Top Tailored Health Advisory with Disclaimer */}
            {guidance && (
              <HealthAdvisoryBanner advisory={guidance.healthAdvisory} />
            )}

            {/* 24-Hour Forecast Chart (Hourly diurnal curve & best window) */}
            <ForecastChart
              forecast={airQuality.hourlyForecast}
              bestWindow={airQuality.bestWindow}
              avoidWindow={airQuality.avoidWindow}
            />

            {/* Guidance Sections (Daily Routines, Indoor Air, Sustainable Alt, Interactive Tools) */}
            {guidance && (
              <GuidanceSectionView
                guidance={guidance}
                aqi={airQuality.aqi}
                category={airQuality.cpcbCategory}
                profile={profile}
              />
            )}

            {/* Ask Follow-Up AI Chat Box (Prompt-injection safe grounded assistant) */}
            <AskFollowUpChat
              city={currentCity.name}
              aqi={airQuality.aqi}
              pm25={airQuality.pm25}
              pm10={airQuality.pm10}
              category={airQuality.cpcbCategory}
              profile={profile}
            />

            {/* Compare Cities Mini-View (Real data across Indian metros) */}
            <CompareCitiesView />
          </div>
        )}
      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCity={(city) => setCurrentCity(city)}
        onSelectPreset={handleSelectPreset}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      {/* Share Summary Modal */}
      {airQuality && (
        <ShareSummaryModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          city={currentCity.name}
          reading={airQuality}
          guidance={guidance}
        />
      )}

      {/* Profile Drawer / Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveCustomProfile}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTools={() => {
          // Trigger tools section scroll or focus
          const toolsTabBtn = document.querySelector('[aria-selected="false"][role="tab"]:last-child') as HTMLButtonElement;
          if (toolsTabBtn) toolsTabBtn.click();
        }}
      />

      {/* Accessible Footer */}
      <footer
        role="contentinfo"
        className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              AirWise India • PromptWars Challenge 6
            </p>
            <p>
              Open-Meteo CAMS Model & CPCB NAQI standards. AI engine: Gemini 2.5 Flash with deterministic rule fallback.
            </p>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <p>WCAG 2.2 AA Compliant • PWA Ready • Zero committed secrets</p>
            <p>Non-medical educational smog advisory</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
