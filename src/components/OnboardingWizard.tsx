"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { CityLocation } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { Wind, ArrowRight, ArrowLeft, Sparkles, X } from "lucide-react";
import { CityStep } from "./onboarding/CityStep";
import { HouseholdStep } from "./onboarding/HouseholdStep";
import { HabitsStep } from "./onboarding/HabitsStep";

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (city: CityLocation, profile: HouseholdProfile) => void;
  onSkip: () => void;
}

/**
 * First-visit 3-step onboarding wizard.
 * Step 1: City selection
 * Step 2: Household demographics & vulnerable members
 * Step 3: Habits & purification appliances
 */
export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);

  const [selectedCity, setSelectedCity] = useState<CityLocation>(DEFAULT_CITIES[0]);
  const [profile, setProfile] = useState<HouseholdProfile>({
    hasYoungChildren: true,
    hasSeniors: true,
    hasStudents: false,
    isDailyCommuter: false,
    hasRespiratorySensitivity: true,
    commuteMode: "car",
    hasAirPurifier: true,
    hasIndoorPlants: true,
  });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Header with Step Dots & Skip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Step {step} of 3
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    step === s
                      ? "w-6 bg-blue-600"
                      : step > s
                      ? "bg-blue-300 dark:bg-blue-800"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Skip onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Step Content */}
        {step === 1 && (
          <CityStep selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        )}
        {step === 2 && (
          <HouseholdStep profile={profile} onChangeProfile={setProfile} />
        )}
        {step === 3 && (
          <HabitsStep profile={profile} onChangeProfile={setProfile} />
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.onboarding.back}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2 py-1"
            >
              {t.onboarding.skip}
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <span>{t.onboarding.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(selectedCity, profile)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.onboarding.finish}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
