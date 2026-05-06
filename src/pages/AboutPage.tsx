import Img2 from "../assets/im2.jpeg";
import Img3 from "../assets/im3.jpeg";
import { Button, PageSection } from "../components";

const values = [
  {
    title: "Precision Printing",
    description:
      "We combine dependable production workflows with careful finishing so every order arrives sharp, aligned, and ready to represent your brand.",
  },
  {
    title: "Flexible Orders",
    description:
      "From short custom runs to larger commercial jobs, our process adapts to packaging, promotional, and editorial printing needs.",
  },
  {
    title: "Reliable Delivery",
    description:
      "We keep communication clear, timelines realistic, and output consistent so clients can plan launches and campaigns with confidence.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-linear-to-r from-custom-300 via-custom-100 to-secondary-200">
        <div className="mx-auto grid min-h-128 w-full max-w-7xl items-center gap-10 px-4 py-12 xxs:px-5 xs:px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-16">
          <div className="space-y-6">
            
            <h1 className="max-w-2xl text-4xl leading-tight font-semibold text-secondary-100 xxs:text-5xl md:text-6xl">
              Built to deliver clean, confident print for modern brands.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-secondary-300 sm:text-base">
              Pallotti Press supports businesses, events, and creators with
              professional printing services that balance visual quality, fast
              turnaround, and dependable production.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to="/#contact" size="lg" variant="secondary">
                Request a Quote
              </Button>
              <Button to="/" size="lg" variant="ghost">
                Back to Home
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-4xl border border-secondary-300/15 bg-secondary-200 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
              <img
                src={Img2}
                alt="Business card printing sample"
                className="h-72 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-4xl border border-secondary-300/15 bg-secondary-200 shadow-[0_24px_60px_rgba(0,0,0,0.14)] sm:translate-y-10">
              <img
                src={Img3}
                alt="Paper bag printing sample"
                className="h-72 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <PageSection className="bg-secondary-200" containerClassName="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Why Clients Choose Us
          </h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-4xl bg-style-600/70 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-2xl font-semibold text-secondary-100">
                {value.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-secondary-300">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection className="bg-primary-800">
        <div className="rounded-[2.25rem] bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">
            Start Your Next Print Project
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Ready to turn your ideas into polished print materials?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            We can help with packaging, cards, branded paper goods, and custom
            print work designed to match your goals and timeline.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/#contact" size="lg" variant="primary">
              Contact the Team
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
