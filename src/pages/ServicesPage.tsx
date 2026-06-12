import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { useGetServicesQuery } from "../app/api/services";
import { Button, PageSection, Pagination } from "../components";
import processBg from "../assets/im2.jpeg";
import Office from "../assets/off.jpg";


const DESCRIPTION_LIMIT = 120;

const processList = [
  { step: "01", title: "Consultation", description: "We discuss your project requirements, materials, quantity, and timeline." },
  { step: "02", title: "Design & Preparation", description: "Your files are reviewed and optimized for the best printing results." },
  { step: "03", title: "Production", description: "State-of-the-art printing with careful quality control at every stage." },
  { step: "04", title: "Finishing & Delivery", description: "Professional finishing touches and timely delivery to your location." },
];

const PER_PAGE = 8;

export default function ServicesPage() {
  const { data, isLoading, isError } = useGetServicesQuery();
  const services = data?.data ?? [];
  const [page, setPage] = useState(1);
  const [activeService, setActiveService] = useState<{ name: string; description: string; image: string } | null>(null);

  const totalPages = Math.ceil(services.length / PER_PAGE);
  const paginated = services.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
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

      <PageSection id="services" className="bg-secondary-200" containerClassName="space-y-12 py-2">
        {/* <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Our Services</h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div> */}

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
          <>
            <div className={`grid grid-cols-1 gap-6 ${paginated.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : paginated.length === 3 ? 'sm:grid-cols-3 max-w-4xl mx-auto' : paginated.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'max-w-sm mx-auto'}`}>
              {paginated.map((service, i) => (
                <div key={service.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="group overflow-hidden rounded border border-secondary-100/15 bg-style-600/50 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]">
                  <div className="relative h-64 overflow-hidden">
                    <img src={service.image} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-8">
                    <h3 className="mb-3 text-2xl font-semibold text-secondary-100">{service.name}</h3>
                    <p className="text-sm leading-7 text-secondary-100 line-clamp-3">
                      {service.description.length > DESCRIPTION_LIMIT
                        ? service.description.slice(0, DESCRIPTION_LIMIT) + "…"
                        : service.description}
                    </p>
                    {service.description.length > DESCRIPTION_LIMIT && (
                      <button onClick={() => setActiveService(service)} className="mt-2 text-sm font-semibold text-primary-700 hover:underline">Read more →</button>
                    )}
                    {service.price && <p className="mt-3 text-sm font-semibold text-primary-700">{service.price}</p>}
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </PageSection>

      {activeService && (
        <>
          <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={() => setActiveService(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="h-52 overflow-hidden rounded-t-lg shrink-0">
                <img src={activeService.image} alt={activeService.name} className="h-full w-full object-cover" />
              </div>
              <button onClick={() => setActiveService(null)} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100/60 text-secondary-200 hover:bg-secondary-100/80">
                <HiXMark className="h-5 w-5" />
              </button>
              <div className="p-6 overflow-y-auto">
                <p className="text-sm tracking-[0.18em] text-primary-700 uppercase font-semibold">{activeService.name}</p>
                <p className="mt-4 text-sm leading-7 text-secondary-100 whitespace-pre-line">{activeService.description}</p>
              </div>
            </div>
          </div>
        </>
      )}

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

      <section className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${processBg})` }}>
        <div className="absolute inset-0 bg-primary-900/75" />
        <PageSection className="relative z-10 bg-transparent">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">Our Process</h2>
                <div className="h-1 w-24 bg-white" />
              </div>
              <p className="text-base leading-7 text-white/80">We've streamlined our workflow to deliver exceptional results efficiently.</p>
              <div className="mt-6 overflow-hidden rounded shadow-[0_18px_40px_rgba(255,255,255,0.1)] h-120">
                <img src={Office} alt="" className="h-full w-full object-cover" />
              </div>
              <Button to="/contact" size="lg" variant="secondary">Start Your Project</Button>
            </div>
            <div className="space-y-6">
              {processList.map((item, i) => (
                <div key={item.step} data-reveal style={{ transitionDelay: `${i * 100}ms` }} className="flex gap-6 border-l-4 border-primary-400 bg-white/10 backdrop-blur-sm p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary-600 text-lg font-semibold text-white">{item.step}</div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-sm leading-7 text-white/80">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageSection>
      </section>

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
