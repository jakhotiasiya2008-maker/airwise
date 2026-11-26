"use client";

import React, { useState } from "react";
import { GuidanceCard, UrgencyLevel } from "@/types/guidance";
import { useLanguage } from "@/lib/i18n/context";
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, CheckSquare, Square } from "lucide-react";

interface GuidanceCardItemProps {
  card: GuidanceCard;
  isDone?: boolean;
  onToggleDone?: (id: string) => void;
}

export const GuidanceCardItem: React.FC<GuidanceCardItemProps> = ({
  card,
  isDone = false,
  onToggleDone,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "critical":
        return {
          label: t.urgency.now,
          classes: "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-200 dark:border-red-800",
        };
      case "high":
        return {
          label: t.urgency.today,
          classes: "bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-200 dark:border-orange-800",
        };
      case "medium":
        return {
          label: t.urgency.thisWeek,
          classes: "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
      case "low":
      default:
        return {
          label: t.urgency.preventive,
          classes: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const urgencyBadge = getUrgencyBadge(card.urgency);

  return (
    <article
      className={`rounded-2xl border transition-all flex flex-col justify-between p-4 sm:p-5 shadow-sm space-y-3 ${
        isDone
          ? "border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-85"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md"
      }`}
      aria-labelledby={`card-title-${card.id}`}
    >
      <div className="space-y-2">
        {/* Header: Urgency + Done Toggle */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${urgencyBadge.classes}`}
          >
            {urgencyBadge.label}
          </span>

          {onToggleDone && (
            <button
              type="button"
              onClick={() => onToggleDone(card.id)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              aria-label={`Mark task ${card.title} as ${isDone ? "incomplete" : "done"}`}
            >
              {isDone ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span className="text-[11px]">{isDone ? "Done" : t.cards.done}</span>
            </button>
          )}
        </div>

        {/* Card Title */}
        <h3
          id={`card-title-${card.id}`}
          className={`text-sm sm:text-base font-bold leading-snug ${
            isDone ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-white"
          }`}
        >
          {card.title}
        </h3>

        {/* Action item (What to do) */}
        <div className="flex items-start gap-2 pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-medium leading-relaxed">{card.action}</p>
        </div>
      </div>

      {/* Expandable Why & Expected Impact */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-left font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 py-1"
            aria-expanded={isExpanded}
          >
            <span>{t.cards.whyThisMatters} & {t.cards.expectedImpact}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-1 text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
            {/* Why This Matters */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="block font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider mb-1">
                {t.cards.whyThisMatters}:
              </span>
              <p className="text-xs leading-relaxed">{card.whyThisMatters}</p>
            </div>

            {/* Expected Impact */}
            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200">
              <span className="block font-bold text-emerald-900 dark:text-emerald-300 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {t.cards.expectedImpact}:
              </span>
              <p className="text-xs leading-relaxed">{card.expectedImpact}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
