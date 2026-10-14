"use client";

/**
 * Skiper UI–inspired button: magnetic GSAP pull + TextRoll label.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { TextRoll } from "@/components/skiper/TextRoll";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "on-dark";
type Size = "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  /** Plain string enables TextRoll; ReactNode falls back to normal children */
  label?: string;
  children?: ReactNode;
  className?: string;
};

type AsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & { href: string; onClick?: () => void };

export type SkiperButtonProps = AsButton | AsLink;

const variants: Record<Variant, string> = {
  primary: "bg-ocean text-ocean-deep border border-transparent",
  secondary: "bg-transparent text-ink border border-ink/25",
  ghost: "bg-transparent text-ink",
  "on-dark": "bg-ocean text-ocean-deep border border-transparent",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm tracking-wide",
  lg: "px-8 py-4 text-base tracking-wide",
};

export const SkiperButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SkiperButtonProps
>(function SkiperButton(props, ref) {
  const {
    variant = "primary",
    size = "md",
    magnetic = true,
    className,
    label,
    children,
  } = props;

  const classes = cn(
    "group inline-flex items-center justify-center gap-2 font-medium uppercase will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );

  const content =
    typeof label === "string" ? (
      <TextRoll center={label.length > 12}>{label}</TextRoll>
    ) : (
      children
    );

  if ("href" in props && props.href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={props.href}
        className={classes}
        onClick={props.onClick}
        data-magnetic={magnetic || undefined}
      >
        {content}
      </Link>
    );
  }

  const {
    href: _h,
    variant: _v,
    size: _s,
    magnetic: _m,
    className: _c,
    label: _l,
    children: _ch,
    ...rest
  } = props as AsButton & Common;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      data-magnetic={magnetic || undefined}
      {...rest}
    >
      {content}
    </button>
  );
});
