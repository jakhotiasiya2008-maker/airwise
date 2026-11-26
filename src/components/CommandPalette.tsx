"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_CITIES } from "@/lib/constants/cities";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { CityLocation } from "@/types/air-quality";
import { PersonaPreset } from "@/types/profile";
import { useLanguage } from "@/lib/i18n/context";
import { Search, MapPin, Users, Moon, Sun, Languages, X, Command } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityLocation) => void;
  onSelectPreset: (preset: PersonaPreset) => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onSelectPreset,
  onToggleTheme,
  isDark,
}) => {
  const { language, setLanguage } = useLanguage();
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // toggle logic handled in parent or here
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCities = DEFAULT_CITIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPersonas = PERSONA_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 gap-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            id="command-palette-title"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities, personas, commands..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 sm:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-3 text-xs">
          {/* Quick Actions */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Actions
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  onToggleTheme();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span>Toggle Theme (Currently {isDark ? "Dark" : "Light"})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage(language === "en" ? "hi" : "en");
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Languages className="w-4 h-4 text-blue-500" />
                <span>Switch Language to {language === "en" ? "हिंदी (Hindi)" : "English"}</span>
              </button>
            </div>
          </div>

          {/* Cities */}
          {filteredCities.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch City
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredCities.slice(0, 5).map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
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
          )}

          {/* Personas */}
          {filteredPersonas.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Household Persona
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredPersonas.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-900 dark:text-white">{preset.name}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {preset.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
