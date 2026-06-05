import { useRef, useState } from "react";
import { HiChevronDown, HiGlobeAlt } from "react-icons/hi2";
import { useTranslationContext } from "../services/googletransilate";
import type { Language } from "../services/localization";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
];

interface LanguageSwitcherProps {
  /** "light" = for dark/blue bg, "dark" = for white bg */
  variant?: "light" | "dark";
}

export default function LanguageSwitcher({ variant = "dark" }: LanguageSwitcherProps) {
  const { language, changeLanguage } = useTranslationContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language) ?? languages[0];

  const btnClass =
    variant === "light"
      ? "text-white hover:bg-white/20 border-white/30"
      : "text-primary-800 hover:bg-primary-600/10 border-primary-600/30";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-sm font-medium transition ${btnClass}`}
      >
        <HiGlobeAlt className="h-4 w-4" />
        <span>{current.flag} {current.label}</span>
        <HiChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded border border-secondary-300/20 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-primary-600 hover:text-white ${
                  language === lang.code
                    ? "bg-primary-600 text-white font-semibold"
                    : "text-primary-800"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
