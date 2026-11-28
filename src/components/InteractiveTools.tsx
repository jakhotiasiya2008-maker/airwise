"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { Sliders } from "lucide-react";
import { PurifierAdequacyTool } from "./tools/PurifierAdequacyTool";
import { CommuteWhatIfTool } from "./tools/CommuteWhatIfTool";
import { SafeWindowTool } from "./tools/SafeWindowTool";

interface InteractiveToolsProps {
  aqi: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

/**
 * Interactive tools section providing scenario analysis:
 * 1. Air purifier CADR and room adequacy checker.
 * 2. Commute mode what-if exposure analyzer.
 * 3. Health-based safe outdoor exposure window calculator.
 */
export const InteractiveTools: React.FC<InteractiveToolsProps> = ({ aqi, category, profile }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>{t.tools.title}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.tools.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PurifierAdequacyTool />
        <CommuteWhatIfTool initialMode={profile.commuteMode || "metro"} />
        <SafeWindowTool aqi={aqi} category={category} profile={profile} />
      </div>
    </div>
  );
};
