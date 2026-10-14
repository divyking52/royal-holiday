"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { conversionSection } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

const fan = [
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
];

export function ConversionCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".fan-card", {
        y: 80,
        rotate: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
      gsap.fromTo(
        ".fan-left",
        { rotate: 0 },
        {
          rotate: -10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".fan-right",
        { rotate: 0 },
        {
          rotate: 10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="conversation"
      className="section-pad"
      aria-labelledby="conversion-heading"
    >
      <div className="container-rh">
        <div className="card-soft overflow-hidden px-5 pt-9 pb-8 sm:px-6 sm:pt-12 sm:pb-10 md:px-12 md:pt-16 md:pb-14 text-center shadow-sm">
          <div className="relative mx-auto mb-7 sm:mb-10 flex h-36 sm:h-56 md:h-72 w-full max-w-md items-end justify-center">
            <div className="fan-card fan-left absolute left-[10%] bottom-1 h-28 w-20 sm:h-44 sm:w-32 md:h-56 md:w-40 overflow-hidden rounded-[1.15rem] sm:rounded-[1.5rem] origin-bottom">
              <Image src={fan[0]} alt="" fill className="object-cover" sizes="160px" />
            </div>
            <div className="fan-card relative z-10 h-32 w-24 sm:h-48 sm:w-36 md:h-60 md:w-44 overflow-hidden rounded-[1.15rem] sm:rounded-[1.5rem] shadow-lg">
              <Image src={fan[1]} alt="" fill className="object-cover" sizes="180px" />
            </div>
            <div className="fan-card fan-right absolute right-[10%] bottom-1 h-28 w-20 sm:h-44 sm:w-32 md:h-56 md:w-40 overflow-hidden rounded-[1.15rem] sm:rounded-[1.5rem] origin-bottom">
              <Image src={fan[2]} alt="" fill className="object-cover" sizes="160px" />
            </div>
          </div>

          <h2
            id="conversion-heading"
            className="font-display text-[1.65rem] sm:text-3xl md:text-5xl text-ink text-balance max-w-xl mx-auto"
          >
            You deserve to feel{" "}
            <em className="italic-em">alive</em> on every getaway.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-ink-soft max-w-md mx-auto">
            {conversionSection.supporting}
          </p>
          <div className="mt-6 sm:mt-8">
            <Button
              href={conversionSection.primaryCta.href}
              variant="dark"
              size="lg"
              magnetic
              onClick={() =>
                trackEvent("cta_click", { cta_id: "conversion_book_call" })
              }
            >
              Book your free discovery call
            </Button>
          </div>
          <p className="mt-5 text-sm text-ink-soft max-w-sm mx-auto">
            {conversionSection.afterSubmit}
          </p>
        </div>
      </div>
    </section>
  );
}
