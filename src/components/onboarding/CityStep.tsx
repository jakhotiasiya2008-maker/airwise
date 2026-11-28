"use client";

import React from "react";
import { CityLocation } from "@/types/air-quality";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { useLanguage } from "@/lib/i18n/context";

interface CityStepProps {
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

export const CityStep: React.FC<CityStepProps> = ({ selectedCity, onSelectCity }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h2 id="onboarding-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
          {t.onboarding.step1Title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.onboarding.step1Desc}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {DEFAULT_CITIES.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city)}
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
  );
};
