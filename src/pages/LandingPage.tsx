import { useEffect, useState } from "react";
import heroImage from "../assets/im1.jpeg";
import Img2 from "../assets/im2.jpeg";
import Img3 from "../assets/im3.jpeg";
import Img4 from "../assets/im4.jpeg";
import {
  Button,
  PageSection,
  ProductCard,
} from "../components";

const products = [
  { name: "Packaging Boxes", price: "$32.36", image: heroImage },
  { name: "Business Cards", price: "$32.36", image: Img2 },
  { name: "Custom Paper Bags", price: "$32.36", image: Img3 },
  { name: "Book Covers", price: "$32.36", image: Img4 },
];

const heroSlides = [heroImage, Img2, Img3, Img4];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <section className="bg-linear-to-r from-custom-300 via-custom-100 to-secondary-200">
        <div className="mx-auto grid min-h-140 w-full items-center gap-8 px-4 py-12 xxs:px-5 xs:px-6 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-12">
          <div className="space-y-8 py-4 lg:py-10">
            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl leading-tight font-semibold text-secondary-100 xxs:text-5xl md:text-6xl">
                Bring Your Designs to Life with Our Professional Printing
              </h1>
              <p className="max-w-xl text-sm leading-7 text-secondary-100 sm:text-base">
                We create premium boxes, business cards, paper bags, book
                covers, and custom print materials with clean finishing, fast
                turnaround, and a polished brand presentation.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to="/#contact" size="lg" variant="secondary">
                Get Quote
              </Button>
              <Button to="/#services" size="lg" variant="ghost">
                Explore Services
              </Button>
            </div>
          </div>

          <div className="relative h-full min-h-80">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-primary-900/20" />
            <div className="absolute left-0 top-1/2 hidden h-48 w-48 -translate-x-12 -translate-y-1/2 rounded-full bg-secondary-200/35 blur-3xl lg:block" />
            <div className="relative h-full overflow-hidden border border-secondary-300/15 bg-primary-900/10 shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
              {heroSlides.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === activeSlide
                      ? "translate-x-0 opacity-100"
                      : index < activeSlide
                        ? "-translate-x-full opacity-0"
                        : "translate-x-full opacity-0"
                  }`}
                >
                  <img
                    src={image}
                    alt="Professional printing machine producing colorful materials"
                    className="h-full min-h-80 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PageSection
        id="services"
        className="bg-secondary-200"
        containerClassName="space-y-12 py-2"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Popular Services
          </h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </PageSection>

      <PageSection
        id="portfolio"
        className="bg-style-600/50"
        containerClassName="grid gap-8 lg:grid-cols-3"
      >
        <div className=" bg-secondary-200 rounded p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm tracking-[0.18em] text-secondary-100 uppercase">
            Fast Delivery
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
            Timely production for urgent print runs.
          </h3>
          <p className="mt-3 text-sm leading-7 text-secondary-100">
            From small branding jobs to larger promotional material batches, we
            keep schedules predictable and efficient.
          </p>
        </div>

        <div className=" bg-secondary-200 rounded p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm tracking-[0.18em] text-secondary-100 uppercase">
            Sharp Finishes
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
            Crisp color, durable stock, and professional detail.
          </h3>
          <p className="mt-3 text-sm leading-7 text-secondary-100">
            We focus on neat trimming, color consistency, and material choices
            that make printed products feel premium in hand.
          </p>
        </div>

        <div className=" bg-secondary-200 rounded p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm tracking-[0.18em] text-secondary-100 uppercase">
            Custom Orders
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
            Tailored solutions for brand, retail, and event printing.
          </h3>
          <p className="mt-3 text-sm leading-7 text-secondary-100">
            Whether you need packaging, cards, signage, or book covers, the
            layout is ready to showcase a real print-house catalog.
          </p>
        </div>
      </PageSection>

      <PageSection id="blog" className="bg-primary-800">
        <div className=" bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">
            Print With Confidence
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Need custom printing for your next project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            Use this landing page as the foundation and swap in real product
            photography, pricing, and service details as your content grows.
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
