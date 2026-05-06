import Img1 from "../assets/im1.jpeg";
import Img2 from "../assets/im2.jpeg";
import Img3 from "../assets/im3.jpeg";
import Img4 from "../assets/im4.jpeg";
import { Button, PageSection } from "../components";

const services = [
  {
    title: "Business Printing",
    description: "Professional business cards, letterheads, envelopes, and corporate stationery.",
    details: "High-quality materials, precise color matching, and fast turnaround for all your business needs.",
    image: Img2,
  },
  {
    title: "Custom Packaging",
    description: "Boxes, bags, labels, and packaging solutions that elevate your brand.",
    details: "From product boxes to shopping bags, we create packaging that protects and impresses.",
    image: Img1,
  },
  {
    title: "Marketing Materials",
    description: "Brochures, flyers, posters, and banners that capture attention.",
    details: "Eye-catching promotional materials designed to communicate your message effectively.",
    image: Img3,
  },
  {
    title: "Books & Publications",
    description: "Book covers, magazines, catalogs, and bound materials.",
    details: "Professional printing and binding services for publications of all sizes.",
    image: Img4,
  },
];

const process = [
  {
    step: "01",
    title: "Consultation",
    description: "We discuss your project requirements, materials, quantity, and timeline.",
  },
  {
    step: "02",
    title: "Design & Preparation",
    description: "Your files are reviewed and optimized for the best printing results.",
  },
  {
    step: "03",
    title: "Production",
    description: "State-of-the-art printing with careful quality control at every stage.",
  },
  {
    step: "04",
    title: "Finishing & Delivery",
    description: "Professional finishing touches and timely delivery to your location.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-custom-300 via-custom-100 to-secondary-200">
        <div className="mx-auto grid min-h-[600px] w-full items-center gap-8 px-4 py-12 xxs:px-5 xs:px-6 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-16">
          <div className="space-y-8 py-4 lg:py-10">
            <div className="space-y-5">
              <h1 className="text-4xl leading-tight font-semibold text-secondary-100 xxs:text-5xl md:text-6xl">
                Professional Printing Services for Every Need
              </h1>
              <p className="text-sm leading-7 text-secondary-300 sm:text-base">
                From business cards to custom packaging, we deliver high-quality printing solutions with precision, care, and attention to detail.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to="/#contact" size="lg" variant="secondary">
                Get a Quote
              </Button>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center font-semibold tracking-[0.14em] uppercase transition duration-200 px-6 py-4 text-sm sm:text-base bg-transparent text-primary-700 hover:bg-primary-400 border border-secondary-300/30"
              >
                View Services
              </a>
            </div>
          </div>

          <div className="relative h-96 lg:h-[500px]">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-primary-900/20" />
            <div className="absolute left-0 top-1/2 hidden h-48 w-48 -translate-x-12 -translate-y-1/2 rounded-full bg-secondary-200/35 blur-3xl lg:block" />
            <div className="relative h-full overflow-hidden border border-secondary-300/15 bg-primary-900/10 shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
              <img
                src={Img4}
                alt="Professional printing services"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <PageSection
        id="services"
        className="bg-secondary-200"
        containerClassName="space-y-12 py-2"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Our Services
          </h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group overflow-hidden bg-style-600/50 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="mb-3 text-2xl font-semibold text-secondary-100">
                  {service.title}
                </h3>
                <p className="mb-3 text-base text-secondary-300">
                  {service.description}
                </p>
                <p className="text-sm leading-7 text-secondary-300">
                  {service.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Why Choose Us */}
      <PageSection
        className="bg-style-600/50"
        containerClassName="grid gap-8 lg:grid-cols-3"
      >
        <div className="bg-secondary-200 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm tracking-[0.18em] text-secondary-300 uppercase">
            Quality Materials
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
            Premium paper stocks and vibrant inks.
          </h3>
          <p className="mt-3 text-sm leading-7 text-secondary-300">
            We use only the finest materials to ensure your prints look professional and last longer.
          </p>
        </div>

        <div className="bg-secondary-200 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm tracking-[0.18em] text-secondary-300 uppercase">
            Fast Turnaround
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
            Quick production without compromising quality.
          </h3>
          <p className="mt-3 text-sm leading-7 text-secondary-300">
            Rush orders available with same-day and next-day delivery options for urgent projects.
          </p>
        </div>

        <div className="bg-secondary-200 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm tracking-[0.18em] text-secondary-300 uppercase">
            Expert Support
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
            Dedicated team to guide your project.
          </h3>
          <p className="mt-3 text-sm leading-7 text-secondary-300">
            From consultation to delivery, our experienced team ensures your complete satisfaction.
          </p>
        </div>
      </PageSection>

      {/* Process Section */}
      <PageSection className="bg-secondary-200">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
                Our Process
              </h2>
              <div className="h-1 w-24 bg-secondary-100" />
            </div>
            <p className="text-base leading-7 text-secondary-300">
              We've streamlined our workflow to deliver exceptional results efficiently. Here's how we bring your printing projects to life.
            </p>
            <Button to="/#contact" size="lg" variant="secondary">
              Start Your Project
            </Button>
          </div>

          <div className="space-y-6">
            {process.map((item) => (
              <div
                key={item.step}
                className="flex gap-6 border-l-4 border-primary-700 bg-style-600/50 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary-700 text-lg font-semibold text-secondary-200">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary-100">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-secondary-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Image Showcase */}
      <section className="bg-style-600/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden border border-secondary-300/15 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <img
                src={Img3}
                alt="Printing samples"
                className="h-80 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden border border-secondary-300/15 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <img
                src={Img4}
                alt="Quality results"
                className="h-80 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <PageSection className="bg-primary-800">
        <div className="bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">
            Ready to Get Started?
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Let's bring your printing project to life
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            Contact us today for a free consultation and quote. Our team is ready to help you create high-quality printed materials that make an impact.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/#contact" size="lg" variant="primary">
              Request a Quote
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
