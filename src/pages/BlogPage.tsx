import { useState } from "react";
import { useGetBlogsQuery } from "../app/api/blog";
import { Button, PageSection, Pagination } from "../components";

const categories = ["All Posts", "Design Tips", "Packaging", "Marketing", "Printing Basics", "Sustainability"];
const PER_PAGE = 9;

export default function BlogPage() {
  const { data, isLoading, isError } = useGetBlogsQuery();
  const allPosts = data?.data ?? [];
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [page, setPage] = useState(1);

  const filtered = activeCategory === "All Posts"
    ? allPosts
    : allPosts.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategory = (cat: string) => { setActiveCategory(cat); setPage(1); };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-3xl leading-tight font-semibold text-primary-100 xxs:text-4xl md:text-5xl">
              Print Insights & Tips
            </h1>
            <p className="text-base leading-7 text-primary-100">
              Expert advice, industry trends, and practical tips to help you make the most of your printing projects.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-style-600/30 py-8">
        <div className="mx-auto max-w-7xl px-4 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategory(category)}
                className={`px-6 py-2 rounded text-sm font-semibold tracking-[0.12em] uppercase transition border ${
                  activeCategory === category
                    ? "bg-primary-700 text-secondary-200 border-primary-700"
                    : "border-secondary-300/30 hover:bg-primary-700 hover:text-secondary-200 text-secondary-100 bg-secondary-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <PageSection id="blog" className="bg-secondary-200" containerClassName="space-y-12">
        {/* <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Latest Articles</h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div> */}

        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded bg-secondary-300/20 h-80" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load blog posts. Please try again later.</p>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="text-center text-secondary-300">No posts found in this category.</p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className={`grid gap-8 ${paginated.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : paginated.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'max-w-md mx-auto'}`}>
              {paginated.map((post, i) => (
                <article
                  key={post.id}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                  className="group border border-gray-300 rounded overflow-hidden bg-style-600/50 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
                >
                  <div className="relative h-56 overflow-hidden">
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
                    <div className="mb-3 flex items-center gap-3 text-xs text-secondary-300">
                      <span className="text-black">{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold leading-tight text-secondary-100 transition-colors group-hover:text-primary-700">
                      {post.title}
                    </h3>
                    <p className="mb-4 text-sm leading-7 text-secondary-100">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-800">By {post.author?.name}</span>
                      <Button to={`/blog/${post.id}`} variant="ghost" className="text-sm font-semibold">
                        Read More →
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </PageSection>

      <PageSection className="bg-primary-800">
        <div className="bg-primary-600 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">Need Printing Services?</p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">Let's bring your project to life</h2>
          <div className="mt-8 flex justify-center gap-4">
            <Button to="/contact" size="lg" variant="primary">Get a Quote</Button>
            <Button to="/services" size="lg" variant="ghost" className="border-secondary-200/30 text-secondary-200 hover:bg-secondary-200/10">
              View Services
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
