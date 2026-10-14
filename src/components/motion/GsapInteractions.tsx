"use client";

/**
 * Reliable GSAP hover interactions (magnetic + card zoom + lift).
 * Desktop fine-pointer only; no custom cursor (that was swallowing UX).
 */

import { useEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GsapInteractions() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cleanups: Array<() => void> = [];
    const bound = new WeakSet<Element>();

    const bindMagnetic = (el: HTMLElement) => {
      if (bound.has(el)) return;
      bound.add(el);

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      const strength = Number(el.dataset.magneticStrength ?? 16);

      const onEnter = () => {
        gsap.to(el, { scale: 1.05, duration: 0.35, ease: "power3.out" });
      };
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        xTo(((e.clientX - (r.left + r.width / 2)) / r.width) * strength);
        yTo(((e.clientY - (r.top + r.height / 2)) / r.height) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
        gsap.to(el, { scale: 1, duration: 0.4, ease: "power3.out" });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        gsap.set(el, { clearProps: "x,y,scale" });
      });
    };

    const bindHoverCard = (el: HTMLElement) => {
      if (bound.has(el)) return;
      bound.add(el);

      const media = el.querySelector<HTMLElement>("[data-hover-media]");
      const overlay = el.querySelector<HTMLElement>("[data-hover-overlay]");
      const caption = el.querySelector<HTMLElement>("[data-hover-caption]");

      const onEnter = () => {
        gsap.to(el, { y: -8, duration: 0.5, ease: "power3.out" });
        if (media) {
          gsap.to(media, { scale: 1.1, duration: 0.85, ease: "power2.out" });
        }
        if (overlay) {
          gsap.to(overlay, { opacity: 1, duration: 0.35 });
        }
        if (caption) {
          gsap.to(caption, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
        }
      };
      const onLeave = () => {
        gsap.to(el, { y: 0, duration: 0.5, ease: "power3.out" });
        if (media) gsap.to(media, { scale: 1, duration: 0.7, ease: "power2.out" });
        if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        if (caption) gsap.to(caption, { opacity: 0, y: 8, duration: 0.3 });
      };

      if (caption) gsap.set(caption, { opacity: 0, y: 8 });
      if (overlay) gsap.set(overlay, { opacity: 0 });

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        gsap.set(el, { clearProps: "y" });
        if (media) gsap.set(media, { clearProps: "scale" });
      });
    };

    const bindLift = (el: HTMLElement) => {
      if (bound.has(el)) return;
      bound.add(el);
      const onEnter = () =>
        gsap.to(el, { y: -3, duration: 0.3, ease: "power3.out" });
      const onLeave = () =>
        gsap.to(el, { y: 0, duration: 0.35, ease: "power3.out" });
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        gsap.set(el, { clearProps: "y" });
      });
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(bindMagnetic);
      document.querySelectorAll<HTMLElement>("[data-hover-card]").forEach(bindHoverCard);
      document.querySelectorAll<HTMLElement>("[data-hover-lift]").forEach(bindLift);
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mo.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, [reduced]);

  return null;
}
