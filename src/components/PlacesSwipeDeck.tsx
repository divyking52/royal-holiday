"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export type PlaceStory = {
  id: string;
  name: string;
  role: string;
  image: string;
  alt: string;
};

type Props = {
  stories: PlaceStory[];
};

export function PlacesSwipeDeck({ stories }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const n = stories.length;
    const reduced = prefersReducedMotion();

    const layout = (dx = 0, duration = 0) => {
      const current = activeRef.current;
      stories.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const depth = (i - current + n) % n;
        if (depth > 2) {
          gsap.set(el, {
            opacity: 0,
            zIndex: 0,
            x: 0,
            pointerEvents: "none",
          });
          return;
        }
        const front = depth === 0;
        const vars = {
          x: front ? dx : depth * 12,
          y: depth * 18,
          z: -depth * 48,
          scale: 1 - depth * 0.07,
          rotateY: front ? dx * 0.14 : depth * -6,
          rotateZ: front ? dx * 0.035 : 0,
          opacity: 1 - depth * 0.08,
          zIndex: 20 - depth,
          transformPerspective: 980,
          transformOrigin: "50% 88%",
          force3D: true,
          pointerEvents: front ? "auto" : "none",
        };
        if (duration > 0 && !reduced) {
          gsap.to(el, { ...vars, duration, ease: "power3.out" });
        } else {
          gsap.set(el, vars);
        }
      });
    };

    layout(0);

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      lastX.current = 0;
      root.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      lastX.current = e.clientX - startX.current;
      layout(lastX.current);
    };

    const advance = (dir: 1 | -1) => {
      const next = (activeRef.current + dir + n) % n;
      const el = cardRefs.current[activeRef.current];
      const fly = dir * Math.max(280, root.clientWidth * 0.85);

      if (el && !reduced) {
        gsap.to(el, {
          x: fly,
          rotateY: dir * 42,
          rotateZ: dir * 8,
          opacity: 0,
          duration: 0.42,
          ease: "power2.in",
          onComplete: () => {
            activeRef.current = next;
            setActive(next);
            layout(0);
          },
        });
      } else {
        activeRef.current = next;
        setActive(next);
        layout(0, reduced ? 0 : 0.4);
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      try {
        root.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const dx = lastX.current;
      if (Math.abs(dx) > 72) {
        advance(dx < 0 ? 1 : -1);
      } else {
        layout(0, reduced ? 0 : 0.35);
      }
      lastX.current = 0;
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);

    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      gsap.killTweensOf(cardRefs.current.filter(Boolean));
    };
  }, [stories]);

  return (
    <div className="md:hidden">
      <div
        ref={rootRef}
        className="relative mx-auto h-[420px] w-full max-w-[300px] touch-none select-none"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Destination stories. Swipe to browse."
      >
        {stories.map((s, i) => (
          <article
            key={s.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="story-card absolute inset-x-0 top-0 mx-auto h-[380px] w-[86%] max-w-[250px] overflow-hidden rounded-[1.6rem] shadow-[0_24px_50px_rgba(28,26,24,0.28)] ring-1 ring-white/20"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            aria-hidden={i !== active}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="250px"
              className="object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="font-display text-2xl">{s.name}</h3>
              <p className="mt-1 text-sm text-white/80">{s.role}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-3 flex flex-col items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          Swipe to explore
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {stories.map((s, i) => (
            <span
              key={s.id}
              className={
                i === active
                  ? "h-1.5 w-5 rounded-full bg-ocean"
                  : "h-1.5 w-1.5 rounded-full bg-sand-deep"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
