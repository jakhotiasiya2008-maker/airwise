"use client";

import React from "react";
import { HouseholdProfile } from "@/types/profile";

interface DemographicCheckboxesProps {
  profile: HouseholdProfile;
  onChange: (updated: HouseholdProfile) => void;
}

export const DemographicCheckboxes: React.FC<DemographicCheckboxesProps> = ({
  profile,
  onChange,
}) => {
  return (
    <div>
      <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
        Household Members
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.hasYoungChildren}
            onChange={(e) => onChange({ ...profile, hasYoungChildren: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Young Children / Infants
          </span>
        </label>

        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.hasSeniors}
            onChange={(e) => onChange({ ...profile, hasSeniors: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Senior Citizens (60+)
          </span>
        </label>

        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.hasRespiratorySensitivity}
            onChange={(e) => onChange({ ...profile, hasRespiratorySensitivity: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-rose-700 dark:text-rose-400 font-semibold">
            Asthma / Lung Sensitivity
          </span>
        </label>

        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.hasStudents}
            onChange={(e) => onChange({ ...profile, hasStudents: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            School / College Students
          </span>
        </label>
      </div>
    </div>
  );
};
