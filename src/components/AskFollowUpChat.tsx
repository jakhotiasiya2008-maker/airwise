"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useFollowUpChat } from "@/hooks/useFollowUpChat";
import { ChatPromptChips } from "./chat/ChatPromptChips";
import { ChatConversationList } from "./chat/ChatConversationList";

interface AskFollowUpChatProps {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

/**
 * Grounded AI follow-up assistant enabling users to ask personalized queries
 * (e.g. school morning walks, HEPA vs ionizer, commute safety) with prompt-injection defenses.
 */
export const AskFollowUpChat: React.FC<AskFollowUpChatProps> = ({
  city,
  aqi,
  pm25,
  pm10,
  category,
  profile,
}) => {
  const { t, language } = useLanguage();
  const { question, setQuestion, messages, isLoading, askQuestion } = useFollowUpChat({
    city,
    aqi,
    pm25,
    pm10,
    category,
    profile,
    language,
  });

  return (
    <section
      aria-label="Ask AirWise Follow-Up Assistant"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.chat.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.chat.subtitle}</p>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length === 0 && (
        <ChatPromptChips chips={t.chat.suggestedChips || []} onSelectPrompt={askQuestion} />
      )}

      {/* Chat Conversation Thread */}
      {messages.length > 0 && <ChatConversationList messages={messages} isLoading={isLoading} />}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askQuestion(question);
        }}
        className="flex items-center gap-2 pt-1"
      >
        <label htmlFor="followup-chat-input" className="sr-only">
          Ask question
        </label>
        <input
          id="followup-chat-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.chat.placeholder}
          disabled={isLoading}
          maxLength={200}
          className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-sm"
          aria-label="Send question"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </section>
  );
};
