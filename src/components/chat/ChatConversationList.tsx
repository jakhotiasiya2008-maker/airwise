import React from "react";
import { Cpu, Loader2 } from "lucide-react";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  engine?: "gemini" | "rule-based";
}

interface ChatConversationListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatConversationList: React.FC<ChatConversationListProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <div className="space-y-3 max-h-72 overflow-y-auto p-1">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
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
  );
};
