import React from "react";
import { Loader2 } from "lucide-react";
import { CityLocation } from "@/types/air-quality";

interface LocationSearchDropdownProps {
  isOpen: boolean;
  isSearching: boolean;
  results: CityLocation[];
  query: string;
  onSelectCity: (city: CityLocation) => void;
}

export const LocationSearchDropdown: React.FC<LocationSearchDropdownProps> = ({
  isOpen,
  isSearching,
  results,
  query,
  onSelectCity,
}) => {
  if (!isOpen || (!isSearching && results.length === 0 && query.length < 2)) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
      {isSearching && (
        <div className="p-3 text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Searching verified Indian locations...</span>
        </div>
      )}

      {!isSearching && results.length === 0 && query.length >= 2 && (
        <div className="p-4 text-xs text-center text-slate-400">
          No Indian cities found matching &quot;{query}&quot;.
        </div>
      )}

      {!isSearching &&
        results.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city)}
            className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
          >
            <span className="font-semibold text-slate-900 dark:text-white">{city.name}</span>
            <span className="text-slate-400 text-[11px]">{city.state}</span>
          </button>
        ))}
    </div>
  );
};
