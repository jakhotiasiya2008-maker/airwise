"use client";

import React, { useState } from "react";
import { Sparkles, Bike, Car, Bus, Train, Footprints } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { CommuteMode } from "@/types/profile";

interface CommuteWhatIfToolProps {
  initialMode: CommuteMode;
}

interface CommuteDetail {
  icon: React.ReactNode;
  label: string;
  exposureScore: string;
  exposureDesc: string;
  emissionLevel: string;
  recommendedGear: string;
}

const COMMUTE_OPTIONS: CommuteMode[] = ["metro", "car", "bike", "bus", "walk"];

/**
 * Interactive What-If commute calculator.
 * Compares personal inhalation exposure vs tailpipe emission contribution across transit modes.
 */
export const CommuteWhatIfTool: React.FC<CommuteWhatIfToolProps> = ({ initialMode }) => {
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<CommuteMode>(initialMode);

  const getCommuteDetails = (mode: CommuteMode): CommuteDetail => {
    switch (mode) {
      case "bike":
        return {
          icon: <Bike className="w-5 h-5 text-amber-500" />,
          label: "Motorcycle / Scooter",
          exposureScore: "9 / 10 (Very High)",
          exposureDesc: "Direct inhalation of roadside diesel exhaust & resuspended road dust. High particulate load.",
          emissionLevel: "Moderate (tailpipe emissions)",
          recommendedGear: "Strictly wear certified N95 mask with silicone seal.",
        };
      case "car":
        return {
          icon: <Car className="w-5 h-5 text-blue-500" />,
          label: "Personal Car",
          exposureScore: "4 / 10 (Low-Moderate)",
          exposureDesc: "Enclosed cabin with HVAC filter reduces outside PM2.5 by ~50-70% when on recirculation.",
          emissionLevel: "High (per capita emissions)",
          recommendedGear: "Set AC to internal recirculation mode.",
        };
      case "metro":
        return {
          icon: <Train className="w-5 h-5 text-emerald-500" />,
          label: "Electric Metro Rail",
          exposureScore: "3 / 10 (Low)",
          exposureDesc: "Subterranean and conditioned cars have continuous high-volume filtration.",
          emissionLevel: "Zero Tailpipe Emissions (Cleanest)",
          recommendedGear: "Wear light mask during station transit.",
        };
      case "bus":
        return {
          icon: <Bus className="w-5 h-5 text-indigo-500" />,
          label: "Public Bus",
          exposureScore: "6 / 10 (Moderate)",
          exposureDesc: "Window openings determine exposure; high passenger density cuts traffic emissions.",
          emissionLevel: "Very Low per passenger-km",
          recommendedGear: "Keep N95 mask on during boarding and transit.",
        };
      case "walk":
      default:
        return {
          icon: <Footprints className="w-5 h-5 text-purple-500" />,
          label: "Walking / Cycling",
          exposureScore: "8 / 10 (High on major roads)",
          exposureDesc: "High respiratory rate increases particle deposition deep in bronchioles.",
          emissionLevel: "Zero Emissions",
          recommendedGear: "Stick to quiet green residential alleys away from arterial roads.",
        };
    }
  };

  const commuteDetails = getCommuteDetails(selectedMode);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t.tools.whatIfTitle}
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t.tools.whatIfDesc}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        {COMMUTE_OPTIONS.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSelectedMode(mode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all capitalize ${
              selectedMode === mode
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          {commuteDetails.icon}
          <span>{commuteDetails.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[11px] text-slate-400 block">Personal Exposure:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {commuteDetails.exposureScore}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Tailpipe Emissions:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {commuteDetails.emissionLevel}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
          💡 {commuteDetails.recommendedGear}
        </p>
      </div>
    </div>
  );
};
