export type SupportedLanguage = "en" | "hi";

export interface TranslationDict {
  appName: string;
  tagline: string;
  skipLink: string;
  cpcbAqi: string;
  pm25: string;
  pm10: string;
  source: string;
  measured: string;
  modelledNote: string;
  lastUpdated: string;
  refresh: string;
  searchPlaceholder: string;
  useMyLocation: string;
  locating: string;
  quickCities: string;
  tabs: {
    all: string;
    routines: string;
    indoor: string;
    sustainable: string;
    tools: string;
  };
  tools: {
    title: string;
    subtitle: string;
    purifierCheckTitle: string;
    purifierCheckDesc: string;
    roomSizeLabel: string;
    cadrLabel: string;
    achLabel: string;
    verdictAdequate: string;
    verdictInadequate: string;
    whatIfTitle: string;
    whatIfDesc: string;
    exposureTimelineTitle: string;
    exposureTimelineDesc: string;
    pickCommute: string;
  };
  cards: {
    whyThisMatters: string;
    expectedImpact: string;
    done: string;
    completedCount: string;
  };
  urgency: {
    now: string;
    today: string;
    thisWeek: string;
    preventive: string;
  };
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    askButton: string;
    suggestedChips: string[];
    disclaimer: string;
  };
  share: {
    shareTitle: string;
    copySummary: string;
    copied: string;
    shareWhatsApp: string;
  };
  onboarding: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    next: string;
    back: string;
    finish: string;
    skip: string;
  };
  forecast: {
    title: string;
    subtitle: string;
    bestWindow: string;
    avoidWindow: string;
    tableFallback: string;
  };
  categories: {
    Good: string;
    Satisfactory: string;
    Moderate: string;
    Poor: string;
    VeryPoor: string;
    Severe: string;
  };
  disclaimer: string;
}
