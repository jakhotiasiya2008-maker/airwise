import React from "react";
import { Users } from "lucide-react";
import { PersonaPreset } from "@/types/profile";

interface CommandPersonaListProps {
  personas: PersonaPreset[];
  onSelectPreset: (preset: PersonaPreset) => void;
}

export const CommandPersonaList: React.FC<CommandPersonaListProps> = ({
  personas,
  onSelectPreset,
}) => {
  if (personas.length === 0) return null;

  return (
    <div>
      <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Switch Household Persona
      </span>
      <div className="mt-1 space-y-0.5">
        {personas.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset)}
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
  );
};
