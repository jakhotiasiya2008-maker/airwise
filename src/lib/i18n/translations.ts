/**
 * Translations Dictionary for AirWise India
 * Localized in English and Hindi
 */

import { SupportedLanguage, TranslationDict } from "./types";
import { enTranslation } from "./locales/en";
import { hiTranslation } from "./locales/hi";

export type { SupportedLanguage, TranslationDict };

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: enTranslation,
  hi: hiTranslation,
};
