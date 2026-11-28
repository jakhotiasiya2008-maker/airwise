"use client";

import React from "react";
import { HouseholdProfile } from "@/types/profile";
import { useLanguage } from "@/lib/i18n/context";

interface HouseholdStepProps {
  profile: HouseholdProfile;
  onChangeProfile: (profile: HouseholdProfile) => void;
}

export const HouseholdStep: React.FC<HouseholdStepProps> = ({ profile, onChangeProfile }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h2 id="onboarding-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
          {t.onboarding.step2Title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.onboarding.step2Desc}</p>
      </div>

      <div className="space-y-2 text-xs">
        <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <input
            type="checkbox"
            checked={profile.hasYoungChildren}
            onChange={(e) => onChangeProfile({ ...profile, hasYoungChildren: e.target.checked })}
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
            onChange={(e) => onChangeProfile({ ...profile, hasSeniors: e.target.checked })}
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
            onChange={(e) =>
              onChangeProfile({ ...profile, hasRespiratorySensitivity: e.target.checked })
            }
            className="w-4 h-4 rounded text-blue-600"
          />
          <span className="font-medium text-rose-700 dark:text-rose-400 font-semibold">
            Asthma, Bronchitis or Allergy Sensitivity
          </span>
        </label>
      </div>
    </div>
  );
};
