"use client";

import React, { useState } from "react";
import { GuidanceResponse } from "@/types/guidance";
import { InteractiveTools } from "@/components/InteractiveTools";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { Compass, Home, Leaf } from "lucide-react";
import { GuidanceProgressTracker } from "./guidance/GuidanceProgressTracker";
import { GuidanceTabsHeader, GuidanceTabType } from "./guidance/GuidanceTabsHeader";
import { GuidanceCardGrid } from "./guidance/GuidanceCardGrid";

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

  const allCards = [...dailyRoutines.cards, ...indoorAir.cards, ...sustainableAlternatives.cards];
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
        <InteractiveTools aqi={aqi} category={category} profile={profile} />
      )}

      {/* Section 1: Low-Emission Daily Routines */}
      {(activeTab === "all" || activeTab === "routines") && (
        <GuidanceCardGrid
          id="routines"
          icon={Compass}
          iconColorClass="text-blue-600 dark:text-blue-400"
          title={dailyRoutines.title}
          subtitle={dailyRoutines.subtitle}
          cards={dailyRoutines.cards}
          completedTaskIds={completedTaskIds}
          onToggleDone={handleToggleDone}
        />
      )}

      {/* Section 2: Indoor Air Quality */}
      {(activeTab === "all" || activeTab === "indoor") && (
        <GuidanceCardGrid
          id="indoor"
          icon={Home}
          iconColorClass="text-indigo-600 dark:text-indigo-400"
          title={indoorAir.title}
          subtitle={indoorAir.subtitle}
          cards={indoorAir.cards}
          completedTaskIds={completedTaskIds}
          onToggleDone={handleToggleDone}
        />
      )}

      {/* Section 3: Sustainable Alternatives */}
      {(activeTab === "all" || activeTab === "sustainable") && (
        <GuidanceCardGrid
          id="sustainable"
          icon={Leaf}
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          title={sustainableAlternatives.title}
          subtitle={sustainableAlternatives.subtitle}
          cards={sustainableAlternatives.cards}
          completedTaskIds={completedTaskIds}
          onToggleDone={handleToggleDone}
        />
      )}
    </div>
  );
};
