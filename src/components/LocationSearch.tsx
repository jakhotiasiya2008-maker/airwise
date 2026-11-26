import React, { useState, useEffect, useRef } from "react";
import { CityLocation } from "@/types/air-quality";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { Search, Navigation, Loader2, AlertCircle, X } from "lucide-react";

interface LocationSearchProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  isLoading: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentCity,
  onSelectCity,
  isLoading,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocoding?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.warn("Geocoding fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle "Use My Location" with graceful denial handling
  const handleUseMyLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        onSelectCity({
          id: `gps-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
          name: "My Current Location",
          state: "Detected GPS",
          country: "India",
          latitude,
          longitude,
        });
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access was denied. You can still select any Indian city below or search manually."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is currently unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try picking a city manually.");
            break;
          default:
            setLocationError("Unable to retrieve your location.");
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const popularCities = DEFAULT_CITIES.slice(0, 6);

  return (
    <section aria-label="City and Location Selector" className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input with autocomplete */}
        <div ref={dropdownRef} className="relative flex-1">
          <label htmlFor="city-search-input" className="sr-only">
            Search Indian city or district
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              id="city-search-input"
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls="city-search-list"
              aria-autocomplete="list"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setIsOpen(true)}
              placeholder="Search Indian city (e.g. Noida, Delhi, Mumbai, Patna)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear city search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <ul
              id="city-search-list"
              role="listbox"
              className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-1 text-sm"
            >
              {results.map((item) => (
                <li
                  key={`${item.latitude}-${item.longitude}-${item.name}`}
                  role="option"
                  aria-selected={item.name === currentCity.name}
                  onClick={() => {
                    onSelectCity(item);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    {item.state && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
                        • {item.state}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.latitude.toFixed(2)}°N, {item.longitude.toFixed(2)}°E
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* "Use my location" button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating || isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-colors disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" aria-hidden="true" />
          ) : (
            <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          )}
          <span>{isLocating ? "Locating..." : "Use My Location"}</span>
        </button>
      </div>

      {/* Geolocation Denial / Error Notice */}
      {locationError && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" aria-hidden="true" />
            <span>{locationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setLocationError(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-1"
            aria-label="Dismiss error notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Select Popular Indian Metro Pills */}
      <div className="flex items-center flex-wrap gap-1.5 pt-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
          Quick cities:
        </span>
        {popularCities.map((city) => {
          const isSelected = currentCity.name.toLowerCase().includes(city.name.toLowerCase());
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              aria-pressed={isSelected}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};
