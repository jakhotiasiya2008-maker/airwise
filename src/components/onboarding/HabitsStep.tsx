"use client";

import React from "react";
import { HouseholdProfile, CommuteMode } from "@/types/profile";
import { useLanguage } from "@/lib/i18n/context";

interface HabitsStepProps {
  profile: HouseholdProfile;
  onChangeProfile: (profile: HouseholdProfile) => void;
}

export const HabitsStep: React.FC<HabitsStepProps> = ({ profile, onChangeProfile }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h2 id="onboarding-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
          {t.onboarding.step3Title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.onboarding.step3Desc}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Primary Commute Mode
          </label>
          <select
            value={profile.commuteMode}
            onChange={(e) =>
              onChangeProfile({ ...profile, commuteMode: e.target.value as CommuteMode })
            }
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
              onChange={(e) => onChangeProfile({ ...profile, hasAirPurifier: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span>Has Air Purifier</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.hasIndoorPlants}
              onChange={(e) => onChangeProfile({ ...profile, hasIndoorPlants: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span>Has Houseplants</span>
          </label>
        </div>
      </div>
    </div>
  );
};
