"use client";

/**
 * GSAP clip-path carousel — stacked slides with directional wipe reveals.
 * Different from the previous horizontal track carousel (Codrops / Skiper clipPath vibe).
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TextRoll } from "@/components/skiper/TextRoll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode[];
  className?: string;
  autoplayMs?: number;
  label?: string;
};

const CLIP = {
  show: "inset(0% 0% 0% 0%)",
  hideLeft: "inset(0% 100% 0% 0%)",
  hideRight: "inset(0% 0% 0% 100%)",
  hideUp: "inset(100% 0% 0% 0%)",
};

export function ClipPathCarousel({
  children,
  className,
  autoplayMs = 4500,
  label = "Carousel",
}: Props) {
  const slides = children;
  const count = slides.length;
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dirRef = useRef<1 | -1>(1);

  const [index, setIndex] = useState(0);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const paintInitial = useCallback(() => {
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        clipPath: i === 0 ? CLIP.show : CLIP.hideRight,
        zIndex: i === 0 ? 2 : 1,
        scale: i === 0 ? 1 : 1.06,
        opacity: 1,
      });
    });
  }, []);

  const goTo = useCallback(
    async (next: number, direction: 1 | -1 = 1) => {
      if (busyRef.current || count < 2) return;
      const from = indexRef.current;
      const to = ((next % count) + count) % count;
      if (from === to) return;

      const current = slideRefs.current[from];
      const incoming = slideRefs.current[to];
      if (!current || !incoming) return;

      busyRef.current = true;
      dirRef.current = direction;
      indexRef.current = to;
      setIndex(to);

      if (reduced) {
        gsap.set(current, { clipPath: CLIP.hideRight, zIndex: 1 });
        gsap.set(incoming, { clipPath: CLIP.show, zIndex: 2, scale: 1 });
        busyRef.current = false;
        return;
      }

      const exitClip = direction === 1 ? CLIP.hideLeft : CLIP.hideRight;
      const enterFrom = direction === 1 ? CLIP.hideRight : CLIP.hideLeft;

      gsap.set(incoming, {
        clipPath: enterFrom,
        zIndex: 3,
        scale: 1.08,
      });
      gsap.set(current, { zIndex: 2 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(current, { clipPath: exitClip, zIndex: 1, scale: 1.06 });
          gsap.set(incoming, { zIndex: 2 });
          busyRef.current = false;
        },
      });

      tl.to(
        current,
        {
          clipPath: exitClip,
          scale: 1.04,
          duration: 1.05,
        },
        0,
      ).to(
        incoming,
        {
          clipPath: CLIP.show,
          scale: 1,
          duration: 1.05,
        },
        0.05,
      );
    },
    [count, reduced],
  );

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (reduced || count < 2) return;
    autoplayRef.current = setInterval(() => {
      goTo(indexRef.current + 1, 1);
    }, autoplayMs);
  }, [autoplayMs, count, goTo, reduced, stopAutoplay]);

  useEffect(() => {
    paintInitial();
    startAutoplay();
    return stopAutoplay;
  }, [paintInitial, startAutoplay, stopAutoplay]);

  // Swipe
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    let startX = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      active = true;
      startX = e.clientX;
      stopAutoplay();
    };
    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) goTo(indexRef.current + 1, 1);
        else goTo(indexRef.current - 1, -1);
      }
      startAutoplay();
    };

    root.addEventListener("pointerdown", down);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    return () => {
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
    };
  }, [goTo, reduced, startAutoplay, stopAutoplay]);

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden bg-sand touch-pan-y select-none cursor-grab active:cursor-grabbing">
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            aria-hidden={i !== index}
            style={{ clipPath: i === 0 ? CLIP.show : CLIP.hideRight }}
          >
            {slide}
          </div>
        ))}

        {/* Soft vignette frame */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
      </div>

      <div className="container-rh mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="font-display text-3xl text-ink tabular-nums">
            {String(index + 1).padStart(2, "0")}
            <span className="text-ink-soft text-xl">
              {" "}
              / {String(count).padStart(2, "0")}
            </span>
          </p>
          <div className="hidden sm:flex gap-1.5 ml-2" role="tablist">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === index ? "w-10 bg-ocean" : "w-2 bg-sand-deep",
                )}
                onClick={() => {
                  const dir = i > indexRef.current ? 1 : -1;
                  goTo(i, dir as 1 | -1);
                  startAutoplay();
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            data-magnetic
            className="group inline-flex h-12 items-center gap-2 border border-sand-deep px-4 text-ink hover:border-ocean hover:text-ocean"
            aria-label="Previous slide"
            onClick={() => {
              goTo(indexRef.current - 1, -1);
              startAutoplay();
            }}
          >
            <ChevronLeft size={18} />
            <TextRoll>Prev</TextRoll>
          </button>
          <button
            type="button"
            data-magnetic
            className="group inline-flex h-12 items-center gap-2 border border-sand-deep bg-ocean px-4 text-ocean-deep hover:bg-teal"
            aria-label="Next slide"
            onClick={() => {
              goTo(indexRef.current + 1, 1);
              startAutoplay();
            }}
          >
            <TextRoll>Next</TextRoll>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
