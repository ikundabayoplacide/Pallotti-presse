import { useEffect, useState } from "react";
import { HiCalendar, HiEye, HiLockClosed, HiTag, HiXMark } from "react-icons/hi2";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRequestAccessMutation } from "../app/api/publicationAccess";
import { useGetPublicationQuery } from "../app/api/publications";
import { Button, PageSection } from "../components";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function PaywallModal({ pub, onClose }: { pub: { id: string; title: string; price?: string; momoNumber?: string }; onClose: () => void }) {
  const [requestAccess, { isLoading }] = useRequestAccessMutation();
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestAccess({ publicationId: pub.id, email, transactionId }).unwrap();
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      alert(error?.data?.error || "Failed to submit request. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-secondary-100/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-lg bg-secondary-200 shadow-[0_24px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
              <div className="flex items-center gap-2">
                <HiLockClosed className="h-5 w-5 text-primary-700" />
                <h2 className="text-lg font-semibold text-secondary-100">Premium Publication</h2>
              </div>
              <button onClick={onClose} className="text-secondary-300 hover:text-secondary-100">
                <HiXMark className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {submitted ? (
                <div className="text-center space-y-3 py-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-secondary-100">Request Submitted!</p>
                  <p className="text-sm text-secondary-300">
                    We've received your payment request. Once verified, you'll receive an access link at{" "}
                    <span className="font-semibold text-secondary-100">{email}</span>.
                  </p>
                  <Button onClick={onClose} variant="secondary" className="rounded mt-2">Close</Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-secondary-300 leading-6">
                    <span className="font-semibold text-secondary-100">{pub.title}</span> requires a one-time payment to access the full content.
                  </p>
                  <div className="rounded-lg border border-primary-700/30 bg-primary-700/5 p-4 space-y-2">
                    <p className="text-sm font-semibold text-secondary-100">How to Pay (MoMo)</p>
                    <ol className="text-sm text-secondary-300 space-y-1 list-decimal list-inside">
                      <li>Send <span className="font-semibold text-secondary-100">{pub.price}</span> to MoMo number: <span className="font-semibold text-secondary-100">{pub.momoNumber}</span></li>
                      <li>Use your email as the payment note</li>
                      <li>Copy the transaction ID from your MoMo confirmation</li>
                      <li>Fill in the form below and submit</li>
                    </ol>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-secondary-100">Your Email *</label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-secondary-100">MoMo Transaction ID *</label>
                      <input
                        type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required
                        className="w-full rounded border border-secondary-300/30 bg-secondary-200 px-4 py-3 text-sm text-secondary-100 focus:border-primary-700 focus:outline-none"
                        placeholder="e.g. TXN123456789"
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <Button type="submit" variant="secondary" className="flex-1 rounded" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Payment Request"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={onClose} className="rounded">Cancel</Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, isLoading, isError } = useGetPublicationQuery(id ?? "");
  const [showPaywall, setShowPaywall] = useState(false);

  const publication = data?.data;

  // Check if user arrived with a valid access token
  const accessToken = searchParams.get("token");
  const hasAccess = Boolean(accessToken);

  useEffect(() => {
    if (isError) navigate("/publications");
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  if (!publication) return null;

  const isPremiumLocked = publication.isPremium && !hasAccess;

  // Truncate HTML content to ~500 chars for preview
  const previewContent = (() => {
    if (!publication.content) return "";
    const plain = publication.content.replace(/<[^>]+>/g, "");
    if (plain.length <= 500) return publication.content;
    // Find a safe cut point
    const cut = publication.content.indexOf(" ", 500);
    return publication.content.slice(0, cut > 0 ? cut : 500) + "…";
  })();

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-r from-primary-800 via-custom-800 to-primary-700">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center xxs:px-5 xs:px-6 sm:px-8 lg:px-6 lg:py-14">
          <div className="mx-auto max-w-4xl space-y-4">
            {publication.isPremium && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-yellow-400 uppercase">
                <HiLockClosed className="h-3.5 w-3.5" /> Premium · {publication.price}
              </span>
            )}
            {!publication.isPremium && (
              <span className="inline-block rounded-full bg-secondary-200/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-secondary-200 uppercase">
                {publication.category}
              </span>
            )}
            <h1 className="text-3xl font-semibold leading-tight text-primary-100 sm:text-4xl md:text-5xl">
              {publication.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-100/80">
              <span className="flex items-center gap-1.5">
                <HiCalendar className="h-4 w-4" />{formatDate(publication.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <HiEye className="h-4 w-4" />{publication.views} views
              </span>
              <span className="flex items-center gap-1.5">
                <HiTag className="h-4 w-4" />{publication.category}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <PageSection className="bg-secondary-200">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Button to="/publications" variant="ghost" size="sm" className="rounded">
              ← Back to Publications
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-secondary-300/20 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            {publication.coverImage && (
              <img src={publication.coverImage} alt={publication.title} className="h-72 w-full object-cover sm:h-96" />
            )}

            {publication.fileContent ? (
              <div className="p-6 sm:p-10 space-y-4">
                {publication.fileType === "application/pdf" ? (
                  isPremiumLocked ? (
                    // PDF preview: show first ~20% via iframe with page restriction not possible,
                    // so show a blurred placeholder instead
                    <div className="relative">
                      <div className="pointer-events-none select-none overflow-hidden rounded border border-secondary-300/20" style={{ height: "40vh" }}>
                        <iframe
                          src={`${publication.fileContent}#page=1&toolbar=0&navpanes=0`}
                          className="w-full h-full"
                          title={publication.title}
                        />
                      </div>
                      <PaywallOverlay price={publication.price} onUnlock={() => setShowPaywall(true)} />
                    </div>
                  ) : (
                    <iframe
                      src={publication.fileContent}
                      className="w-full rounded border border-secondary-300/20"
                      style={{ height: "80vh" }}
                      title={publication.title}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-4 py-12 text-center">
                    <p className="text-secondary-100">{publication.fileName}</p>
                    {isPremiumLocked ? (
                      <Button onClick={() => setShowPaywall(true)} variant="secondary" className="rounded flex items-center gap-2">
                        <HiLockClosed className="h-4 w-4" /> Unlock to Download
                      </Button>
                    ) : (
                      <a
                        href={publication.fileContent}
                        download={publication.fileName ?? publication.title}
                        className="rounded bg-primary-700 px-6 py-2.5 text-sm font-semibold text-secondary-200 transition hover:bg-primary-800"
                      >
                        Download File
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 sm:p-10">
                {isPremiumLocked ? (
                  <div className="relative">
                    {/* Preview content */}
                    <div
                      className="prose prose-lg max-w-none text-secondary-100
                        prose-headings:text-secondary-100 prose-h2:text-2xl prose-h2:font-semibold
                        prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold
                        prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-7 prose-p:mb-4
                        prose-strong:text-secondary-100 prose-strong:font-semibold prose-em:italic
                        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-li:mb-1
                        prose-a:text-primary-700 prose-a:underline hover:prose-a:text-primary-600"
                      dangerouslySetInnerHTML={{ __html: previewContent }}
                    />
                    {/* Fade + paywall */}
                    <div className="relative -mt-24">
                      <div className="h-24 bg-gradient-to-b from-transparent to-secondary-200" />
                      <PaywallOverlay price={publication.price} onUnlock={() => setShowPaywall(true)} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="prose prose-lg max-w-none text-secondary-100
                      prose-headings:text-secondary-100 prose-h2:text-2xl prose-h2:font-semibold
                      prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold
                      prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-7 prose-p:mb-4
                      prose-strong:text-secondary-100 prose-strong:font-semibold prose-em:italic
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-li:mb-1
                      prose-a:text-primary-700 prose-a:underline hover:prose-a:text-primary-600"
                    dangerouslySetInnerHTML={{ __html: publication.content ?? "" }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </PageSection>

      {showPaywall && (
        <PaywallModal pub={publication} onClose={() => setShowPaywall(false)} />
      )}
    </>
  );
}

function PaywallOverlay({ price, onUnlock }: { price?: string; onUnlock: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-yellow-500/20 bg-secondary-200 px-6 py-10 text-center shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
        <HiLockClosed className="h-7 w-7 text-yellow-500" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-secondary-100">This is a Premium Publication</p>
        <p className="text-sm text-secondary-300">
          Pay <span className="font-semibold text-secondary-100">{price}</span> via MoMo to unlock the full content.
        </p>
      </div>
      <Button onClick={onUnlock} variant="secondary" className="rounded flex items-center gap-2">
        <HiLockClosed className="h-4 w-4" /> Get Full Access
      </Button>
    </div>
  );
}
