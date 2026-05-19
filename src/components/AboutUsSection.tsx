import { useEffect, useRef, useState } from "react";
import { HiCheckBadge, HiEye } from "react-icons/hi2";
import buildingImage from "../assets/im3.jpeg";

const aboutHighlights = [
  {
    title: "Our vision",
    description:
      "To be the trusted print partner for brands, institutions, and growing businesses across Rwanda and the region.",
    icon: HiEye,
  },
  {
    title: "Our mission",
    description:
      "To deliver reliable printing, thoughtful design support, and timely production that helps every client present their work with confidence.",
    icon: HiCheckBadge,
  },
];

export default function AboutUsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cardElement = cardRef.current;

    if (!cardElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(cardElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-200 py-16 sm:py-20">
      <div className="absolute inset-0">
        <img
          src={buildingImage}
          alt="Printing house building"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-700/35 via-slate-900/20 to-slate-950/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 xxs:px-5 xs:px-6 sm:px-8 lg:px-10">
        <div className="flex justify-end">
          <div
            ref={cardRef}
            className={`about-card-reveal w-full max-w-2xl rounded-3xl bg-white/95 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.2)] backdrop-blur-sm sm:p-8 ${
              isVisible ? "about-card-reveal-visible" : ""
            }`}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-secondary-100 sm:text-2xl">
                  About Us
                </h2>
                <p className="text-xs leading-relaxed text-secondary-300 sm:text-sm">
                  We are a Printing Company located in Kigali, Rwanda, focused on high quality Print & Design Services for our clients all over country and in The Region. While continuously growing and expanding our network, we are always staying true to our values.
                </p>
              </div>

              <div className="space-y-3">
                {aboutHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-500 sm:h-10 sm:w-10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold text-secondary-100 sm:text-base">
                          {item.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-secondary-300 sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
