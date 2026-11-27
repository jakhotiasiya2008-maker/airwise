"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CityLocation } from "@/types/air-quality";

export interface UseLocationSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: CityLocation[];
  isSearching: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  locationError: string | null;
  isLocating: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  handleUseMyLocation: (onSelectCity: (city: CityLocation) => void) => void;
  clearSearch: () => void;
  clearLocationError: () => void;
}

/**
 * Custom hook to encapsulate city search autocomplete with debouncing,
 * dropdown outside-click handling, and graceful GPS geolocation denial.
 */
export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search (250ms)
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

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUseMyLocation = useCallback((onSelectCity: (city: CityLocation) => void) => {
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
        setIsOpen(false);
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
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }, []);

  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  return {
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
  };
}
