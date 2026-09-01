import { useState } from "react";
import type { PortfolioItem } from "../app/api/portfolio";
import { useGetPortfolioItemsQuery } from "../app/api/portfolio";
import { Button, PageSection, Pagination } from "../components";

const PER_PAGE = 9;

export default function PortfolioPage() {
  const { data, isLoading, isError } = useGetPortfolioItemsQuery();
  const allItems = data?.data ?? [];
  const categories = ["All", ...Array.from(new Set(allItems.map((item) => item.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = activeCategory === "All" ? allItems : allItems.filter((item) => item.category === activeCategory);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategory = (cat: string) => { setActiveCategory(cat); setPage(1); };
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  return (
    <>
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-3xl leading-tight font-semibold text-primary-100 xxs:text-4xl md:text-5xl">Our Portfolio</h1>
            <p className="text-base leading-7 text-primary-100">
              Explore our collection of successful printing projects. From business cards to custom packaging, see the quality and craftsmanship we deliver.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary-200 py-8">
        <div className="mx-auto max-w-7xl px-4 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategory(category)}
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

      <PageSection id="portfolio" className="bg-gray-300" containerClassName="space-y-12">
        {/* <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Recent Projects</h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div> */}

        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse rounded bg-secondary-300/20 h-80" />)}
          </div>
        )}

        {isError && <p className="text-center text-red-500">Failed to load portfolio. Please try again later.</p>}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="text-center text-secondary-300">No projects found in this category.</p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className={`grid gap-8 ${paginated.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : paginated.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'max-w-md mx-auto'}`}>
              {paginated.map((item, i) => (
                <div key={item.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="group rounded overflow-hidden bg-secondary-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]">
                  <div className="relative h-72 overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-secondary-100/90 via-secondary-100/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-secondary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-xs tracking-[0.16em] uppercase text-custom-300">{item.category}</p>
                      <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs tracking-[0.16em] uppercase text-primary-700">{item.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-secondary-100">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-secondary-100 line-clamp-3">{item.description}</p>
                    {item.description.length > 120 && (
                      <button onClick={() => setSelected(item)} className="mt-2 text-xs font-semibold text-primary-700 hover:underline">
                        Read More
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </PageSection>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row" style={{ height: '98vh' }} onClick={(e) => e.stopPropagation()}>
            {/* Left — full image */}
            <div className="md:w-1/2 overflow-hidden">
              <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
            </div>
            {/* Right — details */}
            <div className="md:w-1/2 flex flex-col bg-secondary-200">
              <div className="flex items-start justify-between border-b border-secondary-300/20 px-6 py-5">
                <div>
                  <span className="inline-block rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-secondary-200">{selected.category}</span>
                  <h3 className="mt-3 text-xl font-semibold text-secondary-100 sm:text-2xl">{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="ml-4 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-300/20 text-secondary-100 hover:bg-secondary-300/40">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <p className="text-sm leading-7 text-secondary-100">{selected.description}</p>
                {(selected.client || selected.completedDate) && (
                  <div className="flex flex-wrap gap-6 border-t border-secondary-300/20 pt-4">
                    {selected.client && (
                      <div>
                        <p className="text-xs tracking-[0.14em] uppercase text-secondary-300">Client</p>
                        <p className="mt-1 text-sm font-semibold text-secondary-100">{selected.client}</p>
                      </div>
                    )}
                    {selected.completedDate && (
                      <div>
                        <p className="text-xs tracking-[0.14em] uppercase text-secondary-300">Completed</p>
                        <p className="mt-1 text-sm font-semibold text-secondary-100">{new Date(selected.completedDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <PageSection className="bg-secondary-200">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "50M+", label: "Projects Completed" },
            { value: "12M+", label: "Happy Clients" },
            { value: "41+", label: "Years Experience" },
            { value: "12h/5days", label: "Fast Turnaround" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl font-bold text-primary-700">{stat.value}</div>
              <p className="mt-2 text-sm tracking-[0.14em] uppercase text-secondary-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection className="bg-primary-800">
        <div className="bg-primary-600 p-8 text-center sm:p-12">
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
