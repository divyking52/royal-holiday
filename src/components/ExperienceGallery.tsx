"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceGallery } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ClipPathCarousel } from "@/components/motion/ClipPathCarousel";
import { TextRoll } from "@/components/skiper/TextRoll";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceGallery() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".exp-intro", {
        y: 32,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") {
        setActive((i) =>
          i === null ? 0 : (i + 1) % experienceGallery.images.length,
        );
      }
      if (e.key === "ArrowLeft") {
        setActive((i) =>
          i === null
            ? 0
            : (i - 1 + experienceGallery.images.length) %
              experienceGallery.images.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  return (
    <section
      ref={ref}
      id="experiences"
      className="section-pad bg-ivory overflow-hidden"
      aria-labelledby="experiences-heading"
    >
      <div className="container-rh exp-intro mb-10 md:mb-14">
        <SectionHeading
          id="experiences-heading"
          tag="Resort experiences"
          headline={experienceGallery.headline}
          supporting={experienceGallery.supporting}
        />
      </div>

      <div className="px-4 md:px-0">
        <ClipPathCarousel label="Experience carousel" autoplayMs={4200}>
          {experienceGallery.images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              className="absolute inset-0 group overflow-hidden text-left"
              onClick={() => setActive(index)}
              aria-label={`View ${img.caption}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                <span className="group inline-block font-display text-2xl md:text-4xl text-white">
                  <TextRoll center>{img.caption}</TextRoll>
                </span>
              </span>
            </button>
          ))}
        </ClipPathCarousel>
      </div>

      <AnimatePresence>
        {active !== null ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ocean-deep/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={close}
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-ink p-2"
              onClick={close}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <button
              type="button"
              className="absolute left-3 md:left-8 text-ink p-2"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                setActive(
                  (active - 1 + experienceGallery.images.length) %
                    experienceGallery.images.length,
                );
              }}
            >
              <ChevronLeft size={32} />
            </button>
            <motion.div
              key={active}
              className="relative w-full max-w-5xl aspect-[16/10]"
              initial={{ opacity: 0, clipPath: "inset(0% 40% 0% 40%)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={experienceGallery.images[active].src}
                alt={experienceGallery.images[active].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
            <button
              type="button"
              className="absolute right-3 md:right-8 text-ink p-2"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                setActive((active + 1) % experienceGallery.images.length);
              }}
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
