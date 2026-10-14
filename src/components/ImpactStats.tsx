"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tag } from "@/components/ui/Tag";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: "180+",
    label: "Destinations referenced in public materials",
    note: "Confirm current network for U.S. campaigns",
  },
  {
    value: "14",
    label: "Park Royal Hotels & Resorts properties listed publicly",
    note: "Mexico, U.S., Puerto Rico, Argentina",
  },
  {
    value: "1992",
    label: "Year Royal Holiday was established",
    note: "Geneva, Switzerland — confirm for campaign use",
  },
];

export function ImpactStats() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".impact-item", {
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="section-pad"
      aria-labelledby="impact-heading"
    >
      <div className="container-rh">
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-12">
          <Tag>Our Impact</Tag>
          <h2
            id="impact-heading"
            className="mt-4 sm:mt-5 font-display text-[1.65rem] sm:text-4xl md:text-5xl text-ink"
          >
            Numbers that speak to the{" "}
            <em className="italic-em">journey</em>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-ink-soft">
            Factual markers from public Royal Holiday materials — not invented
            conversion claims. Replace with approved U.S. campaign metrics when
            ready.
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-5 px-5 scrollbar-hide sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4 md:gap-5 sm:overflow-visible sm:pb-0">
          {stats.map((s) => (
            <article
              key={s.label}
              className="impact-item card-soft p-5 sm:p-8 md:p-10 text-center shadow-sm shrink-0 w-[78%] max-w-[260px] snap-center sm:w-auto sm:max-w-none sm:shrink"
            >
              <p className="font-display text-4xl sm:text-5xl md:text-6xl text-ink">
                {s.value}
              </p>
              <p className="mt-3 text-sm sm:text-base font-medium text-ink leading-snug">
                {s.label}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft">
                {s.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
