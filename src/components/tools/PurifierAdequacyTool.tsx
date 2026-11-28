"use client";

import React, { useState } from "react";
import { Gauge } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { APP_CONFIG } from "@/lib/constants/config";

interface PurifierAdequacyToolProps {
  initialRoomSqFt?: number;
  initialCadr?: number;
}

/**
 * Interactive air purifier CADR and room adequacy calculator.
 * Computes Air Changes per Hour (ACH) based on room square footage and purifier CADR.
 */
export const PurifierAdequacyTool: React.FC<PurifierAdequacyToolProps> = ({
  initialRoomSqFt = 200,
  initialCadr = 300,
}) => {
  const { t } = useLanguage();
  const [roomSqFt, setRoomSqFt] = useState<number>(initialRoomSqFt);
  const [cadr, setCadr] = useState<number>(initialCadr);

  // Standard ceiling height: 2.74 meters. 1 sq ft = 0.092903 sq meters.
  const roomVolumeM3 = roomSqFt * 0.092903 * APP_CONFIG.purifier.standardCeilingHeightM;
  const ach = Math.round((cadr / roomVolumeM3) * 10) / 10;
  const isAchAdequate = ach >= APP_CONFIG.purifier.recommendedAch;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t.tools.purifierCheckTitle}
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{t.tools.purifierCheckDesc}</p>

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
          <span className="text-base font-extrabold text-slate-900 dark:text-white">{ach} ACH</span>
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
  );
};
