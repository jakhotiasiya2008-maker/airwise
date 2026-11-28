import React from "react";

export const DashboardFooter: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            AirWise India • PromptWars Challenge 6
          </p>
          <p>
            Open-Meteo CAMS Model & CPCB NAQI standards. AI engine: Gemini 2.5 Flash with
            deterministic rule fallback.
          </p>
        </div>
        <div className="text-center sm:text-right text-[11px] text-slate-400">
          <p>WCAG 2.2 AA Compliant • PWA Ready • Zero committed secrets</p>
          <p>Non-medical educational smog advisory</p>
        </div>
      </div>
    </footer>
  );
};
