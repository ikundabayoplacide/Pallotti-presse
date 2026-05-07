import { HiEnvelope, HiMapPin, HiMinus, HiPhone, HiPlus } from "react-icons/hi2";
import { Button, PageSection } from "../components";
import { useState } from "react";

const contactInfo = [
  {
    icon: HiPhone,
    title: "Phone",
    details: ["+250 788 313 617", "+250 123 456 789"],
    description: "Mon-Fri from 8am to 5pm",
  },
  {
    icon: HiEnvelope,
    title: "Email",
    details: ["info@pallottipresse.com", "support@pallottipresse.com"],
    description: "We'll respond within 24 hours",
  },
  {
    icon: HiMapPin,
    title: "Office",
    details: ["Kigali, Rwanda", "KG 123 St, Kimironko"],
    description: "Visit us during business hours",
  },
];

const faqs = [
  {
    question: "What is your turnaround time?",
    answer: "Standard orders are completed within 3-5 business days. Rush orders with same-day or next-day delivery are available upon request.",
  },
  {
    question: "Do you offer design services?",
    answer: "Yes! Our team can help with design or we can work with your existing files. We'll review all files for print readiness before production.",
  },
  {
    question: "What file formats do you accept?",
    answer: "We accept PDF, AI, EPS, PSD, and high-resolution JPG/PNG files. PDF is preferred for best results.",
  },
  {
    question: "Do you have minimum order quantities?",
    answer: "Minimum quantities vary by product. Contact us for specific details about your project.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl leading-tight font-semibold text-primary-100 xxs:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <p className="text-xl leading-7 text-primary-100">
              Have a question or ready to start your printing project? We're here to help. Reach out and let's discuss how we can bring your vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <PageSection className="bg-secondary-200">
        <div className="grid gap-8 md:grid-cols-3">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="bg-style-600/50 rounded border border-gray-400 p-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-700 text-secondary-200">
                <info.icon size={28} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-secondary-100">
                {info.title}
              </h3>
              <div className="mt-4 space-y-1">
                {info.details.map((detail) => (
                  <p key={detail} className="text-base text-secondary-100">
                    {detail}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-700">
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Contact Form & Map */}
      <PageSection className="bg-style-600/50">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <div>
            <div className="mb-8 space-y-4">
              <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
                Send Us a Message
              </h2>
              <div className="h-1 w-24 bg-secondary-100" />
              <p className="text-base leading-7 text-secondary-100">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form className="space-y-6 rounded border border-secondary-300/30 bg-secondary-200 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-secondary-100"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-secondary-100"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-secondary-100"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-secondary-100"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
                  placeholder="+250 788 313 617"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-semibold text-secondary-100"
                >
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                >
                  <option value="">Select a service</option>
                  <option value="business-printing">Business Printing</option>
                  <option value="custom-packaging">Custom Packaging</option>
                  <option value="marketing-materials">Marketing Materials</option>
                  <option value="books-publications">Books & Publications</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-secondary-100"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button type="submit" size="lg" variant="secondary" className="w-full rounded sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-8">
            {/* Map */}
            <div className="overflow-hidden border border-secondary-300/15 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <div className="relative h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.84238336778!2d30.058570!3d-1.9440727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xe9b7e68a6a8b5bb!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location Map"
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-secondary-200 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
              <h3 className="mb-6 text-xl font-semibold text-secondary-100">
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-100">Monday - Friday</span>
                  <span className="font-semibold text-secondary-100">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-100">Saturday</span>
                  <span className="font-semibold text-secondary-100">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-100">Sunday</span>
                  <span className="font-semibold text-secondary-100">Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-primary-800 p-8 text-secondary-200">
              <h3 className="mb-4 text-xl font-semibold">
                Need Immediate Assistance?
              </h3>
              <p className="mb-6 text-lg leading-7 text-secondary-400">
                For urgent inquiries or rush orders, please call us directly.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+250788313617"
                  className="block text-lg font-semibold text-custom-300 hover:underline"
                >
                  +250 788 313 617
                </a>
                <a
                  href="mailto:info@pallottipresse.com"
                  className="block text-lg text-secondary-400 hover:text-secondary-200"
                >
                  info@pallottipresse.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* FAQ Section */}
      <PageSection className="bg-secondary-200">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto h-1 w-24 bg-secondary-100" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded border border-secondary-300/20 bg-style-600/50 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-secondary-200/50"
                >
                  <h3 className="text-lg font-semibold text-secondary-100 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-secondary-200 transition-transform">
                    {openFaq === index ? (
                      <HiMinus size={20} />
                    ) : (
                      <HiPlus size={20} />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-base leading-7 text-secondary-100">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-base text-secondary-300">
              Have more questions?
            </p>
            <Button to="/services" variant="ghost">
              View Our Services
            </Button>
          </div>
        </div>
      </PageSection>

      {/* CTA Section */}
      <PageSection className="bg-primary-800">
        <div className="bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">
            Ready to Start?
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Let's create something amazing together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            Whether you need business cards, custom packaging, or large-format printing, we're here to help bring your vision to life.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button to="/portfolio" size="lg" variant="primary">
              View Our Work
            </Button>
            <Button to="/services" size="lg" variant="ghost" className="border-secondary-200/30 text-secondary-200 hover:bg-secondary-200/10">
              Our Services
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
