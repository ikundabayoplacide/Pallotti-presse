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
      className="border-t border-secondary-300/20 bg-primary-600 text-secondary-200"
    >
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-2xl font-semibold tracking-[0.18em] text-secondary-200 uppercase">
            Pallotti Press
          </p>
          <p className="max-w-md text-lg leading-7">
            Where creativity meets precision, that's where our printing and
            publishing services thrive. Let us be the ink to your paper dreams.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-2xl tracking-[0.18em] text-secondary-200 uppercase">
            Services
          </p>
          <ul className="space-y-3 text-lg">
            {footerLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-2xl tracking-[0.18em] text-secondary-200 uppercase">
            Contact
          </p>
          <div className="space-y-3 text-lg">
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
            className="hover:text-primary-700 text-primary-900 font-bold"
          >
            SAN TECH
          </a>
        </p>
      </Container>
    </footer>
  );
}
