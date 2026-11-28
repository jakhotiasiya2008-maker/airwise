import React from "react";
import { Sparkles } from "lucide-react";

interface ChatPromptChipsProps {
  chips: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const ChatPromptChips: React.FC<ChatPromptChipsProps> = ({ chips, onSelectPrompt }) => {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-semibold text-slate-400 block">
        Suggested questions for today:
      </span>
      <div className="flex flex-wrap gap-2">
        {chips.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(q)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
