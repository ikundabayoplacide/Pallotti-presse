import type { ReactNode } from "react";
import Container from "./Container";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  py?: string;
};

export default function PageSection({
  children,
  className = "",
  containerClassName = "",
  id,
  py = "py-16 sm:py-20 lg:py-24",
}: PageSectionProps) {
  return (
    <section id={id} className={`${py} ${className}`.trim()}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
