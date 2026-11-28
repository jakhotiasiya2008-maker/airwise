import React from "react";
import { HealthAdvisory } from "@/types/guidance";
import { AlertOctagon, AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface HealthAdvisoryBannerProps {
  advisory: HealthAdvisory;
}

export const HealthAdvisoryBanner: React.FC<HealthAdvisoryBannerProps> = ({ advisory }) => {
  const getBannerStyle = () => {
    switch (advisory.severity) {
      case "severe":
        return {
          bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900",
          icon: <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />,
          title: "text-red-950 dark:text-red-200",
          body: "text-red-800 dark:text-red-300",
          pill: "bg-red-200/80 text-red-900 dark:bg-red-900 dark:text-red-200",
        };
      case "high":
        return {
          bg: "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900",
          icon: <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />,
          title: "text-orange-950 dark:text-orange-200",
          body: "text-orange-800 dark:text-orange-300",
          pill: "bg-orange-200/80 text-orange-900 dark:bg-orange-900 dark:text-orange-200",
        };
      case "moderate":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
          icon: <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          title: "text-amber-950 dark:text-amber-200",
          body: "text-amber-800 dark:text-amber-300",
          pill: "bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200",
        };
      case "mild":
      default:
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          title: "text-emerald-950 dark:text-emerald-200",
          body: "text-emerald-800 dark:text-emerald-300",
          pill: "bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200",
        };
    }
  };

  const style = getBannerStyle();

  return (
    <section
      aria-label="Health Advisory Summary"
      className={`rounded-2xl border ${style.bg} p-4 sm:p-5 shadow-sm space-y-3 transition-colors`}
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`font-bold text-base ${style.title}`}>{advisory.headline}</h2>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.pill}`}
            >
              {advisory.severity} Alert
            </span>
          </div>

          <p className={`text-sm ${style.body}`}>{advisory.summary}</p>

          {advisory.sensitiveGroupWarning && (
            <div className="mt-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-current/20 text-xs font-medium">
              <strong className="font-semibold block mb-0.5">Household Vulnerability Note:</strong>
              {advisory.sensitiveGroupWarning}
            </div>
          )}

          {/* Non-medical disclaimer as mandated */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
            ⚠️ {advisory.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};
