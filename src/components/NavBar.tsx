import { useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/palloti.png";
import { useTranslation } from "../services/localization";
import Container from "./Container";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { key: "nav.home", to: "/" },
    { key: "nav.about", to: "/about" },
    { key: "nav.services", to: "/services" },
    { key: "nav.portfolio", to: "/portfolio" },
    { key: "nav.blog", to: "/blog" },
    { key: "nav.gallery", to: "/gallery" },
    { key: "nav.publications", to: "/publications" },
    { key: "nav.contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* Info bar */}
      <div className="bg-primary-800 text-secondary-200 overflow-hidden max-h-8">
        <Container className="hidden items-center justify-between gap-4 py-1 text-xs lg:flex">
          SOCIETE DE L’APOSTOLAT CATHOLIQUE
          <div className="flex items-center gap-6">
            <p>Call Us: +250788313617</p>
            <p>Mail Us: info@pallottipresse.com</p>
          </div>
        </Container>
      </div>

      {/* ── DESKTOP: Three-band layout ── */}
      <div className="hidden xl:block relative">
        {/* Top blue band */}
        <div className="bg-primary-600 h-5 w-full" />

        {/* White nav band — nav links + language switcher */}
        <div className="bg-white w-full">
          <div className="flex items-center justify-end pr-4">
            <nav className="flex items-center gap-0 py-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-1 text-sm font-medium transition ${
                      isActive
                        ? "text-primary-600 font-semibold border-b-2 border-primary-600"
                        : "text-primary-800 hover:text-primary-600"
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>
            {/* Language switcher as dropdown in white strip */}
            <div className="ml-4 border-l border-secondary-300/30 pl-4 py-1">
              <LanguageSwitcher variant="dark" />
            </div>
          </div>
        </div>

        {/* Bottom blue band */}
        <div className="bg-primary-600 h-5 w-full" />

        {/* Logo spanning all three bands */}
        <Link
          to="/"
          className="absolute left-8 top-1 bottom-0 flex items-center bottom-1"
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-full w-auto max-h-full rounded-full border-2 border-white object-cover"
          />
        </Link>
      </div>

      {/* ── MOBILE: Three-band layout ── */}
      <div className="xl:hidden relative">
        {/* Top blue band */}
        <div className="bg-primary-600 h-4 w-full" />

        {/* White center band — language switcher + quote + hamburger */}
        <div className="bg-white w-full flex items-center justify-end gap-2 px-4 py-1.5">
          <LanguageSwitcher variant="dark" />
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center rounded border border-primary-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 transition hover:bg-primary-600 hover:text-white"
          >
            {t("nav.quote")}
          </Link>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-primary-600 text-primary-600 transition hover:bg-primary-600 hover:text-white"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <HiXMark size={18} /> : <HiBars3 size={18} />}
          </button>
        </div>

        {/* Bottom blue band */}
        <div className="bg-primary-600 h-4 w-full" />

        {/* Logo spanning all three bands */}
        <Link
          to="/"
          className="absolute left-4 top-0 bottom-0 flex items-center"
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-full w-auto max-h-full rounded-full border-2 border-white object-cover"
          />
        </Link>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="border-b border-secondary-300/20 bg-secondary-200 xl:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition rounded ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-primary-800 hover:bg-primary-600 hover:text-white"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
