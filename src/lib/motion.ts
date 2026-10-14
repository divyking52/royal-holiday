export const EASE = {
  outExpo: "power3.out",
  inOutSoft: "power2.inOut",
  outQuart: "power4.out",
} as const;

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isDesktopMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !prefersReducedMotion()
  );
}
