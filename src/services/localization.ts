import { useSyncExternalStore } from "react";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import rw from "./locales/rw.json";

export const supportedLanguages = ["en", "rw", "fr"] as const;

export type Language = (typeof supportedLanguages)[number];

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

const LANGUAGE_STORAGE_KEY = "palloti-language";

const translations: Record<Language, TranslationTree> = {
  en,
  rw,
  fr,
};

const isBrowser = typeof window !== "undefined";

const isLanguage = (value: string): value is Language =>
  supportedLanguages.includes(value as Language);

const getStoredLanguage = (): Language | null => {
  if (!isBrowser) {
    return null;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage && isLanguage(storedLanguage) ? storedLanguage : null;
};

let currentLanguage: Language = getStoredLanguage() ?? "en";
const listeners = new Set<() => void>();

const getNestedTranslation = (
  dictionary: TranslationTree,
  key: string,
): string | undefined => {
  const value = key
    .split(".")
    .reduce<string | TranslationTree | undefined>((current, part) => {
      if (!current || typeof current === "string") {
        return undefined;
      }

      return current[part];
    }, dictionary);

  return typeof value === "string" ? value : undefined;
};

export const getLanguage = (): Language => currentLanguage;

export const setLanguage = (language: Language): void => {
  currentLanguage = language;

  if (isBrowser) {
    // Only store if it's not the default language
    if (language === "en") {
      window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useLanguage = (): Language =>
  useSyncExternalStore(subscribe, getLanguage, getLanguage);

export const getTranslations = (
  language: Language = currentLanguage,
): TranslationTree => translations[language];

export const t = (
  key: string,
  language: Language = currentLanguage,
): string => {
  const selectedLanguageValue = getNestedTranslation(
    translations[language],
    key,
  );

  if (selectedLanguageValue) {
    return selectedLanguageValue;
  }

  const fallbackValue = getNestedTranslation(translations.en, key);
  return fallbackValue ?? key;
};

export const useTranslation = () => {
  const language = useLanguage();

  return {
    language,
    t: (key: string) => t(key, language),
  };
};

export default {
  supportedLanguages,
  getLanguage,
  setLanguage,
  getTranslations,
  t,
  useLanguage,
  useTranslation,
};
