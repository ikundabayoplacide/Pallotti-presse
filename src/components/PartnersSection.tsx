import type { Partner } from "../app/api/partners";
import { useGetPartnersQuery } from "../app/api/partners";
import PageSection from "./PageSection";

const cardClass =
  "flex items-center justify-center rounded-lg border border-secondary-300/30 bg-style-600/50 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] w-40";

function PartnerCard({ partner }: { partner: Partner }) {
  const inner = (
    <img
      src={partner.logo}
      alt={partner.name}
      className="h-12 w-auto object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
    />
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        title={partner.name}
        className={cardClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <div title={partner.name} className={cardClass}>
      {inner}
    </div>
  );
}

export default function PartnersSection() {
  const { data, isLoading } = useGetPartnersQuery();
  const partners = data?.data ?? [];

  if (isLoading) {
    return (
      <PageSection className="bg-secondary-200" containerClassName="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
            Trusted by Leading Brands
          </h2>
          <div className="mx-auto h-1 w-24 bg-secondary-100" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 w-40 shrink-0 animate-pulse rounded-lg bg-secondary-300/20" />
          ))}
        </div>
      </PageSection>
    );
  }

  if (partners.length === 0) return null;

  return (
    <PageSection className="bg-secondary-200" containerClassName="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-semibold text-secondary-100 sm:text-4xl">
          Trusted by Leading Brands
        </h2>
        <div className="mx-auto h-1 w-24 bg-secondary-100" />
        <p className="mx-auto max-w-2xl text-base leading-7 text-secondary-100">
          We're proud to partner with businesses across various industries, delivering quality printing solutions.
        </p>
      </div>

      {partners.length > 5 ? (
        // Auto-scroll when more than 5
        <div className="scroll-container">
          <div className="scroll-content">
            {[...partners, ...partners].map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="flex-shrink-0">
                <PartnerCard partner={partner} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Centered when 5 or fewer
        <div className="flex flex-wrap justify-center gap-6">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      )}
    </PageSection>
  );
}
