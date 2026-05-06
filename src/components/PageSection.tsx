import type { ReactNode } from "react";
import Container from "./Container";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
};

export default function PageSection({
  children,
  className = "",
  containerClassName = "",
  id,
}: PageSectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`.trim()}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
