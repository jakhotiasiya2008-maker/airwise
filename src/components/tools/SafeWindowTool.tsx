"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { CpcbCategory } from "@/types/air-quality";
import { HouseholdProfile } from "@/types/profile";

interface SafeWindowToolProps {
  aqi: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

/**
 * Calculates safe outdoor duration based on real-time AQI and household vulnerability factors.
 */
export const SafeWindowTool: React.FC<SafeWindowToolProps> = ({ aqi, category, profile }) => {
  const { t } = useLanguage();

  const calculateSafeExposureMinutes = (): string => {
    const isSensitive =
      profile.hasYoungChildren || profile.hasSeniors || profile.hasRespiratorySensitivity;
    if (aqi > 400) return isSensitive ? "10 - 15 mins (Emergency only)" : "20 - 30 mins max";
    if (aqi > 300) return isSensitive ? "20 - 30 mins" : "45 - 60 mins";
    if (aqi > 200) return isSensitive ? "45 - 60 mins" : "90 - 120 mins";
    if (aqi > 100) return isSensitive ? "90 - 120 mins" : "Unlimited for normal activity";
    return "Unlimited (Air quality is satisfactory)";
  };

  return (
    <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t.tools.exposureTimelineTitle}
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{t.tools.exposureTimelineDesc}</p>

      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
            Current AQI:{" "}
            <strong className="font-bold">
              {aqi} ({category})
            </strong>
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            Safe Outdoor Duration: {calculateSafeExposureMinutes()}
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 italic">
          Estimated based on CPCB health guidelines & inhalation rates
        </span>
      </div>
    </div>
  );
};
