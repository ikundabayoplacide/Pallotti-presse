type SectionHeadingProps = {
  align?: "left" | "center";
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  align = "left",
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl space-y-4 ${alignment}`.trim()}>
      {eyebrow ? (
        <p className="text-xs tracking-[0.25em] text-custom-300 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl leading-tight font-semibold text-secondary-200 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-7 text-secondary-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
