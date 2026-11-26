"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { AirQualityReading } from "@/types/air-quality";
import { GuidanceResponse } from "@/types/guidance";
import { Share2, Copy, Check, MessageCircle, X } from "lucide-react";

interface ShareSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  reading: AirQualityReading;
  guidance?: GuidanceResponse | null;
}

export const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({
  isOpen,
  onClose,
  city,
  reading,
  guidance,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prepare formatted WhatsApp / Family message text
  const topActions = guidance?.sections.dailyRoutines.cards.slice(0, 3) || [];
  const actionBullets = topActions
    .map((c, i) => `${i + 1}. *${c.title}*: ${c.action}`)
    .join("\n\n");

  const summaryText = `🚨 *AirWise India - Smog Alert for ${city}*
📊 *CPCB AQI*: ${reading.aqi} (${reading.cpcbCategory})
💨 *PM2.5*: ${reading.pm25} µg/m³ | *PM10*: ${reading.pm10} µg/m³
⏰ *Measured*: ${reading.timestampIst}

*Recommended Family Actions:*
${actionBullets || "• Keep indoor spaces closed with HEPA filtration\n• Avoid early morning outdoor physical exertion\n• Eliminate indoor incense or coils"}

⚠️ _Informational smog advisory via AirWise India (PromptWars Challenge 6)_
👉 View live details: https://airwise-india.web.app`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 id="share-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {t.share.shareTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 max-h-56 overflow-y-auto text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {summaryText}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.share.copied : t.share.copySummary}</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.share.shareWhatsApp}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
