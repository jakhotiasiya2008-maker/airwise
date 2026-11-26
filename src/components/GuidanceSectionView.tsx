import React, { useState } from "react";
import { GuidanceResponse } from "@/types/guidance";
import { GuidanceCardItem } from "@/components/GuidanceCardItem";
import { Compass, Home, Leaf } from "lucide-react";

interface GuidanceSectionViewProps {
  guidance: GuidanceResponse;
}

export const GuidanceSectionView: React.FC<GuidanceSectionViewProps> = ({ guidance }) => {
  const [activeTab, setActiveTab] = useState<"all" | "routines" | "indoor" | "sustainable">("all");

  const { dailyRoutines, indoorAir, sustainableAlternatives } = guidance.sections;

  return (
    <div className="space-y-6">
      {/* Category Navigation Pills */}
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
          All Recommendations
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
          <span>Daily Routines ({dailyRoutines.cards.length})</span>
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
          <span>Indoor Air ({indoorAir.cards.length})</span>
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
          <span>Sustainable Alternatives ({sustainableAlternatives.cards.length})</span>
        </button>
      </div>

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
              <GuidanceCardItem key={card.id} card={card} />
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
              <GuidanceCardItem key={card.id} card={card} />
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
              <GuidanceCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
