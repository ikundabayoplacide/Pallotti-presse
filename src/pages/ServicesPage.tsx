import { useGetServicesQuery } from "../app/api/services";
import { Button, PageSection } from "../components";

const process = [
  { step: "01", title: "Consultation", description: "We discuss your project requirements, materials, quantity, and timeline." },
  { step: "02", title: "Design & Preparation", description: "Your files are reviewed and optimized for the best printing results." },
  { step: "03", title: "Production", description: "State-of-the-art printing with careful quality control at every stage." },
  { step: "04", title: "Finishing & Delivery", description: "Professional finishing touches and timely delivery to your location." },
];

export default function ServicesPage() {
  const { data, isLoading, isError } = useGetServicesQuery();
  const services = data?.data ?? [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-3xl leading-tight font-semibold text-primary-100 xxs:text-4xl md:text-5xl">
              Professional Printing Services for Every Need
            </h1>
            <p className="text-base leading-7 text-primary-100">
              From business cards to custom packaging, we deliver high-quality printing solutions with precision, care, and attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <PageSection id="services" className="bg-secondary-200" containerClassName="space-y-12 py-2">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Our Services</h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded border border-secondary-100/15 bg-secondary-300/20 h-80" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load services. Please try again later.</p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="group overflow-hidden rounded border border-secondary-100/15 bg-style-600/50 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-semibold text-secondary-100">{service.name}</h3>
                  <p className="text-sm leading-7 text-secondary-100">{service.description}</p>
                  {service.price && (
                    <p className="mt-3 text-sm font-semibold text-primary-700">{service.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>

      {/* Why Choose Us */}
      <PageSection className="bg-style-600/50" containerClassName="grid gap-8 lg:grid-cols-3">
        {[
          { label: "Quality Materials", title: "Premium paper stocks and vibrant inks.", desc: "We use only the finest materials to ensure your prints look professional and last longer." },
          { label: "Fast Turnaround", title: "Quick production without compromising quality.", desc: "Rush orders available with same-day and next-day delivery options for urgent projects." },
          { label: "Expert Support", title: "Dedicated team to guide your project.", desc: "From consultation to delivery, our experienced team ensures your complete satisfaction." },
        ].map((item) => (
          <div key={item.label} className="bg-secondary-200 rounded p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
            <p className="text-sm tracking-[0.18em] text-secondary-100 uppercase">{item.label}</p>
            <h3 className="mt-4 text-2xl font-semibold text-secondary-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-secondary-100">{item.desc}</p>
          </div>
        ))}
      </PageSection>

      {/* Process Section */}
      <PageSection className="bg-secondary-200">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Our Process</h2>
              <div className="h-1 w-24 bg-secondary-100" />
            </div>
            <p className="text-base leading-7 text-secondary-100">
              We've streamlined our workflow to deliver exceptional results efficiently.
            </p>
            <Button to="/contact" size="lg" variant="secondary">Start Your Project</Button>
          </div>
          <div className="space-y-6">
            {process.map((item) => (
              <div key={item.step} className="flex gap-6 border-l-4 border-primary-700 bg-style-600/50 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary-700 text-lg font-semibold text-secondary-200">{item.step}</div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary-100">{item.title}</h3>
                  <p className="text-sm leading-7 text-secondary-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* CTA Section */}
      <PageSection className="bg-primary-800">
        <div className="bg-primary-600 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">Ready to Get Started?</p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">Let's bring your printing project to life</h2>
          <div className="mt-8 flex justify-center">
            <Button to="/contact" size="lg" variant="primary">Request a Quote</Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
