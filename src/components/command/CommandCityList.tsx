import React from "react";
import { MapPin } from "lucide-react";
import { CityLocation } from "@/types/air-quality";

interface CommandCityListProps {
  cities: CityLocation[];
  onSelectCity: (city: CityLocation) => void;
}

export const CommandCityList: React.FC<CommandCityListProps> = ({ cities, onSelectCity }) => {
  if (cities.length === 0) return null;

  return (
    <div>
      <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Switch City
      </span>
      <div className="mt-1 space-y-0.5">
        {cities.slice(0, 5).map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-900 dark:text-white">{city.name}</span>
            </div>
            <span className="text-[11px] text-slate-400">{city.state}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
