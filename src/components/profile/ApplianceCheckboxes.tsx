"use client";

import React from "react";
import { HouseholdProfile } from "@/types/profile";

interface ApplianceCheckboxesProps {
  profile: HouseholdProfile;
  onChange: (updated: HouseholdProfile) => void;
}

export const ApplianceCheckboxes: React.FC<ApplianceCheckboxesProps> = ({
  profile,
  onChange,
}) => {
  return (
    <div>
      <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
        Indoor Appliances & Plants
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.hasAirPurifier}
            onChange={(e) => onChange({ ...profile, hasAirPurifier: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Owns HEPA Air Purifier
          </span>
        </label>

        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.hasIndoorPlants}
            onChange={(e) => onChange({ ...profile, hasIndoorPlants: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Has Indoor Houseplants
          </span>
        </label>
      </div>
    </div>
  );
};
