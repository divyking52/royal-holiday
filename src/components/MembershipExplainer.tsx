"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { membershipSteps } from "@/content/site";
import { Tag } from "@/components/ui/Tag";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const stepImages = [
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
];

const AUTO_MS = 5000;

export function MembershipExplainer() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const indexRef = useRef(0);
  const busyRef = useRef(false);

  const steps = membershipSteps.steps;

  const goTo = useCallback(
    (next: number) => {
      if (busyRef.current) return;
      const i = ((next % steps.length) + steps.length) % steps.length;
      if (i === indexRef.current) return;

      busyRef.current = true;
      indexRef.current = i;
      setIndex(i);

      if (!reduced) {
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { clipPath: "inset(0% 35% 0% 35%)", scale: 1.04 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 0.85,
              ease: "power3.inOut",
            },
          );
        }
        if (copyRef.current) {
          gsap.fromTo(
            copyRef.current.children,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: "power3.out",
            },
          );
        }
      }

      window.setTimeout(() => {
        busyRef.current = false;
      }, 400);
    },
    [reduced, steps.length],
  );

  // Progress bars
  useEffect(() => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      gsap.killTweensOf(bar);
      if (i < index) gsap.set(bar, { scaleX: 1 });
      else if (i > index) gsap.set(bar, { scaleX: 0 });
      else {
        gsap.set(bar, { scaleX: 0 });
        gsap.to(bar, {
          scaleX: 1,
          duration: reduced ? 0 : AUTO_MS / 1000,
          ease: "none",
        });
      }
    });
  }, [index, reduced]);

  // Stable autoplay — don't recreate interval on every index change
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      goTo(indexRef.current + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [goTo, reduced]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-mem-reveal]", {
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="membership"
      className="section-pad bg-mist/60"
      aria-labelledby="how-heading"
    >
      <div className="container-rh">
        <div
          data-mem-reveal
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16"
        >
          <Tag>How it works</Tag>
          <h2
            id="how-heading"
            className="mt-4 sm:mt-5 font-display text-[1.65rem] sm:text-4xl md:text-5xl text-ink"
          >
            Your path to{" "}
            <em className="italic-em">vacation ownership clarity</em>
          </h2>
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-ink-soft">
            A sanctuary for travelers seeking clear information — not pressure —
            about vacation-club membership.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div
            ref={imageRef}
            data-mem-reveal
            className="relative aspect-[16/10] sm:aspect-[4/5] max-h-[34vh] sm:max-h-[70vh] overflow-hidden rounded-[1.5rem] sm:rounded-[2.25rem] will-change-transform bg-mist"
          >
            <Image
              key={index}
              src={stepImages[index] ?? stepImages[0]}
              alt="Resort experience photography — placeholder"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div data-mem-reveal>
            <div ref={copyRef} className="min-h-0 sm:min-h-[180px]">
              <p className="text-xs uppercase tracking-[0.2em] text-teal mb-3">
                Step {index + 1}
              </p>
              <h3 className="font-display text-[1.35rem] sm:text-3xl md:text-4xl text-ink">
                {steps[index]?.title}
              </h3>
              <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-ink-soft leading-relaxed max-w-md">
                {steps[index]?.body}
              </p>
            </div>

            <div className="mt-8 sm:mt-10 flex gap-2" role="tablist" aria-label="Steps">
              {steps.map((step, i) => (
                <button
                  key={step.number}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-sand-deep"
                  onClick={() => goTo(i)}
                >
                  <span
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    className="absolute inset-0 origin-left scale-x-0 rounded-full bg-ocean"
                  />
                </button>
              ))}
            </div>

            <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-ink-soft border-l-2 border-teal/40 pl-3.5 sm:pl-4 max-w-md">
              {membershipSteps.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
