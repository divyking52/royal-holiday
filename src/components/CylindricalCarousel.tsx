"use client";

/**
 * Luminae-style inward cylinder carousel.
 * Track tilted with rotateX; cards on a convex arc (center closest).
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export type CylinderImage = {
  id: string;
  src: string;
  alt: string;
};

type Props = {
  images: readonly CylinderImage[];
  className?: string;
};

type Metrics = {
  step: number;
  radius: number;
  dip: number;
  visibleSlots: number;
  tilt: number;
};

function layout(cards: HTMLElement[], rotation: number, m: Metrics) {
  const n = cards.length;
  const mid = (n - 1) / 2;

  cards.forEach((card, i) => {
    let t = i - mid + rotation;
    const half = n / 2;
    while (t > half) t -= n;
    while (t < -half) t += n;

    const angle = t * m.step;
    const rad = (angle * Math.PI) / 180;
    const abs = Math.abs(t);

    const x = Math.sin(rad) * m.radius;
    const z = (Math.cos(rad) - 1) * m.radius;
    const rotateY = -angle;
    const y = (1 - Math.min(1, (t * t) / 8)) * m.dip;
    const visible = abs <= m.visibleSlots;
    // Subtle scale toward center for depth (no transformPerspective)
    const scale = 1 - Math.min(0.14, abs * 0.04);

    gsap.set(card, {
      xPercent: -50,
      yPercent: -50,
      x,
      y,
      z,
      rotateY,
      scale,
      opacity: visible ? 1 : 0,
      visibility: visible ? "visible" : "hidden",
      force3D: true,
      zIndex: Math.round(200 - abs * 12),
    });
  });
}

export function CylindricalCarousel({ images, className }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      track.querySelectorAll("[data-cyl-card]"),
    );
    if (!cards.length) return;

    gsap.set(cards, { clearProps: "transformPerspective" });

    const reduced = prefersReducedMotion();
    const state = { rotation: 0 };
    let metrics: Metrics = {
      step: 18,
      radius: 480,
      dip: 40,
      visibleSlots: 2.8,
      tilt: 12,
    };
    let dragging = false;
    let lastX = 0;
    let velocity = 0;
    let raf = 0;
    let lastTs = 0;
    let entered = false;

    const applyTilt = () => {
      gsap.set(track, {
        rotateX: metrics.tilt,
        transformOrigin: "50% 50%",
        force3D: true,
      });
    };

    const readMetrics = () => {
      const w = Math.max(320, stage.clientWidth);
      if (w < 420) {
        metrics = {
          step: 22,
          radius: 210,
          dip: 16,
          visibleSlots: 1.35,
          tilt: 12,
        };
        stage.style.perspective = "640px";
      } else if (w < 640) {
        metrics = {
          step: 20,
          radius: 280,
          dip: 22,
          visibleSlots: 1.7,
          tilt: 12,
        };
        stage.style.perspective = "720px";
      } else if (w < 900) {
        metrics = {
          step: 18,
          radius: 390,
          dip: 32,
          visibleSlots: 2.35,
          tilt: 11,
        };
        stage.style.perspective = "820px";
      } else if (w < 1100) {
        metrics = {
          step: 16.5,
          radius: 460,
          dip: 38,
          visibleSlots: 2.65,
          tilt: 10,
        };
        stage.style.perspective = "920px";
      } else {
        metrics = {
          step: 15,
          radius: 540,
          dip: 44,
          visibleSlots: 2.9,
          tilt: 10,
        };
        stage.style.perspective = "1000px";
      }
      applyTilt();
      layout(cards, state.rotation, metrics);
    };

    readMetrics();
    window.addEventListener("resize", readMetrics);
    const apply = () => layout(cards, state.rotation, metrics);

    if (!reduced) {
      apply();
      const shown = cards.filter(
        (c) => getComputedStyle(c).visibility !== "hidden",
      );
      gsap.fromTo(
        shown,
        { opacity: 0, y: "+=28" },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: { each: 0.07, from: "center" },
          ease: "power3.out",
          delay: 0.45,
          onUpdate: apply,
          onComplete: () => {
            entered = true;
            apply();
          },
        },
      );
    } else {
      entered = true;
      apply();
    }

    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(40, ts - lastTs) / 1000;
      lastTs = ts;

      if (entered && !dragging && !reduced) {
        state.rotation += dt * 0.15;
        if (Math.abs(state.rotation) > cards.length) {
          state.rotation %= cards.length;
        }
        apply();
      } else if (entered && !dragging && Math.abs(velocity) > 0.001) {
        state.rotation += velocity;
        velocity *= 0.92;
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      velocity = 0;
      lastX = e.clientX;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const delta = (-dx / Math.max(280, stage.clientWidth)) * 3.8;
      state.rotation += delta;
      velocity = delta;
      apply();
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      stage.style.cursor = "grab";
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", readMetrics);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      gsap.killTweensOf(cards);
      gsap.killTweensOf(track);
    };
  }, [images]);

  return (
    <div
      ref={stageRef}
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destination photography carousel"
      style={{
        perspective: "900px",
        perspectiveOrigin: "50% 35%",
        transformStyle: "preserve-3d",
        cursor: "grab",
        touchAction: "none",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
      }}
    >
      {/* Soft ground glow under the arc */}
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] h-[40%] w-[70%] -translate-x-1/2 rounded-full opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div
        ref={trackRef}
        className="relative mx-auto h-[210px] sm:h-[300px] md:h-[340px] lg:h-[380px] w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            data-cyl-card
            className="absolute left-1/2 top-1/2 h-[180px] w-[118px] sm:h-[250px] sm:w-[164px] md:h-[280px] md:w-[184px] lg:h-[310px] lg:w-[200px] overflow-hidden rounded-[1.35rem] sm:rounded-[1.75rem] md:rounded-[2rem] bg-[#cfc8be] shadow-[0_20px_48px_rgba(4,6,18,0.48)] ring-1 ring-white/25"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 118px, 200px"
              className="object-cover pointer-events-none select-none"
              priority={i < 5}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
