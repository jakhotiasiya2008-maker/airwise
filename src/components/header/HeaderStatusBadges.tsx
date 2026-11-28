import React from "react";
import { Cpu, ShieldAlert, WifiOff } from "lucide-react";

interface HeaderStatusBadgesProps {
  isOffline: boolean;
  engine: "gemini" | "rule-based" | "loading";
}

export const HeaderStatusBadges: React.FC<HeaderStatusBadgesProps> = ({ isOffline, engine }) => {
  return (
    <>
      {isOffline && (
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
          role="status"
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Offline Mode</span>
        </div>
      )}

      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300"
        title={
          engine === "gemini"
            ? "Powered by Gemini 2.5 Flash via @google/genai"
            : engine === "rule-based"
              ? "Deterministic rule engine active"
              : "Loading engine..."
        }
      >
        {engine === "gemini" ? (
          <>
            <span
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            <Cpu
              className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span className="hidden md:inline">Gemini AI</span>
          </>
        ) : engine === "rule-based" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
            <ShieldAlert
              className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <span className="hidden md:inline">Rule Engine</span>
          </>
        ) : (
          <span className="text-slate-400">...</span>
        )}
      </div>
    </>
  );
};
