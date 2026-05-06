import type { ReactNode } from "react";

type FeatureCardProps = {
  description: string;
  icon?: ReactNode;
  title: string;
};

export default function FeatureCard({
  description,
  icon,
  title,
}: FeatureCardProps) {
  return (
    <article className="rounded-[2rem] border border-secondary-300/20 bg-primary-700/60 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-8">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-custom-500/20 text-custom-200">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-secondary-200">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-secondary-400">{description}</p>
    </article>
  );
}
