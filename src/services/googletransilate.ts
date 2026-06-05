import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { getLanguage, setLanguage, type Language } from "./localization";

export interface TranslationContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

export interface TranslationProviderProps {
  children: ReactNode;
  originalLang: string;
}

type GoogleTranslateWindow = Window &
  typeof globalThis & {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages?: string },
          elementId: string,
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  };

const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";
const GOOGLE_TRANSLATE_ELEMENT_ID = "google_translate_element";

export const TranslationContext = createContext<
  TranslationContextType | undefined
>(undefined);

const withGoogleSelect = (
  callback: (selectEl: HTMLSelectElement) => void,
  attempt = 0,
): void => {
  if (typeof document === "undefined") {
    return;
  }

  const selectEl = document.querySelector(
    ".goog-te-combo",
  ) as HTMLSelectElement | null;

  if (selectEl) {
    callback(selectEl);
    return;
  }

  if (attempt < 10) {
    window.setTimeout(() => withGoogleSelect(callback, attempt + 1), 300);
  }
};

const applyGoogleLanguage = (
  lang: Language,
  originalLang: string,
  force = false,
): void => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  withGoogleSelect((selectEl) => {
    // When selecting the original language, use originalLang value to reset
    const nextValue = lang === originalLang ? originalLang : lang;

    if (selectEl.value !== nextValue || force) {
      if (force && selectEl.value === nextValue && nextValue !== originalLang) {
        // Bounce to force re-translate
        selectEl.value = originalLang;
        selectEl.dispatchEvent(new Event("change"));
        setTimeout(() => {
          selectEl.value = nextValue;
          selectEl.dispatchEvent(new Event("change"));
        }, 100);
      } else {
        selectEl.value = nextValue;
        selectEl.dispatchEvent(new Event("change"));
      }
    }
  });
};

const useGoogleTranslateScript = (originalLang: string): void => {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const googleWindow = window as GoogleTranslateWindow;
    const existingScript = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID);

    googleWindow.googleTranslateElementInit = () => {
      const TranslateElement = googleWindow.google?.translate?.TranslateElement;

      if (!TranslateElement || document.querySelector(".goog-te-combo")) {
        return;
      }

      new TranslateElement(
        {
          pageLanguage: originalLang,
          includedLanguages: "en,fr,rw,sw",
        },
        GOOGLE_TRANSLATE_ELEMENT_ID,
      );
    };

    if (existingScript) {
      googleWindow.googleTranslateElementInit();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, [originalLang]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const clearGoogleHoverState = (): void => {
      document.querySelectorAll(".goog-text-highlight").forEach((node) => {
        const element = node as HTMLElement;
        element.classList.remove("goog-text-highlight");
        element.removeAttribute("style");
      });

      document
        .querySelectorAll(
          'font[style*="background"], font[style*="background-color"], span[style*="background"], span[style*="background-color"]',
        )
        .forEach((node) => {
          const element = node as HTMLElement;
          element.style.background = "transparent";
          element.style.backgroundColor = "transparent";
          element.style.boxShadow = "none";
          element.style.border = "none";
        });
    };

    const removeGoogleTooltips = (): void => {
      document.querySelectorAll("body > div").forEach((node) => {
        const element = node as HTMLElement;
        const className =
          typeof element.className === "string" ? element.className : "";
        const id = element.id ?? "";

        if (
          className.includes("goog-") ||
          className.includes("VIpgJd-") ||
          id.includes("goog-")
        ) {
          element.remove();
        }
      });
    };

    const observer = new MutationObserver(() => {
      clearGoogleHoverState();
      removeGoogleTooltips();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const intervalId = window.setInterval(() => {
      clearGoogleHoverState();
      removeGoogleTooltips();
    }, 250);

    const handlePointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null;

      if (
        target &&
        (target.classList.contains("goog-text-highlight") ||
          target.tagName === "FONT" ||
          Boolean(target.closest(".goog-text-highlight")))
      ) {
        event.stopPropagation();
      }
    };

    document.addEventListener("mouseover", handlePointerOver, true);
    clearGoogleHoverState();
    removeGoogleTooltips();

    return () => {
      window.clearInterval(intervalId);
      observer.disconnect();
      document.removeEventListener("mouseover", handlePointerOver, true);
    };
  }, []);
};

export const TranslationProvider: FC<TranslationProviderProps> = ({
  children,
  originalLang,
}) => {
  useGoogleTranslateScript(originalLang);
  const location = useLocation();
  const [language, setCurrentLanguage] = useState<Language>("en");
  const [hasUserChangedLanguage, setHasUserChangedLanguage] = useState(false);

  // Check if there's a stored language preference on mount
  useEffect(() => {
    const storedLang = getLanguage();
    if (storedLang !== "en") {
      setCurrentLanguage(storedLang);
      setHasUserChangedLanguage(true);
      // Apply stored language after Google Translate loads
      setTimeout(() => {
        applyGoogleLanguage(storedLang, originalLang, false);
      }, 1000);
    }
  }, [originalLang]);

  // Only apply translation on route change if user has explicitly changed language and it's not English
  useEffect(() => {
    if (hasUserChangedLanguage && language !== "en") {
      applyGoogleLanguage(language, originalLang, false);
    }
  }, [location.pathname, language, originalLang, hasUserChangedLanguage]);

  const contextValue = useMemo<TranslationContextType>(
    () => ({
      language,
      changeLanguage: (lang: Language) => {
        setLanguage(lang);
        setCurrentLanguage(lang);
        setHasUserChangedLanguage(true);
        applyGoogleLanguage(lang, originalLang, true);
      },
    }),
    [language, originalLang],
  );

  return createElement(
    TranslationContext.Provider,
    { value: contextValue },
    createElement("div", {
      id: GOOGLE_TRANSLATE_ELEMENT_ID,
      style: { display: "none" },
    }),
    children,
  );
};

export const useTranslationContext = (): TranslationContextType => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      "useTranslationContext must be used within TranslationProvider",
    );
  }

  return context;
};
