"use client";

import React, { useState } from "react";
import { GuidanceResponse } from "@/types/guidance";
import { GuidanceCardItem } from "@/components/GuidanceCardItem";
import { InteractiveTools } from "@/components/InteractiveTools";
import { useLanguage } from "@/lib/i18n/context";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { Compass, Home, Leaf, Wrench, CheckCircle } from "lucide-react";

interface GuidanceSectionViewProps {
  guidance: GuidanceResponse;
  aqi: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

export const GuidanceSectionView: React.FC<GuidanceSectionViewProps> = ({
  guidance,
  aqi,
  category,
  profile,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "routines" | "indoor" | "sustainable" | "tools">("all");
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const { dailyRoutines, indoorAir, sustainableAlternatives } = guidance.sections;

  // Flatten all cards to calculate progress
  const allCards = [
    ...dailyRoutines.cards,
    ...indoorAir.cards,
    ...sustainableAlternatives.cards,
  ];
  const totalTasks = allCards.length;
  const completedCount = completedTaskIds.size;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleToggleDone = (id: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress Tracker Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 dark:border-blue-500 flex items-center justify-center font-black text-sm text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 shadow-sm shrink-0">
            {progressPercent}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Smog Action Plan Progress</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              <strong className="font-semibold text-slate-900 dark:text-white">{completedCount} of {totalTasks}</strong> {t.cards.completedCount}
            </p>
          </div>
        </div>

        {/* Progress bar for mobile / quick visual */}
        <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "all"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          {t.tabs.all}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "routines"}
          onClick={() => setActiveTab("routines")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "routines"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <Compass className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.tabs.routines} ({dailyRoutines.cards.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "indoor"}
          onClick={() => setActiveTab("indoor")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "indoor"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <Home className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.tabs.indoor} ({indoorAir.cards.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "sustainable"}
          onClick={() => setActiveTab("sustainable")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "sustainable"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.tabs.sustainable} ({sustainableAlternatives.cards.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "tools"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.tabs.tools}</span>
        </button>
      </div>

      {/* Interactive Tools View */}
      {activeTab === "tools" && (
        <InteractiveTools
          aqi={aqi}
          category={category}
          profile={profile}
        />
      )}

      {/* Section 1: Low-Emission Daily Routines */}
      {(activeTab === "all" || activeTab === "routines") && (
        <section aria-labelledby="section-routines" className="space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <div>
              <h2 id="section-routines" className="text-base font-bold text-slate-900 dark:text-white">
                {dailyRoutines.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{dailyRoutines.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyRoutines.cards.map((card) => (
              <GuidanceCardItem
                key={card.id}
                card={card}
                isDone={completedTaskIds.has(card.id)}
                onToggleDone={handleToggleDone}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Indoor Air Quality */}
      {(activeTab === "all" || activeTab === "indoor") && (
        <section aria-labelledby="section-indoor" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <div>
              <h2 id="section-indoor" className="text-base font-bold text-slate-900 dark:text-white">
                {indoorAir.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{indoorAir.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indoorAir.cards.map((card) => (
              <GuidanceCardItem
                key={card.id}
                card={card}
                isDone={completedTaskIds.has(card.id)}
                onToggleDone={handleToggleDone}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Sustainable Alternatives */}
      {(activeTab === "all" || activeTab === "sustainable") && (
        <section aria-labelledby="section-sustainable" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <div>
              <h2 id="section-sustainable" className="text-base font-bold text-slate-900 dark:text-white">
                {sustainableAlternatives.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{sustainableAlternatives.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sustainableAlternatives.cards.map((card) => (
              <GuidanceCardItem
                key={card.id}
                card={card}
                isDone={completedTaskIds.has(card.id)}
                onToggleDone={handleToggleDone}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
