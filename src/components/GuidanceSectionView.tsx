"use client";

import React, { useState } from "react";
import { GuidanceResponse } from "@/types/guidance";
import { GuidanceCardItem } from "@/components/GuidanceCardItem";
import { InteractiveTools } from "@/components/InteractiveTools";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { Compass, Home, Leaf } from "lucide-react";
import { GuidanceProgressTracker } from "./guidance/GuidanceProgressTracker";
import { GuidanceTabsHeader, GuidanceTabType } from "./guidance/GuidanceTabsHeader";

interface GuidanceSectionViewProps {
  guidance: GuidanceResponse;
  aqi: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

/**
 * Main Guidance Section displaying categorized action cards,
 * task completion checklist with progress tracking, and interactive tools.
 */
export const GuidanceSectionView: React.FC<GuidanceSectionViewProps> = ({
  guidance,
  aqi,
  category,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<GuidanceTabType>("all");
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const { dailyRoutines, indoorAir, sustainableAlternatives } = guidance.sections;

  const allCards = [
    ...dailyRoutines.cards,
    ...indoorAir.cards,
    ...sustainableAlternatives.cards,
  ];
  const totalTasks = allCards.length;
  const completedCount = completedTaskIds.size;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleToggleDone = (id: string): void => {
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
      <GuidanceProgressTracker
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalTasks={totalTasks}
      />

      {/* Category Navigation Tabs */}
      <GuidanceTabsHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        routinesCount={dailyRoutines.cards.length}
        indoorCount={indoorAir.cards.length}
        sustainableCount={sustainableAlternatives.cards.length}
      />

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
