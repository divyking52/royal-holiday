"use client";

/**
 * Horizontal filmstrip carousel — overlapping landscape cards in a slow marquee.
 * Replaces the previous inward 3D cylinder.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type CylinderImage = {
  id: string;
  src: string;
  alt: string;
};

type Props = {
  images: readonly CylinderImage[];
  className?: string;
};

export function CylindricalCarousel({ images, className }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loop = [...images, ...images];

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    if (prefersReducedMotion()) {
      gsap.set(track, { x: 0 });
      return;
    }

    let tween: gsap.core.Tween | undefined;

    const start = () => {
      tween?.kill();
      gsap.set(track, { x: 0 });
      const width = track.scrollWidth / 2;
      if (width < 1) return;
      tween = gsap.to(track, {
        x: -width,
        duration: Math.max(24, width / 46),
        ease: "none",
        repeat: -1,
      });
    };

    start();
    const pause = () => tween?.pause();
    const play = () => tween?.play();
    window.addEventListener("resize", start);
    stage.addEventListener("pointerenter", pause);
    stage.addEventListener("pointerleave", play);

    return () => {
      window.removeEventListener("resize", start);
      stage.removeEventListener("pointerenter", pause);
      stage.removeEventListener("pointerleave", play);
      tween?.kill();
    };
  }, [images]);

  return (
    <div
      ref={stageRef}
      className={cn("relative w-full", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destination photography carousel"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-3 sm:gap-4 px-3 py-3 sm:py-4 will-change-transform"
      >
        {loop.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-[1.35rem] sm:rounded-[1.75rem] bg-[#cfc8be] shadow-[0_18px_40px_rgba(4,6,18,0.28)] ring-1 ring-white/35",
              "h-[168px] w-[230px] sm:h-[210px] sm:w-[300px] md:h-[240px] md:w-[340px]",
              i % 2 === 0
                ? "-translate-y-2 sm:-translate-y-3"
                : "translate-y-3 sm:translate-y-5",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 230px, 340px"
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
