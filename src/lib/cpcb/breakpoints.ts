import { CpcbCategory, CpcbCategoryInfo } from "@/types/air-quality";

export interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

export const PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
];

export const PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 431, cHigh: 600, iLow: 401, iHigh: 500 },
];

export const CPCB_CATEGORY_INFOS: Record<CpcbCategory, CpcbCategoryInfo> = {
  Good: {
    category: "Good",
    min: 0,
    max: 50,
    colorClass: "text-emerald-700 dark:text-emerald-300",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    hexColor: "#15803d",
    textColor: "text-emerald-900 dark:text-emerald-100",
    shortDescription: "Minimal health impact",
    healthImplication:
      "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    emoji: "🟢",
  },
  Satisfactory: {
    category: "Satisfactory",
    min: 51,
    max: 100,
    colorClass: "text-lime-700 dark:text-lime-300",
    bgClass: "bg-lime-50 dark:bg-lime-950/40",
    borderClass: "border-lime-300 dark:border-lime-700",
    hexColor: "#4d7c0f",
    textColor: "text-lime-900 dark:text-lime-100",
    shortDescription: "Minor breathing discomfort to sensitive people",
    healthImplication:
      "Acceptable air quality; sensitive individuals may experience minor breathing discomfort.",
    emoji: "🟡",
  },
  Moderate: {
    category: "Moderate",
    min: 101,
    max: 200,
    colorClass: "text-amber-800 dark:text-amber-300",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    borderClass: "border-amber-300 dark:border-amber-700",
    hexColor: "#b45309",
    textColor: "text-amber-950 dark:text-amber-100",
    shortDescription: "Discomfort for asthma & heart patients",
    healthImplication:
      "May cause breathing discomfort to people with asthma, lung or heart conditions.",
    emoji: "🟠",
  },
  Poor: {
    category: "Poor",
    min: 201,
    max: 300,
    colorClass: "text-orange-800 dark:text-orange-300",
    bgClass: "bg-orange-50 dark:bg-orange-950/40",
    borderClass: "border-orange-300 dark:border-orange-700",
    hexColor: "#c2410c",
    textColor: "text-orange-950 dark:text-orange-100",
    shortDescription: "Discomfort on prolonged exposure",
    healthImplication:
      "Breathing discomfort to most people on prolonged exposure; significant discomfort for sensitive groups.",
    emoji: "🟤",
  },
  "Very Poor": {
    category: "Very Poor",
    min: 301,
    max: 400,
    colorClass: "text-rose-800 dark:text-rose-300",
    bgClass: "bg-rose-50 dark:bg-rose-950/40",
    borderClass: "border-rose-300 dark:border-rose-700",
    hexColor: "#be123c",
    textColor: "text-rose-950 dark:text-rose-100",
    shortDescription: "Respiratory illness on prolonged exposure",
    healthImplication:
      "Can cause respiratory illness on prolonged exposure; severely affects individuals with lung or heart diseases.",
    emoji: "🔴",
  },
  Severe: {
    category: "Severe",
    min: 401,
    max: 500,
    colorClass: "text-purple-900 dark:text-purple-300",
    bgClass: "bg-purple-50 dark:bg-purple-950/40",
    borderClass: "border-purple-300 dark:border-purple-700",
    hexColor: "#7e22ce",
    textColor: "text-purple-950 dark:text-purple-100",
    shortDescription: "Severe health hazard affecting healthy people",
    healthImplication:
      "Affects healthy people and seriously impacts those with existing medical conditions. Avoid outdoor exposure.",
    emoji: "🟣",
  },
};
