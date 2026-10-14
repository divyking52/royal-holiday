"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destinations, destinationsSection } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { trackEvent } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function DestinationGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".dest-card-item", {
        y: 48,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Desktop: pin left column while cards scroll (with spacing to avoid overlap)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (prefersReducedMotion() || !pinRef.current) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top top+=96",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="section-pad"
      aria-labelledby="destinations-heading"
    >
      <div className="container-rh grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div ref={pinRef} className="lg:col-span-5 lg:pt-6">
          <Tag>What we offer</Tag>
          <h2
            id="destinations-heading"
            className="mt-4 sm:mt-5 font-display text-[1.65rem] sm:text-4xl md:text-5xl text-ink text-balance"
          >
            Destinations designed for{" "}
            <em className="italic-em">your next escape</em>
          </h2>
          <p className="mt-3.5 sm:mt-5 text-sm sm:text-base text-ink-soft leading-relaxed max-w-md">
            {destinationsSection.supporting}
          </p>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-ink-soft/80 max-w-md">
            {destinationsSection.note}
          </p>
          <div className="mt-5 sm:mt-8 hidden sm:flex items-center gap-3">
            <div className="flex -space-x-2">
              {destinations.slice(0, 3).map((d) => (
                <span
                  key={d.id}
                  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-ivory"
                >
                  <Image
                    src={d.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </span>
              ))}
            </div>
            <p className="text-sm text-ink-soft">
              Explore participating destinations — then speak with a specialist.
            </p>
          </div>
          <div className="mt-6 sm:mt-8">
            <Button href="#qualify" variant="primary" size="lg" magnetic className="w-full sm:w-auto">
              Begin your journey
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-hide sm:mx-0 sm:px-0 lg:block lg:space-y-5 lg:overflow-visible lg:pb-0">
          {destinations.map((d) => (
            <article
              key={d.id}
              className="dest-card-item card-soft overflow-hidden shadow-sm group shrink-0 w-[80vw] max-w-[300px] snap-center lg:w-auto lg:max-w-none lg:shrink"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => {
                  trackEvent("destination_interaction", {
                    destination_id: d.id,
                    cta_id: "destination_program_card",
                  });
                  document
                    .querySelector("#qualify")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden m-3 md:m-4 rounded-[1.35rem] md:rounded-[1.5rem]">
                  <Image
                    src={d.image}
                    alt={d.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 80vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 md:px-7 md:pb-8">
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-ink">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-ink-soft text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {d.blurb}
                  </p>
                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-mist px-3 py-1.5 text-xs text-ink-soft">
                      {d.property}
                    </span>
                    <span className="rounded-full bg-lavender px-3 py-1.5 text-xs text-teal">
                      {d.region}
                    </span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
