import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-visible)").forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
