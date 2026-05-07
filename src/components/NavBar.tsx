import { useState } from "react";
import { HiBars3, HiMagnifyingGlass, HiShoppingBag, HiXMark } from "react-icons/hi2";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/pplace.jpg";
import Button from "./Button";
import Container from "./Container";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolios", to: "/portfolio" },
  { label: "Posts", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
      <div className="bg-primary-800 text-secondary-200">
        <Container className="hidden items-center justify-between gap-4 py-3 text-lg lg:flex">
          <Link to="/" className="tracking-[0.1em] hover:underline">
            Send your Quotes Now
          </Link>

          <div className="flex items-center gap-6">
            <p>Call Us: +250788313617</p>
            <p>Mail Us: info@pallottipresse.com</p>
          </div>
        </Container>
      </div>

      <div className="border-b border-secondary-300/20 bg-secondary-200">
        <Container className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-xl font-semibold tracking-[0.04em] text-secondary-100 sm:text-2xl"
          >
            <img src={Logo} alt="Logo" className="h-10 w-10" />
          </Link>

          <nav className="hidden items-center gap-12 xl:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="text-lg text-primary-700 transition hover:text-secondary-100"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-secondary-100 transition hover:bg-custom-100"
              aria-label="Search"
            >
              <HiMagnifyingGlass size={18} />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-secondary-100 transition hover:bg-custom-100"
              aria-label="Cart"
            >
              <HiShoppingBag size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <Button
              to="/#contact"
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Quote
            </Button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-secondary-300/20 text-secondary-100 transition hover:bg-custom-100"
              onClick={() => setIsOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
            </button>
          </div>
        </Container>
      </div>

      {isOpen && (
        <div className="border-b border-secondary-300/20 bg-secondary-200 xl:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="text-sm text-secondary-100 transition hover:text-secondary-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
