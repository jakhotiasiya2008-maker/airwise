"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { MessageSquare, Send, Loader2, Cpu, ShieldAlert, Sparkles } from "lucide-react";
import { useFollowUpChat } from "@/hooks/useFollowUpChat";

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
  const {
    question,
    setQuestion,
    messages,
    isLoading,
    askQuestion,
  } = useFollowUpChat({
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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.chat.subtitle}
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length === 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Suggested questions for today:
          </span>
          <div className="flex flex-wrap gap-2">
            {(t.chat.suggestedChips || []).map((q: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => askQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Conversation Thread */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto p-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80"
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              </div>

              {msg.role === "assistant" && msg.engine && (
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5" />
                  <span>
                    Answered by {msg.engine === "gemini" ? "Gemini 2.5 Flash" : "Rule-based engine"}
                  </span>
                </span>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing live CPCB parameters & medical guidelines...</span>
            </div>
          )}
        </div>
      )}

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
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </section>
  );
};
