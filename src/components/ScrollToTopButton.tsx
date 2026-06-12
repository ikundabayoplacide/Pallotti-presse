import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi2";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-110 hover:bg-primary-700 sm:bottom-28 sm:right-8"
    >
      <HiArrowUp className="h-5 w-5" />
    </button>
  );
}
