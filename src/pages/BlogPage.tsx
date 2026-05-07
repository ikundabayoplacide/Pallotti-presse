import heroImage from "../assets/hero.png";
import Img1 from "../assets/im1.jpeg";
import Img2 from "../assets/im2.jpeg";
import Img3 from "../assets/im3.jpeg";
import Img4 from "../assets/im4.jpeg";
import { Button, PageSection } from "../components";

const blogPosts = [
  {
    title: "10 Tips for Designing Professional Business Cards",
    excerpt: "Learn the essential design principles that make business cards stand out and leave a lasting impression on potential clients.",
    image: Img2,
    category: "Design Tips",
    date: "March 15, 2024",
    author: "Sarah Johnson",
    readTime: "5 min read",
  },
  {
    title: "The Ultimate Guide to Custom Packaging",
    excerpt: "Discover how custom packaging can elevate your brand and create memorable unboxing experiences for your customers.",
    image: Img1,
    category: "Packaging",
    date: "March 10, 2024",
    author: "Michael Chen",
    readTime: "8 min read",
  },
  {
    title: "Print Marketing in the Digital Age",
    excerpt: "Why print marketing still matters and how to integrate it effectively with your digital marketing strategy.",
    image: Img3,
    category: "Marketing",
    date: "March 5, 2024",
    author: "Emily Rodriguez",
    readTime: "6 min read",
  },
  {
    title: "Choosing the Right Paper Stock for Your Project",
    excerpt: "A comprehensive guide to understanding different paper types, weights, and finishes for various printing projects.",
    image: Img4,
    category: "Printing Basics",
    date: "February 28, 2024",
    author: "David Kim",
    readTime: "7 min read",
  },
  {
    title: "Sustainable Printing: Eco-Friendly Options",
    excerpt: "Explore environmentally conscious printing solutions that reduce your carbon footprint without compromising quality.",
    image: heroImage,
    category: "Sustainability",
    date: "February 20, 2024",
    author: "Lisa Anderson",
    readTime: "5 min read",
  },
  {
    title: "Color Psychology in Print Design",
    excerpt: "Understanding how colors influence perception and decision-making in your printed marketing materials.",
    image: Img3,
    category: "Design Tips",
    date: "February 15, 2024",
    author: "Sarah Johnson",
    readTime: "6 min read",
  },
];

const categories = ["All Posts", "Design Tips", "Packaging", "Marketing", "Printing Basics", "Sustainability"];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl leading-tight font-semibold text-primary-100 xxs:text-5xl md:text-6xl">
              Print Insights & Tips
            </h1>
            <p className="text-xl leading-7 text-primary-100">
              Expert advice, industry trends, and practical tips to help you make the most of your printing projects.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}

      {/* Categories Filter */}
      <section className="bg-style-600/30 py-8">
        <div className="mx-auto max-w-7xl px-4 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded text-sm font-semibold tracking-[0.12em] uppercase transition border border-secondary-300/30 hover:bg-primary-700 hover:text-secondary-200 text-secondary-100 bg-secondary-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <PageSection
        id="blog"
        className="bg-secondary-200"
        containerClassName="space-y-12"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Latest Articles
          </h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="group border border-gray-300 rounded  overflow-hidden bg-style-600/50 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.10)]"
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
                  <span className="text-black">{post.date}</span>
                  <span>•</span>
                  <span className="text-gray-600">{post.readTime}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold leading-tight text-secondary-100 transition-colors group-hover:text-primary-700">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm leading-7 text-secondary-100">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-800">By {post.author}</span>
                  <button className="text-sm font-semibold text-primary-700 transition hover:text-secondary-100">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="secondary" size="lg" className="rounded">
            Load More Articles
          </Button>
        </div>
      </PageSection>

      {/* Newsletter Signup */}
      <PageSection className="bg-style-600/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Subscribe to Our Newsletter
          </h2>
          <p className="mt-4 text-base leading-7 text-secondary-100">
            Get the latest printing tips, industry insights, and special offers delivered to your inbox.
          </p>
          <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-md border border-secondary-300/30 bg-secondary-200 px-6 py-4 text-sm text-secondary-100 placeholder:text-secondary-300 focus:border-primary-700 focus:outline-none"
            />
            <Button type="submit" variant="secondary" className="rounded">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-secondary-300">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </PageSection>

      {/* Popular Topics */}
      <PageSection className="bg-secondary-200">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
              Popular Topics
            </h2>
            <div className="mx-auto h-1 w-24 bg-secondary-100" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2  lg:grid-cols-4">
            {[
              { topic: "Design Tips", count: "24 articles" },
              { topic: "Printing Basics", count: "18 articles" },
              { topic: "Marketing", count: "15 articles" },
              { topic: "Sustainability", count: "12 articles" },
            ].map((item) => (
              <div
                key={item.topic}
                className="bg-style-600/50 p-6 border border-gray-400 rounded text-center shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-xl font-semibold text-secondary-100">{item.topic}</h3>
                <p className="mt-2 text-sm text-secondary-300">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* CTA Section */}
      <PageSection className="bg-primary-800">
        <div className="bg-primary-700/70 p-8 text-center sm:p-12">
          <p className="text-sm tracking-[0.18em] text-custom-300 uppercase">
            Need Printing Services?
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-secondary-200 sm:text-4xl">
            Let's bring your project to life
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary-400 sm:text-base">
            From business cards to custom packaging, we're here to help with all your printing needs.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button to="/#contact" size="lg" variant="primary">
              Get a Quote
            </Button>
            <Button to="/services" size="lg" variant="ghost" className="border-secondary-200/30 text-secondary-200 hover:bg-secondary-200/10">
              View Services
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
