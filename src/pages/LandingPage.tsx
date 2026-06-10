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

  const { data: heroData, isLoading: heroLoading } = useGetHeroSlidesQuery();
  const allSlides = heroData?.data ?? [];

  // Split by role
  const bgSlide = allSlides.find((s) => s.role === 'background' && s.active);
  const videoSlide = allSlides.find((s) => s.role === 'video' && s.active);
  const contentSlides = allSlides.filter((s) => s.role === 'slide' && s.active);
  const activeContentSlides = heroLoading ? [] : contentSlides.length > 0 ? contentSlides : staticHeroSlides;

  const bgImage = bgSlide?.image ?? (activeContentSlides[0] as { image?: string })?.image ?? "";

  const goNext = () => setActiveSlide((c) => activeContentSlides.length > 0 ? (c + 1) % activeContentSlides.length : 0);
  const goPrev = () => setActiveSlide((c) => activeContentSlides.length > 0 ? (c === 0 ? activeContentSlides.length - 1 : c - 1) : 0);

  useEffect(() => {
    if (activeContentSlides.length === 0) return;
    const interval = window.setInterval(goNext, 10000);
    return () => window.clearInterval(interval);
  }, [activeContentSlides.length]);

  // Reset slide index when slides change (e.g. after loading)
  useEffect(() => {
    setActiveSlide(0);
  }, [activeContentSlides.length]);

  // Fetch services for the Popular Services scroll
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();
  const services = servicesData?.data ?? [];

  // Fetch latest 3 blog posts for the blog preview
  const { data: blogsData } = useGetBlogsQuery();
  const latestPosts = (blogsData?.data ?? []).slice(0, 3);

  const displayProducts =
    services.length > 0
      ? services.map((s) => ({ name: s.name, image: s.image }))
      : fallbackProducts;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950" style={{ minHeight: "460px" }}>

        {/* Background — single fixed image, never changes */}
        <div className="absolute inset-0">
          {bgImage && <img src={bgImage} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-slate-900/55" />
        </div>

        {heroLoading ? (
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-start lg:px-10">
            <div className="w-full animate-pulse rounded-xl bg-white/10 md:w-[55%] md:h-[380px]" style={{ minHeight: "260px" }} />
            <div className="flex flex-col gap-3 md:w-[45%] mt-10">
              <div className="h-[300px] animate-pulse rounded-xl bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 xxs:px-5 xs:px-6 sm:px-8 md:flex-row md:items-start lg:px-10">
            {/* Left card — video or bg image */}
            <div className="w-full overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm md:w-[55%] md:h-[380px]" style={{ minHeight: "260px" }}>
              {videoSlide?.video ? (
                <video src={videoSlide.video} autoPlay loop muted playsInline className="h-full w-full object-cover" />
              ) : bgImage ? (
                <img src={bgImage} alt="" className="h-full w-full object-cover opacity-75" />
              ) : null}
            </div>

            {/* Right card + nav */}
            <div className="flex flex-col gap-2 md:w-[45%] mt-10">
              <div className="overflow-hidden rounded-xl bg-black/60 shadow-[0_12px_40px_rgba(0,0,0,0.4)]" style={{ height: "300px" }}>
                {activeContentSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`relative h-full flex-col ${ index === activeSlide ? "flex" : "hidden" }`}
                    style={{
                      backgroundImage: (slide as { image?: string }).image ? `url(${(slide as { image: string }).image})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/60 rounded-xl" />
                    <div className="relative z-10 flex h-full flex-col p-5 overflow-hidden">
                      {slide.title && (
                        <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">{slide.title}</h1>
                      )}
                      {slide.description && (
                        <>
                          <div className="my-2 h-0.5 w-12 rounded bg-primary-600" />
                          <div className="overflow-y-auto no-scrollbar space-y-1 text-sm leading-6 text-gray-100" style={{ maxHeight: '160px' }}>
                            {slide.description.split('\n').map((line, i) => {
                              const trimmed = line.trim();
                              if (!trimmed) return null;
                              const isBullet = /^(✅|[-*•]|\d+\.)/.test(trimmed);
                              return isBullet ? (
                                <div key={i}>{trimmed}</div>
                              ) : (
                                <p key={i}>{trimmed}</p>
                              );
                            })}
                          </div>
                        </>
                      )}
                      <div className="mt-auto pt-3">
                        {slide.primaryLabel && (
                          <Button to={slide.primaryLink ?? "/portfolio"} size="sm" className="rounded bg-primary-600 text-white hover:bg-primary-700">
                            {slide.primaryLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nav dots & arrows */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {activeContentSlides.map((_, index) => (
                    <button key={index} onClick={() => setActiveSlide(index)}
                      className={`rounded-full transition-all ${
                        index === activeSlide ? "h-2 w-6 bg-primary-600" : "h-2 w-2 bg-gray-400 hover:bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={goPrev} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-primary-600 hover:text-primary-600">
                    <HiArrowLeft className="h-4 w-4" />
                  </button>
                  <button onClick={goNext} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-primary-600 hover:text-primary-600">
                    <HiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
        <div className="bg-primary-600 p-8 text-center sm:p-12">
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
