import Container from "./Container";

const footerLinks = [
  "Editorial Design",
  "Print Production",
  "Publishing Support",
  "Creative Direction",
];

export default function Footer() {
      const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t border-secondary-300/20 bg-primary-900 text-secondary-400"
    >
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold tracking-[0.18em] text-secondary-200 uppercase">
            Pallotti Press
          </p>
          <p className="max-w-md text-sm leading-7">
            Reusable publishing-focused UI, editorial storytelling, and
            responsive layouts built with a consistent visual language.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm tracking-[0.18em] text-secondary-200 uppercase">
            Services
          </p>
          <ul className="space-y-3 text-sm">
            {footerLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm tracking-[0.18em] text-secondary-200 uppercase">
            Contact
          </p>
          <div className="space-y-3 text-sm">
            <p>info@pallottipresse.com</p>
            <p>+250788313617</p>
            <p>Kigali - Gikondo</p>
          </div>
        </div>
      </Container>

      <Container className="border-t border-secondary-300/20 py-5 text-xs tracking-[0.14em] uppercase">
        <p>
          © {currentYear} Pallotti Press. All rights reserved || Powered by{" "}
          <a
            href="https://santechinnovate.com/"
            className="hover:text-primary-500 text-primary-600"
          >
            SAN TECH
          </a>
        </p>
      </Container>
    </footer>
  );
}
