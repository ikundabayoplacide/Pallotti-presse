import { useState } from "react";
import { HiBookOpen, HiCalendar, HiEye, HiLockClosed } from "react-icons/hi2";
import { useGetPublicationsQuery, type Publication } from "../app/api/publications";
import { Button, PageSection } from "../components";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getExcerpt(pub: Publication): string {
  if (pub.content) {
    const plain = pub.content.replace(/<[^>]+>/g, "");
    return plain.length > 150 ? plain.slice(0, 150) + "…" : plain;
  }
  if (pub.fileName) return `File: ${pub.fileName}`;
  return "No preview available.";
}

// ── Publication Card ──────────────────────────────────────────────────────────
function PublicationCard({ pub }: { pub: Publication }) {
  const isFileBased = Boolean(pub.fileName);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-secondary-300/20 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)]">
      <div className="relative h-48 overflow-hidden bg-primary-800/10">
        {pub.coverImage ? (
          <img src={pub.coverImage} alt={pub.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-800/10">
            <HiBookOpen className="h-16 w-16 text-primary-700/40" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {pub.featured && (
            <span className="rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-secondary-200">Featured</span>
          )}
          {pub.isPremium && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
              <HiLockClosed className="h-3 w-3" /> {pub.price}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 inline-block self-start rounded-full bg-primary-700/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary-700 uppercase">
          {pub.category}
        </span>
        <h3 className="mb-2 text-lg font-semibold leading-snug text-secondary-100 line-clamp-2">{pub.title}</h3>
        <p className="mb-4 flex-1 text-sm leading-6 text-secondary-300 line-clamp-3">{getExcerpt(pub)}</p>

        <div className="mb-4 flex items-center gap-4 text-xs text-secondary-300">
          <span className="flex items-center gap-1"><HiCalendar className="h-3.5 w-3.5" />{formatDate(pub.createdAt)}</span>
          <span className="flex items-center gap-1"><HiEye className="h-3.5 w-3.5" />{pub.views} views</span>
        </div>

        {pub.isPremium ? (
          <Button to={`/publications/${pub.id}`} variant="secondary" size="sm" className="w-full rounded flex items-center justify-center gap-2">
            <HiLockClosed className="h-4 w-4" /> Read Preview
          </Button>
        ) : isFileBased ? (
          <Button to={`/publications/${pub.id}`} variant="secondary" size="sm" className="w-full rounded">View File</Button>
        ) : (
          <Button to={`/publications/${pub.id}`} variant="secondary" size="sm" className="w-full rounded">Read More</Button>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-secondary-300/20 bg-secondary-200 animate-pulse">
      <div className="h-48 bg-primary-800/10" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 rounded bg-secondary-300/40" />
        <div className="h-5 w-4/5 rounded bg-secondary-300/40" />
        <div className="h-4 w-full rounded bg-secondary-300/30" />
        <div className="h-4 w-3/4 rounded bg-secondary-300/30" />
        <div className="mt-4 h-10 rounded bg-secondary-300/30" />
      </div>
    </div>
  );
}

export default function PublicationsPage() {
  const { data, isLoading, isError } = useGetPublicationsQuery();
  const publications = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(publications.map((p) => p.category)))];
  const filtered = activeCategory === "All" ? publications : publications.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-14">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-primary-100 xxs:text-5xl md:text-6xl">Publications</h1>
            <p className="text-lg leading-7 text-primary-100">Browse our latest publications, reports, and printed materials.</p>
          </div>
        </div>
      </section>

      <PageSection className="bg-secondary-200">
        {!isLoading && !isError && publications.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`rounded px-4 py-2 text-sm font-semibold transition ${activeCategory === cat ? "bg-primary-700 text-secondary-200" : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700/10"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HiBookOpen className="mb-4 h-16 w-16 text-secondary-300" />
            <p className="text-lg font-semibold text-secondary-100">Failed to load publications</p>
            <p className="mt-2 text-sm text-secondary-300">Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HiBookOpen className="mb-4 h-16 w-16 text-secondary-300" />
            <p className="text-lg font-semibold text-secondary-100">No publications found</p>
            <p className="mt-2 text-sm text-secondary-300">
              {activeCategory !== "All" ? `No publications in the "${activeCategory}" category yet.` : "Check back soon for new publications."}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((pub) => (
              <PublicationCard key={pub.id} pub={pub} />
            ))}
          </div>
        )}
      </PageSection>
    </>
  );
}
