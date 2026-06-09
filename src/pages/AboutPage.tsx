import { useGetAboutQuery } from "../app/api/about";
import { useGetTestimonialsQuery } from "../app/api/testimonials";
import { Button, PageSection } from "../components";

const defaultValues = [
  { title: "Precision Printing", description: "We combine dependable production workflows with careful finishing so every order arrives sharp, aligned, and ready to represent your brand." },
  { title: "Flexible Orders", description: "From short custom runs to larger commercial jobs, our process adapts to packaging, promotional, and editorial printing needs." },
  { title: "Reliable Delivery", description: "We keep communication clear, timelines realistic, and output consistent so clients can plan launches and campaigns with confidence." },
];

export default function AboutPage() {
  const { data } = useGetAboutQuery();
  const about = data?.data;

  const { data: testimonialsData } = useGetTestimonialsQuery();
  const testimonials = testimonialsData?.data ?? [];

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

      {testimonials.length > 0 && (
        <PageSection className="bg-style-600/50" containerClassName="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">What Clients Say</h2>
            <div className="mx-auto h-1 w-24 bg-secondary-100" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.id} className="flex flex-col gap-4 rounded-lg border border-secondary-300/20 bg-secondary-200 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < t.rating ? 'text-yellow-400' : 'text-secondary-300/30'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-7 text-secondary-100">"{t.testimonial}"</p>
                <div className="flex items-center gap-3">
                  {t.clientImage ? (
                    <img src={t.clientImage} alt={t.clientName} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-secondary-200">
                      {t.clientName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-secondary-100">{t.clientName}</p>
                    {(t.clientPosition || t.clientCompany) && (
                      <p className="text-xs text-secondary-300">
                        {[t.clientPosition, t.clientCompany].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageSection>
      )}

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
