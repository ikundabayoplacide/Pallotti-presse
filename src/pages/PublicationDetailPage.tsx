import { useEffect } from "react";
import { HiCalendar, HiEye, HiTag } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPublicationQuery } from "../app/api/publications";
import { Button, PageSection } from "../components";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPublicationQuery(id ?? "");

  const publication = data?.data;

  // Redirect if not found
  useEffect(() => {
    if (isError) {
      navigate("/publications");
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  if (!publication) return null;

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-14">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="inline-block rounded-full bg-secondary-200/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-secondary-200 uppercase">
              {publication.category}
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-primary-100 sm:text-4xl md:text-5xl">
              {publication.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-100/80">
              <span className="flex items-center gap-1.5">
                <HiCalendar className="h-4 w-4" />
                {formatDate(publication.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <HiEye className="h-4 w-4" />
                {publication.views} views
              </span>
              <span className="flex items-center gap-1.5">
                <HiTag className="h-4 w-4" />
                {publication.category}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <PageSection className="bg-secondary-200">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Button
              to="/publications"
              variant="ghost"
              size="sm"
              className="rounded"
            >
              ← Back to Publications
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-secondary-300/20 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            {/* Cover image */}
            {publication.coverImage && (
              <img
                src={publication.coverImage}
                alt={publication.title}
                className="h-72 w-full object-cover sm:h-96"
              />
            )}

            {/* Article content */}
            <div className="p-6 sm:p-10">
              <div
                className="prose prose-lg max-w-none text-secondary-100
                  prose-headings:text-secondary-100
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                  prose-p:leading-7 prose-p:mb-4
                  prose-strong:text-secondary-100 prose-strong:font-semibold
                  prose-em:italic
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                  prose-li:mb-1
                  prose-a:text-primary-700 prose-a:underline hover:prose-a:text-primary-600"
                dangerouslySetInnerHTML={{ __html: publication.content ?? "" }}
              />
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
