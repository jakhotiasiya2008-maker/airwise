import React from "react";
import { CityLocation } from "@/types/air-quality";
import { DEFAULT_CITIES } from "@/lib/constants/cities";

interface LocationQuickChipsProps {
  currentCityId: string | number;
  onSelectCity: (city: CityLocation) => void;
}

export const LocationQuickChips: React.FC<LocationQuickChipsProps> = ({
  currentCityId,
  onSelectCity,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
      <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">Quick cities:</span>
      {DEFAULT_CITIES.map((city) => {
        const isSelected = currentCityId === city.id;
        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};
