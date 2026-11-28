import React from "react";
import { LucideIcon } from "lucide-react";
import { GuidanceCard } from "@/types/guidance";
import { GuidanceCardItem } from "@/components/GuidanceCardItem";

interface GuidanceCardGridProps {
  id: string;
  icon: LucideIcon;
  iconColorClass: string;
  title: string;
  subtitle: string;
  cards: GuidanceCard[];
  completedTaskIds: Set<string>;
  onToggleDone: (id: string) => void;
}

export const GuidanceCardGrid: React.FC<GuidanceCardGridProps> = ({
  id,
  icon: Icon,
  iconColorClass,
  title,
  subtitle,
  cards,
  completedTaskIds,
  onToggleDone,
}) => {
  return (
    <section aria-labelledby={`section-${id}`} className="space-y-3 pt-1">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColorClass}`} aria-hidden="true" />
        <div>
          <h2 id={`section-${id}`} className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <GuidanceCardItem
            key={card.id}
            card={card}
            isDone={completedTaskIds.has(card.id)}
            onToggleDone={onToggleDone}
          />
        ))}
      </div>
    </section>
  );
};
