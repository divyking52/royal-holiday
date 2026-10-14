"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
};

/**
 * Scroll-triggered fade/rise for children inside a section ref.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  {
    selector = "[data-reveal]",
    y = 36,
    duration = 0.75,
    stagger = 0.1,
    start = "top 78%",
  }: RevealOptions = {},
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll(selector), { clearProps: "all", opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(selector);
      if (!targets.length) return;

      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start },
      });
    }, root);

    return () => ctx.revert();
  }, [ref, selector, y, duration, stagger, start]);
}
