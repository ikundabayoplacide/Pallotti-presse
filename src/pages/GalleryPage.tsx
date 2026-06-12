import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiXMark } from "react-icons/hi2";
import { useGetImagesQuery } from "../app/api/gallery";
import { PageSection, Pagination } from "../components";

const PER_PAGE = 12;

export default function GalleryPage() {
  const { data, isLoading, isError } = useGetImagesQuery();
  const images = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const categories = ["All", ...Array.from(new Set(images.map((img) => img.category)))];
  const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategory = (cat: string) => { setActiveCategory(cat); setPage(1); };

  const openLightbox = (img: typeof filtered[number]) => {
    const idx = filtered.findIndex((i) => i.id === img.id);
    setLightboxIndex(idx);
  };

  const goPrev = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : filtered.length - 1));
  const goNext = () => setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : 0));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  return (
    <>
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-3xl font-semibold leading-tight text-primary-100 xxs:text-4xl md:text-5xl">Gallery</h1>
            <p className="text-base leading-7 text-primary-100">
              Browse our work — a visual showcase of printing, design, and packaging projects.
            </p>
          </div>
        </div>
      </section>

      <PageSection className="bg-secondary-200" containerClassName="space-y-8">
        {!isLoading && !isError && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`rounded px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? "bg-primary-700 text-secondary-200"
                    : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-secondary-300/20" />
            ))}
          </div>
        )}

        {isError && (
          <p className="py-20 text-center text-red-500">Failed to load gallery. Please try again later.</p>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="py-20 text-center text-secondary-300">
            {activeCategory !== "All" ? `No images in "${activeCategory}".` : "No images yet."}
          </p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paginated.map((img, i) => (
                <div
                  key={img.id}
                  data-reveal
                  style={{ transitionDelay: `${(i % 4) * 80}ms` }}
                  onClick={() => openLightbox(img)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-secondary-300/20 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                >
                  <img
                    src={img.image}
                    alt={img.title ?? img.category}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-secondary-100/0 transition-all duration-300 group-hover:bg-secondary-100/40" />
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-secondary-100/80 px-3 py-2 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="truncate text-xs font-semibold text-secondary-200">{img.title}</p>
                      <p className="text-xs text-secondary-400">{img.category}</p>
                    </div>
                  )}
                  {img.featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-primary-700 px-2 py-0.5 text-xs font-semibold text-secondary-200">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </PageSection>

      {lightboxIndex !== null && (() => {
        const img = filtered[lightboxIndex];
        return (
          <>
            <div className="fixed inset-0 z-50 bg-secondary-100/90 backdrop-blur-sm" onClick={() => setLightboxIndex(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <button onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-200/20 text-secondary-200 transition hover:bg-secondary-200/40">
                <HiXMark className="h-6 w-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-200/20 text-secondary-200 transition hover:bg-secondary-200/40">
                <HiArrowLeft className="h-6 w-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-200/20 text-secondary-200 transition hover:bg-secondary-200/40">
                <HiArrowRight className="h-6 w-6" />
              </button>
              <img src={img.image} alt={img.title ?? img.category} className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-[0_30px_60px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()} />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-secondary-200/70">{lightboxIndex + 1} / {filtered.length}</p>
            </div>
          </>
        );
      })()}
    </>
  );
}
