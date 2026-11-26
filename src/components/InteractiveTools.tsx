"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { HouseholdProfile, CommuteMode } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { Sliders, Gauge, ShieldAlert, Sparkles, Bike, Car, Bus, Train, Footprints } from "lucide-react";

interface InteractiveToolsProps {
  aqi: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

export const InteractiveTools: React.FC<InteractiveToolsProps> = ({
  aqi,
  category,
  profile,
}) => {
  const { t } = useLanguage();

  // Tool 1: Purifier check state
  const [roomSqFt, setRoomSqFt] = useState<number>(200);
  const [cadr, setCadr] = useState<number>(300);

  // Tool 2: What-If commute state
  const [selectedMode, setSelectedMode] = useState<CommuteMode>(profile.commuteMode || "metro");

  // Calculate ACH (Air Changes per Hour)
  // Standard ceiling height: 9 ft = 2.74 meters. 1 sq ft = 0.092903 sq meters.
  const roomVolumeM3 = roomSqFt * 0.092903 * 2.74;
  const ach = Math.round((cadr / roomVolumeM3) * 10) / 10;
  const isAchAdequate = ach >= 4.0;

  // Commute exposure metrics (deterministic relative scale 1-10)
  const getCommuteDetails = (mode: CommuteMode) => {
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

  // Tool 3: Safe outdoor exposure timeline (minutes)
  const calculateSafeExposureMinutes = () => {
    const isSensitive = profile.hasYoungChildren || profile.hasSeniors || profile.hasRespiratorySensitivity;
    if (aqi > 400) return isSensitive ? "10 - 15 mins (Emergency only)" : "20 - 30 mins max";
    if (aqi > 300) return isSensitive ? "20 - 30 mins" : "45 - 60 mins";
    if (aqi > 200) return isSensitive ? "45 - 60 mins" : "90 - 120 mins";
    if (aqi > 100) return isSensitive ? "90 - 120 mins" : "Unlimited for normal activity";
    return "Unlimited (Air quality is satisfactory)";
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>{t.tools.title}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t.tools.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Purifier CADR & Room Size Check */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.tools.purifierCheckTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.tools.purifierCheckDesc}
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <label htmlFor="room-size-slider">{t.tools.roomSizeLabel}:</label>
                <span className="font-mono text-blue-600 dark:text-blue-400">{roomSqFt} sq ft</span>
              </div>
              <input
                id="room-size-slider"
                type="range"
                min="80"
                max="600"
                step="20"
                value={roomSqFt}
                onChange={(e) => setRoomSqFt(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <label htmlFor="cadr-slider">{t.tools.cadrLabel}:</label>
                <span className="font-mono text-blue-600 dark:text-blue-400">{cadr} m³/hr</span>
              </div>
              <input
                id="cadr-slider"
                type="range"
                min="100"
                max="800"
                step="25"
                value={cadr}
                onChange={(e) => setCadr(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">{t.tools.achLabel}:</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {ach} ACH
              </span>
            </div>
            <p
              className={`text-xs font-semibold ${
                isAchAdequate
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {isAchAdequate ? t.tools.verdictAdequate : t.tools.verdictInadequate}
            </p>
          </div>
        </div>

        {/* Tool 2: What-If Commute Exposure */}
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
            {(["metro", "car", "bike", "bus", "walk"] as CommuteMode[]).map((mode) => (
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

        {/* Tool 3: Safe Outdoor Exposure Window (Spans full width) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.tools.exposureTimelineTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.tools.exposureTimelineDesc}
          </p>

          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                Current AQI: <strong className="font-bold">{aqi} ({category})</strong>
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
      </div>
    </div>
  );
};
