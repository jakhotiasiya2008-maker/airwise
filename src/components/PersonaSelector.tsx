import React from "react";
import { PersonaPreset, HouseholdProfile } from "@/types/profile";
import { PERSONA_PRESETS } from "@/lib/constants/personas";
import { Users, Baby, HeartPulse, Bike, GraduationCap, Settings } from "lucide-react";

interface PersonaSelectorProps {
  currentProfile: HouseholdProfile;
  activePersonaId?: string;
  onSelectPreset: (preset: PersonaPreset) => void;
  onOpenCustomModal: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  activePersonaId,
  onSelectPreset,
  onOpenCustomModal,
}) => {
  const getPersonaIcon = (id: string) => {
    switch (id) {
      case "vulnerable_family":
        return <Baby className="w-4 h-4 text-rose-500" />;
      case "two_wheeler_commuter":
        return <Bike className="w-4 h-4 text-amber-500" />;
      case "asthma_sensitive":
        return <HeartPulse className="w-4 h-4 text-red-500" />;
      case "student_campus":
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default:
        return <Users className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <section
      aria-label="Target Household Persona Selector"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Target Persona & Household Context</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Guidance, urgency ratings, and health warnings automatically adapt to your chosen
            persona.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCustomModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 self-start sm:self-auto py-1 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Customize Attributes</span>
        </button>
      </div>

      {/* Preset Pills / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PERSONA_PRESETS.map((preset) => {
          const isSelected = activePersonaId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-sm ring-1 ring-blue-600"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              aria-pressed={isSelected}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {getPersonaIcon(preset.id)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      preset.id === "vulnerable_family"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {preset.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {preset.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
