"use client";

import React from "react";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { useLanguage } from "@/lib/i18n/context";
import { useHouseholdContext } from "@/hooks/useHouseholdContext";
import { useAirQualityData } from "@/hooks/useAirQualityData";

// Visual Components
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

/**
 * Primary AirWise India Dashboard page.
 * Orchestrates live AQI readings, customized AI/rule guidance,
 * persona selection, and interactive scenario tools.
 */
export default function HomePage() {
  const { language } = useLanguage();

  const {
    currentCity,
    setCurrentCity,
    activePersonaId,
    profile,
    isDark,
    isOffline,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isOnboardingOpen,
    toggleTheme,
    selectPreset,
    saveCustomProfile,
    completeOnboarding,
    skipOnboarding,
  } = useHouseholdContext();

  const {
    airQuality,
    guidance,
    isLoading,
    isRefreshing,
    error,
    loadData,
  } = useAirQualityData(currentCity, profile, language);

  const getCategoryBgClass = (): string => {
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
    <div
      className={`min-h-screen flex flex-col ${getCategoryBgClass()} text-slate-900 dark:text-slate-100 transition-colors pb-16 sm:pb-0`}
    >
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
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6"
      >
        {/* City and Location Search */}
        <LocationSearch
          currentCity={currentCity}
          onSelectCity={setCurrentCity}
          isLoading={isLoading}
        />

        {/* Persona Selector (Highlighting Vulnerable Families / Chosen Persona) */}
        <PersonaSelector
          currentProfile={profile}
          activePersonaId={activePersonaId}
          onSelectPreset={selectPreset}
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
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCity={setCurrentCity}
        onSelectPreset={selectPreset}
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
        onSaveProfile={saveCustomProfile}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTools={() => {
          const toolsTabBtn = document.querySelector(
            '[aria-selected="false"][role="tab"]:last-child'
          ) as HTMLButtonElement | null;
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
