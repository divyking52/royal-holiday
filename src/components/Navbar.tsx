"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { TextRoll } from "@/components/skiper/TextRoll";
import { navLinks } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Nav entrance
  useEffect(() => {
    const el = navRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 },
    );
  }, []);

  // Mobile panel open/close
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (prefersReducedMotion()) {
      gsap.set(panel, { clearProps: "all", opacity: open ? 1 : 0, display: open ? "block" : "none" });
      return;
    }

    if (open) {
      gsap.set(panel, { display: "block" });
      gsap.fromTo(
        panel,
        { opacity: 0, y: -12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
      );
      gsap.fromTo(
        panel.querySelectorAll("[data-menu-item]"),
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.05,
        },
      );
    } else if (getComputedStyle(panel).display !== "none") {
      gsap.to(panel, {
        opacity: 0,
        y: -8,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
        },
      });
    }
  }, [open]);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 md:px-4 pointer-events-none">
      <nav
        ref={navRef}
        className={cn(
          "pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 md:px-5 transition-all duration-500",
          "bg-ocean-deep/95 text-white shadow-[0_10px_40px_rgba(28,26,24,0.25)] backdrop-blur-md",
          scrolled && "shadow-[0_12px_40px_rgba(28,26,24,0.35)]",
        )}
        aria-label="Primary"
      >
        <a
          href="#top"
          className="font-semibold tracking-tight text-white text-base sm:text-lg md:text-xl shrink-0"
        >
          Royal Holiday
        </a>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group text-sm text-white/75 hover:text-white"
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_id: `nav_${link.label.toLowerCase()}`,
                  })
                }
              >
                <TextRoll>{link.label}</TextRoll>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block shrink-0">
          <Button
            href="#qualify"
            variant="light"
            size="md"
            magnetic
            onClick={() =>
              trackEvent("cta_click", { cta_id: "nav_speak_specialist" })
            }
          >
            Speak With a Specialist
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 -mr-1 text-white rounded-full hover:bg-white/10"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        ref={panelRef}
        className="pointer-events-auto fixed top-[4.25rem] inset-x-3 bottom-3 z-50 flex flex-col rounded-[1.75rem] bg-ocean-deep p-6 text-white md:hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        style={{ display: "none" }}
        aria-hidden={!open}
      >
        <ul className="space-y-1 flex-1">
          {navLinks.map((link) => (
            <li key={link.href} data-menu-item>
              <a
                href={link.href}
                className="block font-display text-2xl py-2.5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div data-menu-item className="mt-auto pt-4">
          <Button
            href="#qualify"
            variant="light"
            size="lg"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Speak With a Vacation Specialist
          </Button>
        </div>
      </div>
    </header>
  );
}
