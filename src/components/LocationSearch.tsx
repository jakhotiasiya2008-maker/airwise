"use client";

import React from "react";
import { CityLocation } from "@/types/air-quality";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { Search, Navigation, Loader2, AlertCircle, X } from "lucide-react";
import { useLocationSearch } from "@/hooks/useLocationSearch";

interface LocationSearchProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  isLoading: boolean;
}

/**
 * City search component featuring live autocomplete for Indian locations,
 * popular quick-city chips, and GPS location detection with graceful denial handling.
 */
export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentCity,
  onSelectCity,
  isLoading,
}) => {
  const {
    query,
    setQuery,
    results,
    isSearching,
    isOpen,
    setIsOpen,
    locationError,
    isLocating,
    dropdownRef,
    handleUseMyLocation,
    clearSearch,
    clearLocationError,
  } = useLocationSearch();

  return (
    <div className="w-full space-y-2">
      {/* Search Input Bar */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center">
          <label htmlFor="city-search-input" className="sr-only">
            Search Indian city or district
          </label>
          <Search
            className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search Indian city (e.g. Noida, Pune, Delhi)..."
            className="w-full pl-10 pr-28 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            autoComplete="off"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear city search"
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleUseMyLocation(onSelectCity)}
              disabled={isLocating || isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors disabled:opacity-50"
              title="Detect my current location via GPS"
            >
              {isLocating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Navigation className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">Use My Location</span>
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (results.length > 0 || isSearching) && (
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
                  onClick={() => {
                    onSelectCity(city);
                    clearSearch();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {city.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">{city.state}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Geolocation Denied / Error Banner */}
      {locationError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{locationError}</p>
          </div>
          <button
            type="button"
            onClick={clearLocationError}
            className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-100"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Popular City Quick-Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
          Quick cities:
        </span>
        {DEFAULT_CITIES.map((city) => {
          const isSelected = currentCity.id === city.id;
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
    </div>
  );
};
