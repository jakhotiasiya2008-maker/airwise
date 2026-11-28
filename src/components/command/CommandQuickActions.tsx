import React from "react";
import { Moon, Sun, Languages } from "lucide-react";
import { SupportedLanguage } from "@/lib/i18n/types";

interface CommandQuickActionsProps {
  isDark: boolean;
  language: SupportedLanguage;
  onToggleTheme: () => void;
  onSwitchLanguage: () => void;
}

export const CommandQuickActions: React.FC<CommandQuickActionsProps> = ({
  isDark,
  language,
  onToggleTheme,
  onSwitchLanguage,
}) => {
  return (
    <div>
      <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Actions
      </span>
      <div className="mt-1 space-y-0.5">
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
          <span>Toggle Theme (Currently {isDark ? "Dark" : "Light"})</span>
        </button>

        <button
          type="button"
          onClick={onSwitchLanguage}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <Languages className="w-4 h-4 text-blue-500" />
          <span>Switch Language to {language === "en" ? "हिंदी (Hindi)" : "English"}</span>
        </button>
      </div>
    </div>
  );
};
