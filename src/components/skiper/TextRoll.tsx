"use client";

/**
 * Skiper UI–style text roll. Uses currentColor so button contrast always works.
 * Visual duplicates are aria-hidden; accessible name comes from a sr-only label.
 */

import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
  center?: boolean;
};

export function TextRoll({ children, className, center = false }: Props) {
  const chars = Array.from(children);

  return (
    <span
      className={cn(
        "relative inline-flex overflow-hidden whitespace-nowrap text-[length:inherit] leading-none text-current",
        className,
      )}
    >
      <span className="sr-only">{children}</span>
      <span className="inline-flex" aria-hidden="true">
        {chars.map((char, i) => {
          const delay = center ? Math.abs(i - (chars.length - 1) / 2) : i;
          return (
            <span
              key={`${i}-${char === " " ? "sp" : char}`}
              className="relative inline-block h-[1em] overflow-hidden align-bottom"
              style={{ width: char === " " ? "0.3em" : undefined }}
            >
              <span
                className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2"
                style={{ transitionDelay: `${delay * 16}ms` }}
              >
                <span className="block h-[1em] leading-[1em]">
                  {char === " " ? "\u00A0" : char}
                </span>
                <span className="block h-[1em] leading-[1em]">
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
