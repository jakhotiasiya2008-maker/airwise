"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { CityLocation } from "@/types/air-quality";
import { HouseholdProfile, CommuteMode } from "@/types/profile";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { Wind, ArrowRight, ArrowLeft, Check, Sparkles, X } from "lucide-react";

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (city: CityLocation, profile: HouseholdProfile) => void;
  onSkip: () => void;
}

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

        {/* Step 1: Pick City */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 id="onboarding-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.onboarding.step1Title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.onboarding.step1Desc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {DEFAULT_CITIES.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                    selectedCity.id === city.id
                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 ring-1 ring-blue-600"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="block font-bold">{city.name}</span>
                  <span className="text-[11px] text-slate-400">{city.state}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Household Demographics */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 id="onboarding-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.onboarding.step2Title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.onboarding.step2Desc}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={profile.hasYoungChildren}
                  onChange={(e) => setProfile({ ...profile, hasYoungChildren: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Young Children or Toddlers (Developing lungs)
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={profile.hasSeniors}
                  onChange={(e) => setProfile({ ...profile, hasSeniors: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Senior Citizens 60+ (Higher cardiovascular smog risk)
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={profile.hasRespiratorySensitivity}
                  onChange={(e) => setProfile({ ...profile, hasRespiratorySensitivity: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-medium text-rose-700 dark:text-rose-400 font-semibold">
                  Asthma, Bronchitis or Allergy Sensitivity
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Habits & Appliances */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 id="onboarding-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.onboarding.step3Title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.onboarding.step3Desc}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Commute Mode
                </label>
                <select
                  value={profile.commuteMode}
                  onChange={(e) => setProfile({ ...profile, commuteMode: e.target.value as CommuteMode })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="metro">Metro Rail</option>
                  <option value="bike">Motorcycle / Scooter</option>
                  <option value="bus">Public Bus</option>
                  <option value="car">Personal Car</option>
                  <option value="walk">Walking / Bicycle</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.hasAirPurifier}
                    onChange={(e) => setProfile({ ...profile, hasAirPurifier: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Has Air Purifier</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.hasIndoorPlants}
                    onChange={(e) => setProfile({ ...profile, hasIndoorPlants: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Has Houseplants</span>
                </label>
              </div>
            </div>
          </div>
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
