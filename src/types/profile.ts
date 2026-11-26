export type CommuteMode =
  | "metro"
  | "bus"
  | "car"
  | "bike"
  | "walk"
  | "auto_rickshaw"
  | "wfh";

export interface HouseholdProfile {
  hasYoungChildren: boolean;
  hasSeniors: boolean;
  hasStudents: boolean;
  isDailyCommuter: boolean;
  hasRespiratorySensitivity: boolean; // Asthma, COPD, bronchitis, etc.
  commuteMode: CommuteMode;
  hasAirPurifier: boolean;
  hasIndoorPlants: boolean;
  customNotes?: string;
}

export interface PersonaPreset {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  profile: HouseholdProfile;
  focusHighlights: string[];
}
