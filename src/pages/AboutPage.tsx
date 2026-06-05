import { useGetAboutQuery } from "../app/api/about";
import { Button, PageSection } from "../components";

const defaultValues = [
  { title: "Precision Printing", description: "We combine dependable production workflows with careful finishing so every order arrives sharp, aligned, and ready to represent your brand." },
  { title: "Flexible Orders", description: "From short custom runs to larger commercial jobs, our process adapts to packaging, promotional, and editorial printing needs." },
  { title: "Reliable Delivery", description: "We keep communication clear, timelines realistic, and output consistent so clients can plan launches and campaigns with confidence." },
];

export default function AboutPage() {
  const { data } = useGetAboutQuery();
  const about = data?.data;

  const heroTitle = about?.heroTitle ?? "Built to deliver clean, confident print for modern brands.";
  const heroDescription = about?.heroDescription ?? "Pallotti Press supports businesses, events, and creators with professional printing services that balance visual quality, fast turnaround, and dependable production.";
  const values = about?.values?.length ? about.values : defaultValues;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-3xl leading-tight font-semibold text-primary-100 xxs:text-4xl md:text-5xl">
              {heroTitle}
            </h1>
            <p className="text-base leading-7 text-primary-100">{heroDescription}</p>
          </div>
        </div>
      </section>

      <PageSection className="bg-secondary-200" containerClassName="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Why Clients Choose Us</h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-4xl border border-secondary-100/15 bg-style-600/70 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-3xl font-semibold text-secondary-100">{value.title}</h3>
              <p className="mt-4 text-lg leading-7 text-secondary-100">{value.description}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection className="bg-primary-800">
        <div className="rounded-[2.25rem] bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-lg tracking-[0.18em] text-custom-100 uppercase font-bold">
            Start Your Next Print Project
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Ready to turn your ideas into polished print materials?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            We can help with packaging, cards, branded paper goods, and custom print work designed to match your goals and timeline.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/contact" size="lg" variant="primary">Contact the Team</Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
