"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  CalendarRange,
  Headset,
  MapPinned,
  type LucideIcon,
} from "lucide-react";
import { benefitsSection } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

const icons: Record<string, LucideIcon> = {
  MapPinned,
  CalendarRange,
  Building2,
  Headset,
};

export function BenefitsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".benefit-row").forEach((row) => {
        const image = row.querySelector(".benefit-image");
        const copy = row.querySelector(".benefit-copy");

        gsap.from(image, {
          clipPath: "inset(8% 8% 8% 8%)",
          scale: 1.06,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 75%",
          },
        });

        gsap.from(copy, {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 70%",
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="benefits"
      className="section-pad bg-ivory"
      aria-labelledby="benefits-heading"
    >
      <div className="container-rh">
        <SectionHeading
          id="benefits-heading"
          tag="Membership benefits"
          headline={benefitsSection.headline}
          supporting={benefitsSection.supporting}
        />

        <div className="mt-16 md:mt-20 space-y-20 md:space-y-28">
          {benefitsSection.items.map((item, i) => {
            const Icon = icons[item.icon] ?? MapPinned;
            const reverse = i % 2 === 1;

            return (
              <article
                key={item.id}
                className={`benefit-row grid gap-8 lg:gap-14 lg:grid-cols-2 lg:items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className="benefit-image relative aspect-[4/3] overflow-hidden will-change-transform"
                  data-hover-card
                >
                  <div data-hover-media className="absolute inset-0 will-change-transform">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <span
                    data-hover-overlay
                    className="absolute inset-0 bg-ocean-deep/25 opacity-0 pointer-events-none"
                  />
                </div>
                <div className="benefit-copy">
                  <Icon className="text-teal mb-4" size={28} strokeWidth={1.5} aria-hidden />
                  <h3 className="font-display text-3xl md:text-4xl text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-ink-soft leading-relaxed max-w-md">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row sm:items-center gap-6">
          <Button
            href={benefitsSection.learnMoreHref}
            variant="primary"
            size="lg"
            magnetic
            onClick={() =>
              trackEvent("cta_click", { cta_id: "benefits_learn_more" })
            }
          >
            {benefitsSection.learnMoreLabel}
          </Button>
          <p className="text-sm text-ink-soft max-w-xl">
            {benefitsSection.restrictionsNote}
          </p>
        </div>
      </div>
    </section>
  );
}
