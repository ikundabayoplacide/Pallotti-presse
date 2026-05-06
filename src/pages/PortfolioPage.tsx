import heroImage from "../assets/hero.png";
import Img1 from "../assets/im1.jpeg";
import Img2 from "../assets/im2.jpeg";
import Img3 from "../assets/im3.jpeg";
import Img4 from "../assets/im4.jpeg";
import { Button, PageSection } from "../components";

const portfolioItems = [
  {
    title: "Corporate Branding Package",
    category: "Business Printing",
    description: "Complete branding suite including business cards, letterheads, and envelopes for a tech startup.",
    image: Img2,
  },
  {
    title: "Custom Product Packaging",
    category: "Packaging",
    description: "Premium packaging boxes with custom design for a luxury cosmetics brand.",
    image: Img1,
  },
  {
    title: "Event Marketing Materials",
    category: "Marketing",
    description: "Posters, banners, and flyers for a major conference event.",
    image: Img3,
  },
  {
    title: "Book Cover Design & Print",
    category: "Publications",
    description: "Professional book covers and binding for an independent publisher.",
    image: Img4,
  },
  {
    title: "Restaurant Menu Design",
    category: "Business Printing",
    description: "High-quality menu printing with custom finishes for upscale dining.",
    image: heroImage,
  },
  {
    title: "Retail Shopping Bags",
    category: "Packaging",
    description: "Branded paper bags with custom handles for a boutique store.",
    image: Img3,
  },
];

const categories = ["All", "Business Printing", "Packaging", "Marketing", "Publications"];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-custom-300 via-custom-100 to-secondary-200">
        <div className="mx-auto grid min-h-[500px] w-full max-w-7xl items-center gap-8 px-4 py-12 xxs:px-5 xs:px-6 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-16">
          <div className="space-y-8 py-4 lg:py-10">
            <div className="space-y-5">
              <h1 className="text-4xl leading-tight font-semibold text-secondary-100 xxs:text-5xl md:text-6xl">
                Our Portfolio
              </h1>
              <p className="text-sm leading-7 text-secondary-300 sm:text-base">
                Explore our collection of successful printing projects. From business cards to custom packaging, see the quality and craftsmanship we deliver.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to="/#contact" size="lg" variant="secondary">
                Start Your Project
              </Button>
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center font-semibold tracking-[0.14em] uppercase transition duration-200 px-6 py-4 text-sm sm:text-base bg-transparent text-primary-700 hover:bg-primary-400 border border-secondary-300/30"
              >
                View Projects
              </a>
            </div>
          </div>

          <div className="relative h-96 lg:h-[450px]">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-primary-900/20" />
            <div className="absolute left-0 top-1/2 hidden h-48 w-48 -translate-x-12 -translate-y-1/2 rounded-full bg-secondary-200/35 blur-3xl lg:block" />
            <div className="relative h-full overflow-hidden border border-secondary-300/15 bg-primary-900/10 shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
              <img
                src={Img4}
                alt="Portfolio showcase"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="bg-secondary-200 py-8">
        <div className="mx-auto max-w-7xl px-4 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 text-sm font-semibold tracking-[0.12em] uppercase transition border border-secondary-300/30 hover:bg-primary-700 hover:text-secondary-200 text-secondary-100"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <PageSection
        id="portfolio"
        className="bg-style-600/50"
        containerClassName="space-y-12"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Recent Projects
          </h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden bg-secondary-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-secondary-100/90 via-secondary-100/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-secondary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs tracking-[0.16em] uppercase text-custom-300">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs tracking-[0.16em] uppercase text-primary-700">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-secondary-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-secondary-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Stats Section */}
      <PageSection className="bg-secondary-200">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-700">500+</div>
            <p className="mt-2 text-sm tracking-[0.14em] uppercase text-secondary-300">
              Projects Completed
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-700">300+</div>
            <p className="mt-2 text-sm tracking-[0.14em] uppercase text-secondary-300">
              Happy Clients
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-700">15+</div>
            <p className="mt-2 text-sm tracking-[0.14em] uppercase text-secondary-300">
              Years Experience
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-700">24h</div>
            <p className="mt-2 text-sm tracking-[0.14em] uppercase text-secondary-300">
              Fast Turnaround
            </p>
          </div>
        </div>
      </PageSection>

      {/* Testimonials */}
      <PageSection className="bg-style-600/50">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
              What Our Clients Say
            </h2>
            <div className="mx-auto h-1 w-24 bg-secondary-100" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                company: "Tech Startup Inc.",
                text: "Outstanding quality and fast delivery. Our business cards look absolutely professional!",
              },
              {
                name: "Michael Chen",
                company: "Luxury Cosmetics",
                text: "The custom packaging exceeded our expectations. Highly recommend their services.",
              },
              {
                name: "Emily Rodriguez",
                company: "Event Planning Co.",
                text: "Perfect partner for all our printing needs. Always reliable and high quality.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-secondary-200 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <p className="text-base leading-7 text-secondary-300 italic">
                  "{testimonial.text}"
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-secondary-100">{testimonial.name}</p>
                  <p className="text-sm text-secondary-300">{testimonial.company}</p>
                </div>
              </div>
            ))}
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
            Let's create your next project together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            Contact us today to discuss your printing needs and get a free quote.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/#contact" size="lg" variant="primary">
              Get a Quote
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
