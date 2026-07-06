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
            Pallotti Presse
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
            <p>Kigali,Kicukiro - Gikondo</p>
          </div>
          <div className="flex gap-4 pt-2">
            {[
              {
                href: "https://facebook.com",
                label: "Facebook",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                ),
              },
              {
                href: "https://instagram.com",
                label: "Instagram",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12c0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                ),
              },
              {
                href: "https://twitter.com",
                label: "Twitter / X",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.25 2.25h6.845l4.264 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
              {
                href: "https://linkedin.com",
                label: "LinkedIn",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-secondary-200 hover:text-primary-900 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </Container>

      <Container className="border-t border-secondary-300/20 py-5 text-xs tracking-[0.14em] uppercase">
        <p>
          © {currentYear} Pallotti Presse. All rights reserved || Powered by{" "}
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
