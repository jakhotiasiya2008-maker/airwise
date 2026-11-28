import React from "react";
import { CityLocation, AirQualityReading } from "@/types/air-quality";
import { HouseholdProfile, PersonaPreset } from "@/types/profile";
import { GuidanceResponse } from "@/types/guidance";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { CommandPalette } from "@/components/CommandPalette";
import { ShareSummaryModal } from "@/components/ShareSummaryModal";
import { ProfileModal } from "@/components/ProfileModal";

interface DashboardModalsProps {
  isOnboardingOpen: boolean;
  onCompleteOnboarding: (city: CityLocation, profile: HouseholdProfile) => void;
  onSkipOnboarding: () => void;
  isCommandPaletteOpen: boolean;
  onCloseCommandPalette: () => void;
  onSelectCity: (city: CityLocation) => void;
  onSelectPreset: (preset: PersonaPreset) => void;
  onToggleTheme: () => void;
  isDark: boolean;
  isShareModalOpen: boolean;
  onCloseShareModal: () => void;
  currentCityName: string;
  airQuality: AirQualityReading | null;
  guidance: GuidanceResponse | null;
  isProfileModalOpen: boolean;
  onCloseProfileModal: () => void;
  profile: HouseholdProfile;
  onSaveProfile: (profile: HouseholdProfile) => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  isOnboardingOpen,
  onCompleteOnboarding,
  onSkipOnboarding,
  isCommandPaletteOpen,
  onCloseCommandPalette,
  onSelectCity,
  onSelectPreset,
  onToggleTheme,
  isDark,
  isShareModalOpen,
  onCloseShareModal,
  currentCityName,
  airQuality,
  guidance,
  isProfileModalOpen,
  onCloseProfileModal,
  profile,
  onSaveProfile,
}) => {
  return (
    <>
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onComplete={onCompleteOnboarding}
        onSkip={onSkipOnboarding}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={onCloseCommandPalette}
        onSelectCity={onSelectCity}
        onSelectPreset={onSelectPreset}
        onToggleTheme={onToggleTheme}
        isDark={isDark}
      />

      {airQuality && (
        <ShareSummaryModal
          isOpen={isShareModalOpen}
          onClose={onCloseShareModal}
          city={currentCityName}
          reading={airQuality}
          guidance={guidance}
        />
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={onCloseProfileModal}
        profile={profile}
        onSaveProfile={onSaveProfile}
      />
    </>
  );
};
