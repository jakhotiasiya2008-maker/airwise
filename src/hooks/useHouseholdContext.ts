"use client";

import { useState, useEffect, useCallback } from "react";
import { CityLocation } from "@/types/air-quality";
import { HouseholdProfile, PersonaPreset } from "@/types/profile";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { PERSONA_PRESETS } from "@/lib/constants/personas";

const PROFILE_STORAGE_KEY = "airwise_india_profile";
const PERSONA_STORAGE_KEY = "airwise_india_persona_id";
const ONBOARDING_KEY = "airwise_onboarding_completed_v2";
const THEME_STORAGE_KEY = "airwise_theme_dark";

export interface UseHouseholdContextReturn {
  currentCity: CityLocation;
  setCurrentCity: (city: CityLocation) => void;
  activePersonaId: string;
  profile: HouseholdProfile;
  isDark: boolean;
  isOffline: boolean;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  toggleTheme: () => void;
  selectPreset: (preset: PersonaPreset) => void;
  saveCustomProfile: (profile: HouseholdProfile) => void;
  completeOnboarding: (city: CityLocation, profile: HouseholdProfile) => void;
  skipOnboarding: () => void;
}

/**
 * Custom hook managing client-side persistence (localStorage), modal visibility,
 * persona presets, dark mode toggling, and network connectivity state.
 */
export function useHouseholdContext(): UseHouseholdContextReturn {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITIES[0]);
  const [activePersonaId, setActivePersonaId] = useState<string>("vulnerable_family");
  const [profile, setProfile] = useState<HouseholdProfile>(PERSONA_PRESETS[0].profile);

  // Modals & Drawers
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Theme & Network
  const [isDark, setIsDark] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Initial client hydration
  useEffect(() => {
    try {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Theme
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === "true");
      } else {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }

      // Onboarding
      const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY);
      if (!onboardingCompleted) {
        setIsOnboardingOpen(true);
      }

      // Persona & Profile
      const savedPersona = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (savedPersona) setActivePersonaId(savedPersona);

      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    } catch (e) {
      console.warn("Context hydration notice:", e);
    }
  }, []);

  // Sync dark class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, String(next));
      } catch (e) {
        console.warn("Could not save theme:", e);
      }
      return next;
    });
  }, []);

  const selectPreset = useCallback((preset: PersonaPreset) => {
    setActivePersonaId(preset.id);
    setProfile(preset.profile);
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, preset.id);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(preset.profile));
    } catch {}
  }, []);

  const saveCustomProfile = useCallback((newProfile: HouseholdProfile) => {
    setProfile(newProfile);
    setActivePersonaId("custom");
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, "custom");
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch {}
  }, []);

  const completeOnboarding = useCallback((city: CityLocation, completedProfile: HouseholdProfile) => {
    setCurrentCity(city);
    setProfile(completedProfile);
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(completedProfile));
    } catch {}
  }, []);

  const skipOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {}
  }, []);

  return {
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
    setIsOnboardingOpen,
    toggleTheme,
    selectPreset,
    saveCustomProfile,
    completeOnboarding,
    skipOnboarding,
  };
}
