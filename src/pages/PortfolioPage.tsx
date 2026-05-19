import { useState } from "react";
import { useGetPortfolioItemsQuery } from "../app/api/portfolio";
import { Button, PageSection } from "../components";

const categories = ["All", "Business Printing", "Packaging", "Marketing", "Publications"];

export default function PortfolioPage() {
  const { data, isLoading, isError } = useGetPortfolioItemsQuery();
  const allItems = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? allItems
    : allItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-3xl leading-tight font-semibold text-primary-100 xxs:text-4xl md:text-5xl">
              Our Portfolio
            </h1>
            <p className="text-base leading-7 text-primary-100">
              Explore our collection of successful printing projects. From business cards to custom packaging, see the quality and craftsmanship we deliver.
            </p>
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
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded text-sm font-semibold tracking-[0.12em] uppercase transition border ${
                  activeCategory === category
                    ? "bg-primary-700 text-secondary-200 border-primary-700"
                    : "border-secondary-300/30 hover:bg-primary-700 hover:text-secondary-200 text-secondary-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <PageSection id="portfolio" className="bg-gray-300" containerClassName="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Recent Projects</h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded bg-secondary-300/20 h-80" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load portfolio. Please try again later.</p>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="text-center text-secondary-300">No projects found in this category.</p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group rounded overflow-hidden bg-secondary-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-secondary-100/90 via-secondary-100/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-secondary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs tracking-[0.16em] uppercase text-custom-300">{item.category}</p>
                    <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-[0.16em] uppercase text-primary-700">{item.category}</p>
                  <h3 className="mt-2 text-xl font-semibold text-secondary-100">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-secondary-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>

      {/* Stats Section */}
      <PageSection className="bg-secondary-200">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "500+", label: "Projects Completed" },
            { value: "300+", label: "Happy Clients" },
            { value: "15+", label: "Years Experience" },
            { value: "24h", label: "Fast Turnaround" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl font-bold text-primary-700">{stat.value}</div>
              <p className="mt-2 text-sm tracking-[0.14em] uppercase text-secondary-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* CTA Section */}
      <PageSection className="bg-primary-800">
        <div className="bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">Ready to Start?</p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">Let's create your next project together</h2>
          <div className="mt-8 flex justify-center">
            <Button to="/contact" size="lg" variant="primary">Get a Quote</Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
