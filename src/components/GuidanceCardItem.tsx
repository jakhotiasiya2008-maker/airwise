import React, { useState } from "react";
import { GuidanceCard, UrgencyLevel } from "@/types/guidance";
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, AlertCircle } from "lucide-react";

interface GuidanceCardItemProps {
  card: GuidanceCard;
}

export const GuidanceCardItem: React.FC<GuidanceCardItemProps> = ({ card }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "critical":
        return {
          label: "Critical Action",
          classes: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
        };
      case "high":
        return {
          label: "High Priority",
          classes: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
        };
      case "medium":
        return {
          label: "Recommended",
          classes: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
      case "low":
      default:
        return {
          label: "Preventive",
          classes: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const urgencyBadge = getUrgencyBadge(card.urgency);

  return (
    <article
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
      aria-labelledby={`card-title-${card.id}`}
    >
      <div className="space-y-2">
        {/* Urgency & Tags */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${urgencyBadge.classes}`}
          >
            {urgencyBadge.label}
          </span>
          {card.tags && card.tags.length > 0 && (
            <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {card.tags.slice(0, 2).join(" • ")}
            </span>
          )}
        </div>

        {/* Card Title */}
        <h3
          id={`card-title-${card.id}`}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug"
        >
          {card.title}
        </h3>

        {/* Action item (What to do) */}
        <div className="flex items-start gap-2 pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-medium leading-relaxed">{card.action}</p>
        </div>
      </div>

      {/* Why This Matters & Expected Impact */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-left font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 py-1"
            aria-expanded={isExpanded}
          >
            <span>Scientific Reason & Expected Impact</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-1 text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
            {/* Why This Matters */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="block font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider mb-1">
                🔬 Why This Matters:
              </span>
              <p className="text-xs leading-relaxed">{card.whyThisMatters}</p>
            </div>

            {/* Expected Impact */}
            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200">
              <span className="block font-bold text-emerald-900 dark:text-emerald-300 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Expected Impact:
              </span>
              <p className="text-xs leading-relaxed">{card.expectedImpact}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
