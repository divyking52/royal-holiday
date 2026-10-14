"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { CylindricalCarousel } from "@/components/CylindricalCarousel";
import { heroContent, destinations } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(
          [".hero-badge", ".hero-title span", ".hero-sub", ".hero-cta"],
          { clearProps: "all", opacity: 1, y: 0 },
        );
        return;
      }

      gsap.set(
        [".hero-badge", ".hero-title span", ".hero-sub", ".hero-cta"],
        { opacity: 0, y: 24 },
      );

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-badge", { y: 0, opacity: 1, duration: 0.55 }, 0.05)
        .to(
          ".hero-title span",
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          0.15,
        )
        .to(".hero-sub", { y: 0, opacity: 1, duration: 0.5 }, 0.35)
        .to(".hero-cta", { y: 0, opacity: 1, duration: 0.5 }, 0.45);

      gsap.to(".hero-aurora-layer", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const avatars = destinations.slice(0, 3);

  return (
    <section ref={rootRef} id="top" className="relative overflow-x-clip">
      <div className="hero-aurora-layer hero-aurora absolute inset-0 h-full pointer-events-none" />
      <div
        className="pointer-events-none absolute inset-x-0 top-[16%] mx-auto h-[40%] max-w-3xl opacity-35"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(120,220,210,0.5) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative pt-[5rem] sm:pt-24 md:pt-28 pb-2 sm:pb-0">
        <div className="container-rh text-center text-white">
          <div className="hero-badge mx-auto mb-4 sm:mb-5 inline-flex max-w-[min(100%,22rem)] items-center gap-2.5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 backdrop-blur-md">
            <span className="flex -space-x-2 shrink-0">
              {avatars.map((d) => (
                <span
                  key={d.id}
                  className="relative h-6 w-6 sm:h-7 sm:w-7 overflow-hidden rounded-full border border-white/40"
                >
                  <Image
                    src={d.image}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </span>
              ))}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 truncate">
              {heroContent.badge}
            </span>
          </div>

          <h1 className="hero-title font-display text-[1.9rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl text-balance max-w-[15ch] sm:max-w-none mx-auto">
            <span className="block">{heroContent.headline}</span>
            <span className="block">
              {heroContent.headlineRest}{" "}
              <em className="italic-em font-normal">
                {heroContent.headlineEmphasis}
              </em>
            </span>
          </h1>

          <p className="hero-sub mt-3.5 sm:mt-4 text-sm leading-relaxed sm:text-base md:text-lg text-white/85 max-w-[21rem] sm:max-w-md mx-auto">
            {heroContent.supporting}
          </p>

          <div className="hero-cta mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <Button
              href={heroContent.primaryCta.href}
              variant="light"
              size="lg"
              magnetic
              className="w-full sm:w-auto"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_id: "hero_explore_vacation_ownership",
                })
              }
            >
              {heroContent.primaryCta.label}
            </Button>
            <Button
              href={heroContent.secondaryCta.href}
              variant="onDark"
              size="lg"
              magnetic
              className="w-full sm:w-auto"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_id: "hero_speak_with_specialist",
                })
              }
            >
              {heroContent.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className="relative mt-5 sm:mt-6 md:mt-8 sm:pb-2">
          <CylindricalCarousel images={heroContent.cylinderImages} />
        </div>
      </div>
    </section>
  );
}
