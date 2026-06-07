import { Navigate, useParams } from "react-router-dom";
import { useGetBlogQuery, useGetBlogsQuery } from "../app/api/blog";
import { Button, PageSection } from "../components";

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data: postData, isLoading, isError } = useGetBlogQuery(id!);
  const { data: allData } = useGetBlogsQuery();

  const post = postData?.data;
  const allPosts = allData?.data ?? [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  if (isError || !post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-16 xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-block rounded bg-primary-700/90 px-4 py-2 text-sm font-semibold tracking-[0.12em] uppercase text-secondary-200">
              {post.category}
            </div>
            <h1 className="text-4xl leading-tight font-semibold text-primary-100 xxs:text-5xl md:text-6xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-100">
              {post.author && <span>By {post.author.name}</span>}
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-secondary-200">
        <div className="mx-auto max-w-5xl px-4 py-12 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded border border-secondary-300/20 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <img src={post.image} alt={post.title} className="h-96 w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <PageSection className="bg-secondary-200">
        <div className="mx-auto max-w-3xl">
          <div
            className="prose prose-lg max-w-none text-secondary-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ lineHeight: "1.8" }}
          />

          {/* Share Section */}
          {/* <div className="mt-12 border-t border-secondary-300/30 pt-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-secondary-100">Share this article:</span>
              <div className="flex gap-3">
                {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
                  <button
                    key={platform}
                    className="rounded bg-primary-700 px-4 py-2 text-sm font-semibold text-secondary-200 transition hover:bg-primary-800"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div> */}

          {/* Author Bio */}
          {/* {post.author && (
            <div className="mt-12 rounded border border-secondary-300/30 bg-style-600/50 p-8">
              <h3 className="mb-2 text-xl font-semibold text-secondary-100">About {post.author.name}</h3>
              <p className="text-sm leading-7 text-secondary-100">
                {post.author.name} is a printing and design expert helping businesses create impactful marketing materials.
              </p>
            </div>
          )} */}
        </div>
      </PageSection>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <PageSection className="bg-style-600/50">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">Related Articles</h2>
              <div className="mx-auto h-1 w-24 bg-secondary-100" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="group overflow-hidden rounded border border-gray-300 bg-secondary-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-lg font-semibold leading-tight text-secondary-100">{relatedPost.title}</h3>
                    <Button to={`/blog/${relatedPost.id}`} variant="ghost" className="text-sm">Read More →</Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </PageSection>
      )}

      {/* CTA Section */}
      <PageSection className="bg-primary-800">
        <div className="bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">Ready to Get Started?</p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">Let's bring your printing project to life</h2>
          <div className="mt-8 flex justify-center gap-4">
            <Button to="/contact" size="lg" variant="primary">Contact Us</Button>
            <Button to="/blog" size="lg" variant="ghost" className="border-secondary-200/30 text-secondary-200 hover:bg-secondary-200/10">
              Back to Blog
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
