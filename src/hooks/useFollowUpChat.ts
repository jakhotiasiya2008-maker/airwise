"use client";

import { useState, useCallback } from "react";
import { HouseholdProfile } from "@/types/profile";
import { CpcbCategory } from "@/types/air-quality";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  engine?: "gemini" | "rule-based";
}

interface UseFollowUpChatProps {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
  language: string;
}

export interface UseFollowUpChatReturn {
  question: string;
  setQuestion: (q: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  askQuestion: (textToAsk: string) => Promise<void>;
}

/**
 * Custom hook to manage follow-up grounding chat state and server communication.
 */
export function useFollowUpChat({
  city,
  aqi,
  pm25,
  pm10,
  category,
  profile,
  language,
}: UseFollowUpChatProps): UseFollowUpChatReturn {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = useCallback(
    async (textToAsk: string): Promise<void> => {
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
    },
    [city, aqi, pm25, pm10, category, profile, language, isLoading]
  );

  return {
    question,
    setQuestion,
    messages,
    isLoading,
    askQuestion,
  };
}
