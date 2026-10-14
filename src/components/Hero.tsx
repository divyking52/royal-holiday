"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
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
          [
            ".hero-badge",
            ".hero-title span",
            ".hero-sub",
            ".hero-cta",
            ".hero-scroll",
          ],
          { clearProps: "all", opacity: 1, y: 0 },
        );
        return;
      }

      gsap.set(
        [
          ".hero-badge",
          ".hero-title span",
          ".hero-sub",
          ".hero-cta",
          ".hero-scroll",
        ],
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
        .to(".hero-cta", { y: 0, opacity: 1, duration: 0.5 }, 0.45)
        .to(".hero-scroll", { y: 0, opacity: 1, duration: 0.45 }, 0.7);

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
    <section
      ref={rootRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-x-clip md:min-h-0"
    >
      <div className="hero-aurora-layer hero-aurora absolute inset-0 h-full pointer-events-none" />
      <div
        className="pointer-events-none absolute inset-x-0 top-[14%] mx-auto h-[38%] max-w-3xl opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(120,220,210,0.5) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative flex min-h-[100svh] flex-1 flex-col pt-[4.75rem] pb-6 sm:pt-24 md:min-h-0 md:pt-24 md:pb-8">
        <div className="container-rh text-center text-white">
          <div className="hero-badge mx-auto mb-5 sm:mb-6 inline-flex max-w-[min(100%,22rem)] items-center gap-2.5 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md">
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
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 truncate">
              {heroContent.badge}
            </span>
          </div>

          <h1 className="hero-title font-display text-[2.15rem] leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl text-balance max-w-[14ch] sm:max-w-none mx-auto">
            <span className="block">{heroContent.headline}</span>
            <span className="block mt-1 sm:mt-0">
              {heroContent.headlineRest}{" "}
              <em className="italic-em font-normal">
                {heroContent.headlineEmphasis}
              </em>
            </span>
          </h1>

          <p className="hero-sub mt-4 sm:mt-5 text-[0.9rem] leading-relaxed sm:text-base md:text-lg text-white/78 max-w-[20.5rem] sm:max-w-md mx-auto">
            {heroContent.supporting}
          </p>

          <div className="hero-cta mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              href={heroContent.primaryCta.href}
              variant="light"
              size="lg"
              magnetic
              className="w-full max-w-[20.5rem] sm:w-auto sm:max-w-none shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_id: "hero_explore_vacation_ownership",
                })
              }
            >
              {heroContent.primaryCta.label}
            </Button>
            <a
              href={heroContent.secondaryCta.href}
              className="sm:hidden text-[0.8rem] font-medium tracking-[0.06em] text-white/90 underline-offset-[5px] hover:underline"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_id: "hero_speak_with_specialist",
                })
              }
            >
              {heroContent.secondaryCta.label}
            </a>
            <div className="hidden sm:block">
              <Button
                href={heroContent.secondaryCta.href}
                variant="onDark"
                size="lg"
                magnetic
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
        </div>

        <div className="relative mt-7 flex flex-1 flex-col justify-end sm:mt-8 md:mt-10 md:flex-none">
          <CylindricalCarousel images={heroContent.cylinderImages} />
          <a
            href="#philosophy"
            className="hero-scroll mt-4 sm:mt-5 mx-auto inline-flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-ink-soft/80 hover:text-ink transition-colors"
          >
            <span>{heroContent.scrollLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
