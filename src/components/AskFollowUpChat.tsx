"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";
import { MessageSquare, Send, Loader2, Cpu, ShieldAlert, Sparkles } from "lucide-react";

interface AskFollowUpChatProps {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  engine?: "gemini" | "rule-based";
}

export const AskFollowUpChat: React.FC<AskFollowUpChatProps> = ({
  city,
  aqi,
  pm25,
  pm10,
  category,
  profile,
}) => {
  const { t, language } = useLanguage();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (textToAsk: string) => {
    const trimmed = textToAsk.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          city,
          aqi,
          pm25,
          pm10,
          category,
          profile,
          language,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          engine: data.sourceEngine,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            language === "hi"
              ? "तकनीकी समस्या के कारण उत्तर नहीं मिला। कृपया पुनः प्रयास करें।"
              : "Unable to reach assistant. Please retry with a shorter question.",
          engine: "rule-based",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.chat.subtitle}
          </p>
        </div>
      </div>

      {/* Suggested Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Suggestions:</span>
        </span>
        {t.chat.suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(chip)}
            className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Message history */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto max-w-[85%]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 max-w-[95%] space-y-1.5"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-semibold mb-0.5">
                <span>{msg.role === "user" ? "You" : "AirWise Assistant"}</span>
                {msg.engine && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {msg.engine === "gemini" ? (
                      <>
                        <Cpu className="w-2.5 h-2.5 text-emerald-500" />
                        <span>Gemini AI</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-2.5 h-2.5 text-amber-500" />
                        <span>Rule Engine</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Grounded analysis in progress...</span>
            </div>
          )}
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(question);
        }}
        className="flex items-center gap-2"
      >
        <label htmlFor="followup-chat-input" className="sr-only">
          Ask AirWise assistant
        </label>
        <input
          id="followup-chat-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.chat.placeholder}
          maxLength={300}
          className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{t.chat.askButton}</span>
        </button>
      </form>
    </section>
  );
};
