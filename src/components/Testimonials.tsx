"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destinations } from "@/content/site";
import { Tag } from "@/components/ui/Tag";

gsap.registerPlugin(ScrollTrigger);

/** Destination stories — no fabricated member testimonials */
const stories = destinations.slice(0, 3).map((d) => ({
  id: d.id,
  name: d.name,
  role: d.region,
  image: d.image,
  alt: d.imageAlt,
}));

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".story-card", {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="stories"
      className="section-pad"
      aria-labelledby="stories-heading"
    >
      <div className="container-rh">
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-12">
          <Tag>Real places</Tag>
          <h2
            id="stories-heading"
            className="mt-4 sm:mt-5 font-display text-[1.65rem] sm:text-4xl md:text-5xl text-ink"
          >
            Destinations that start the{" "}
            <em className="italic-em">conversation</em>
          </h2>
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-ink-soft">
            Member testimonials are pending approval. Until then, explore
            verified destination highlights — no fabricated quotes or ratings.
          </p>
        </div>

        <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-hide sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-5 md:overflow-visible md:pb-0">
          {stories.map((s) => (
            <article
              key={s.id}
              className="story-card relative aspect-[3/4] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] group shrink-0 w-[68vw] max-w-[250px] snap-center md:w-auto md:max-w-none md:shrink"
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl md:text-3xl">{s.name}</h3>
                <p className="mt-1 text-sm text-white/80">{s.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <span className="tag-pill">Pending approval — member stories</span>
        </div>
      </div>
    </section>
  );
}
