"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { philosophyContent } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref, { stagger: 0.12, y: 40 });

  return (
    <section
      ref={ref}
      id="philosophy"
      className="relative scroll-mt-24 bg-ivory pt-14 sm:pt-10 md:pt-8 pb-6 md:pb-8"
      aria-labelledby="philosophy-heading"
    >
      <div className="container-rh relative z-[1]">
        <div
          data-reveal
          className="card-soft overflow-hidden shadow-[0_28px_70px_rgba(28,26,24,0.11)]"
        >
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">
            <div className="p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center">
              <p className="tag-pill w-fit mb-4 sm:mb-5">
                {philosophyContent.tag}
              </p>
              <h2
                id="philosophy-heading"
                className="font-display text-[1.6rem] leading-[1.15] sm:text-3xl md:text-4xl lg:text-[2.75rem] text-ink text-balance"
              >
                {philosophyContent.headlineBefore}{" "}
                <em className="italic-em">{philosophyContent.headlineEm}</em>{" "}
                {philosophyContent.headlineAfter}
              </h2>
              <p className="mt-4 sm:mt-5 text-ink-soft leading-relaxed max-w-md text-sm sm:text-base">
                {philosophyContent.body}
              </p>
              <div className="mt-6 sm:mt-8">
                <Button
                  href={philosophyContent.cta.href}
                  variant="dark"
                  size="lg"
                  magnetic
                  className="w-full sm:w-auto"
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_id: "philosophy_explore_ownership",
                    })
                  }
                >
                  {philosophyContent.cta.label}
                </Button>
              </div>
            </div>

            <div className="relative min-h-[200px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-full p-3 sm:p-4 md:p-5">
              <div className="relative h-full min-h-[180px] sm:min-h-[300px] overflow-hidden rounded-[1.35rem] md:rounded-[1.75rem]">
                <Image
                  src={philosophyContent.image}
                  alt={philosophyContent.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
                  <div className="inline-flex max-w-xs rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white">
                    Access participating destinations worldwide*
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p data-reveal className="mt-4 text-center text-xs text-ink-soft/80 px-2">
          {philosophyContent.note}
        </p>
      </div>
    </section>
  );
}
