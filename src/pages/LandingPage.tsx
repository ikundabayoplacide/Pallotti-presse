import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheckBadge,
  HiClock,
  HiHandThumbUp,
  HiLightBulb,
  HiMicrophone,
} from "react-icons/hi2";
import { useGetBlogsQuery } from "../app/api/blog";
import { useGetHeroSlidesQuery } from "../app/api/heroSlides";
import { useGetServicesQuery } from "../app/api/services";
import heroImage from "../assets/im1.jpeg";
import Img2 from "../assets/im2.jpeg";
import Img3 from "../assets/im3.jpeg";
import Img4 from "../assets/im4.jpeg";
import {
  AboutUsSection,
  Button,
  PageSection,
  PartnersSection,
  ProductCard,
} from "../components";

const staticHeroSlides = [
  {
    image: Img2,
    title: "Business Cards",
    description:
      "Professional designs, high-quality materials, and fast turnaround for every meeting, event, and client introduction.",
    primaryLabel: "Read More",
    primaryLink: "/portfolio",
    secondaryLabel: "View Cards",
    secondaryLink: "/contact",
  },
  {
    image: heroImage,
    title: "Custom Packaging",
    description:
      "From boxes to bags, we create packaging solutions that protect your products and make every delivery feel premium.",
    primaryLabel: "Explore Packaging",
    primaryLink: "/portfolio",
    secondaryLabel: "Request Quote",
    secondaryLink: "/contact",
  },
  {
    image: Img3,
    title: "Marketing Materials",
    description:
      "Brochures, flyers, posters, and banners designed to communicate your message clearly and move customers to action.",
    primaryLabel: "See Services",
    primaryLink: "/services",
    secondaryLabel: "Start Project",
    secondaryLink: "/contact",
  },
  {
    image: Img4,
    title: "Books & Publications",
    description:
      "Book covers, magazines, catalogs, and bound materials delivered with crisp detail, durable stock, and confident finishing.",
    primaryLabel: "Discover More",
    primaryLink: "/publications",
    secondaryLabel: "Talk To Us",
    secondaryLink: "/contact",
  },
];

const features = [
  { label: "Integrity", icon: HiCheckBadge },
  { label: "Innovation", icon: HiLightBulb },
  { label: "Timely delivery", icon: HiClock },
  { label: "Customer care", icon: HiMicrophone },
  { label: "Proactiveness", icon: HiHandThumbUp },
];

// Fallback products shown while API loads or if no services exist
const fallbackProducts = [
  { name: "Packaging Boxes", image: heroImage },
  { name: "Business Cards", image: Img2 },
  { name: "Custom Paper Bags", image: Img3 },
  { name: "Book Covers", image: Img4 },
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: heroData } = useGetHeroSlidesQuery();
  const heroSlides = heroData?.data?.length ? heroData.data : staticHeroSlides;

  // Fetch services for the Popular Services scroll
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();
  const services = servicesData?.data ?? [];

  // Fetch latest 3 blog posts for the blog preview
  const { data: blogsData } = useGetBlogsQuery();
  const latestPosts = (blogsData?.data ?? []).slice(0, 3);

  // Use API services if available, otherwise fall back to static data
  const displayProducts =
    services.length > 0
      ? services.map((s) => ({ name: s.name, image: s.image }))
      : fallbackProducts;

  const goToPreviousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1,
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      {/* Hero Slider */}
      <section className="relative min-h-[600px] overflow-hidden bg-slate-950 sm:min-h-[460px]">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div className="absolute inset-0">
              {'video' in slide && slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={'image' in slide ? slide.image : (slide as {image: string}).image}
                  alt={'title' in slide ? slide.title ?? '' : ''}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-sky-500/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.22),transparent_28%)]" />
            </div>

            {'title' in slide && slide.title && (
              <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-start px-4 pb-44 pt-2 xxs:px-5 xs:px-6 sm:min-h-[460px] sm:pb-36 sm:px-8 lg:px-10">
                <div className="max-w-3xl space-y-4 sm:space-y-6">
                  <h1 className="max-w-2xl text-xl font-bold leading-tight text-white xxs:text-2xl sm:text-5xl md:text-6xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  {'description' in slide && slide.description && (
                    <p className="max-w-xl text-xs leading-6 text-slate-200 xxs:text-sm xxs:leading-7 sm:text-base">
                      {slide.description}
                    </p>
                  )}
                  <div className="flex flex-col gap-3 pt-1 xxs:gap-4 xxs:pt-2 sm:flex-row lg:pl-12">
                    {'primaryLabel' in slide && slide.primaryLabel && (
                      <Button
                        to={slide.primaryLink ?? '/portfolio'}
                        size="lg"
                        className="rounded-full bg-sky-500 text-sm text-white hover:bg-sky-600 xxs:text-base"
                      >
                        {slide.primaryLabel}
                      </Button>
                    )}
                    {'secondaryLabel' in slide && slide.secondaryLabel && (
                      <Button
                        to={slide.secondaryLink ?? '/contact'}
                        size="lg"
                        className="rounded-full border border-white/50 bg-white/10 text-sm text-white backdrop-blur-sm hover:bg-white/20 xxs:text-base"
                      >
                        {slide.secondaryLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Prev / Next */}
        <button
          type="button"
          onClick={goToPreviousSlide}
          className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-8"
          aria-label="Previous slide"
        >
          <HiArrowLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-8"
          aria-label="Next slide"
        >
          <HiArrowRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2 xxs:bottom-24 sm:bottom-20">
          {heroSlides.map((_slide, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === activeSlide
                  ? "bg-sky-500"
                  : "bg-white/45 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Features bar */}
        {/* <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="mx-auto max-w-5xl px-3 pb-4 xxs:px-4 xxs:pb-5 xs:px-6 sm:px-8 lg:px-10">
            <div className="rounded-[1.5rem] bg-white/95 px-3 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.16)] backdrop-blur-sm xxs:rounded-[1.75rem] xxs:px-4 xxs:py-4 sm:px-5 sm:py-5">
              <div className="flex flex-wrap items-center justify-center gap-3 xxs:gap-4 sm:gap-6 md:gap-10 lg:gap-12">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.label}
                      className="flex flex-col items-center gap-1.5 text-center xxs:gap-2"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-400 bg-white xxs:h-12 xxs:w-12 sm:h-14 sm:w-14">
                        <Icon className="h-5 w-5 text-blue-500 xxs:h-6 xxs:w-6 sm:h-7 sm:w-7" />
                      </div>
                      <p className="text-[10px] font-medium text-gray-700 xxs:text-xs sm:text-sm">
                        {feature.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div> */}
      </section>

      {/* Features bar */}
      <section className="bg-secondary-200 py-6">
        <div className="mx-auto max-w-5xl px-3 xxs:px-4 xs:px-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-700 bg-primary-700/10 sm:h-14 sm:w-14">
                    <Icon className="h-6 w-6 text-primary-700 sm:h-7 sm:w-7" />
                  </div>
                  <p className="text-xs font-semibold text-secondary-100 sm:text-sm">
                    {feature.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AboutUsSection />

      {/* Popular Services */}
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

        {servicesLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-72 w-64 shrink-0 animate-pulse rounded bg-secondary-300/20"
              />
            ))}
          </div>
        ) : displayProducts.length > 5 ? (
          // Auto-scroll when more than 5
          <div className="scroll-container">
            <div className="scroll-content">
              {[...displayProducts, ...displayProducts].map(
                (product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="flex-shrink-0 w-64"
                  >
                    <ProductCard name={product.name} image={product.image} />
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          // Grid / centered when 5 or fewer
          <div
            className={`flex flex-wrap gap-6 ${displayProducts.length === 1 ? "justify-center" : "justify-center"}`}
          >
            {displayProducts.map((product) => (
              <div key={product.name} className="w-64">
                <ProductCard name={product.name} image={product.image} />
              </div>
            ))}
          </div>
        )}
      </PageSection>

      {/* Why Choose Us */}
      <PageSection
        id="portfolio"
        className="bg-style-600/50"
        containerClassName="grid gap-8 lg:grid-cols-3"
      >
        {[
          {
            label: "Fast Delivery",
            title: "Timely production for urgent print runs.",
            desc: "From small branding jobs to larger promotional material batches, we keep schedules predictable and efficient.",
          },
          {
            label: "Sharp Finishes",
            title: "Crisp color, durable stock, and professional detail.",
            desc: "We focus on neat trimming, color consistency, and material choices that make printed products feel premium in hand.",
          },
          {
            label: "Custom Orders",
            title: "Tailored solutions for brand, retail, and event printing.",
            desc: "Whether you need packaging, cards, signage, or book covers, the layout is ready to showcase a real print-house catalog.",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-secondary-200 rounded p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
          >
            <p className="text-sm tracking-[0.18em] text-secondary-100 uppercase">
              {item.label}
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-secondary-100">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-secondary-100">
              {item.desc}
            </p>
          </div>
        ))}
      </PageSection>

      {/* Latest Blog Posts — shown only when API returns posts */}
      {latestPosts.length > 0 && (
        <PageSection
          className="bg-secondary-200"
          containerClassName="space-y-12"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
              Latest from the Blog
            </h2>
            <div className="mx-auto h-1 w-24 bg-secondary-100" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded border border-secondary-300/20 bg-style-600/50 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute left-4 top-4 rounded bg-primary-700/90 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-secondary-200">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-2 text-xs text-secondary-300">
                    {formatDate(post.createdAt)}
                  </p>
                  <h3 className="mb-3 text-lg font-semibold leading-tight text-secondary-100 transition-colors group-hover:text-primary-700 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-secondary-100 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Button
                    to={`/blog/${post.id}`}
                    variant="ghost"
                    className="text-sm font-semibold"
                  >
                    Read More →
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              to="/blog"
              variant="secondary"
              size="lg"
              className="rounded"
            >
              View All Posts
            </Button>
          </div>
        </PageSection>
      )}

      <PartnersSection />

      {/* CTA */}
      <PageSection id="blog" className="bg-primary-800">
        <div className="bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">
            Print With Confidence
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Need custom printing for your next project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            From business cards to custom packaging, we deliver high-quality
            printing solutions with precision and care.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/contact" size="lg" variant="primary">
              Request a Quote
            </Button>
          </div>
        </div>
      </PageSection>

      {/* WhatsApp floating button is rendered by Layout — visible on all public pages */}
    </>
  );
}
