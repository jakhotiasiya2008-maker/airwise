"use client";

import React from "react";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { useLanguage } from "@/lib/i18n/context";
import { useHouseholdContext } from "@/hooks/useHouseholdContext";
import { useAirQualityData } from "@/hooks/useAirQualityData";

// Visual Components
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { PersonaSelector } from "@/components/PersonaSelector";
import { BottomNavBar } from "@/components/BottomNavBar";
import { DashboardMainView } from "@/components/dashboard/DashboardMainView";
import { DashboardModals } from "@/components/dashboard/DashboardModals";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { getCategoryBackgroundClass } from "@/components/dashboard/dashboard-helpers";

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

  const { airQuality, guidance, isLoading, isRefreshing, error, loadData } = useAirQualityData(
    currentCity,
    profile,
    language
  );

  const activePreset = PERSONA_PRESETS.find((p) => p.id === activePersonaId);
  const bgClass = getCategoryBackgroundClass(airQuality?.cpcbCategory);

  return (
    <div
      className={`min-h-screen flex flex-col ${bgClass} text-slate-900 dark:text-slate-100 transition-colors pb-16 sm:pb-0`}
    >
      <Header
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        engine={isLoading ? "loading" : guidance?.sourceEngine || "rule-based"}
        activePersonaName={activePreset ? activePreset.name : "Custom"}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isOffline={isOffline}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6"
      >
        <LocationSearch
          currentCity={currentCity}
          onSelectCity={setCurrentCity}
          isLoading={isLoading}
        />

        <PersonaSelector
          currentProfile={profile}
          activePersonaId={activePersonaId}
          onSelectPreset={selectPreset}
          onOpenCustomModal={() => setIsProfileModalOpen(true)}
        />

        <DashboardMainView
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          error={error}
          airQuality={airQuality}
          guidance={guidance}
          currentCity={currentCity}
          profile={profile}
          onRefresh={() => loadData(currentCity, profile, true)}
          onOpenShare={() => setIsShareModalOpen(true)}
          onRetry={() => loadData(currentCity, profile)}
        />
      </main>

      <DashboardModals
        isOnboardingOpen={isOnboardingOpen}
        onCompleteOnboarding={completeOnboarding}
        onSkipOnboarding={skipOnboarding}
        isCommandPaletteOpen={isCommandPaletteOpen}
        onCloseCommandPalette={() => setIsCommandPaletteOpen(false)}
        onSelectCity={setCurrentCity}
        onSelectPreset={selectPreset}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        isShareModalOpen={isShareModalOpen}
        onCloseShareModal={() => setIsShareModalOpen(false)}
        currentCityName={currentCity.name}
        airQuality={airQuality}
        guidance={guidance}
        isProfileModalOpen={isProfileModalOpen}
        onCloseProfileModal={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={saveCustomProfile}
      />

      <BottomNavBar
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTools={() => {
          const toolsTabBtn = document.querySelector(
            '[aria-selected="false"][role="tab"]:last-child'
          ) as HTMLButtonElement | null;
          if (toolsTabBtn) toolsTabBtn.click();
        }}
      />

      <DashboardFooter />
    </div>
  );
}
