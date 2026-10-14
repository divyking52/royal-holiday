"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { TextRoll } from "@/components/skiper/TextRoll";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "dark" | "onDark";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<Variant, string> = {
  primary: "bg-white text-[#1a1816] shadow-sm hover:shadow-md",
  secondary: "bg-transparent text-[#1a1816] border border-[#e5e1d8]",
  ghost: "bg-transparent text-[#1a1816]",
  light: "bg-[#f5f3ef] text-[#1a1816]",
  dark: "bg-[#2a2724] text-white",
  onDark:
    "bg-transparent text-white border border-white/40 hover:bg-white/10",
};

/** Inline color wins over parent text-* (e.g. hero text-white). */
const variantColor: Record<Variant, string> = {
  primary: "#1a1816",
  secondary: "#1a1816",
  ghost: "#1a1816",
  light: "#1a1816",
  dark: "#ffffff",
  onDark: "#ffffff",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-[0.9rem] sm:px-7 sm:py-3.5 sm:text-[0.95rem]",
};

function renderLabel(children: ReactNode) {
  if (typeof children === "string") {
    return <TextRoll center={children.length > 14}>{children}</TextRoll>;
  }
  return children;
}

function isHashOrRelative(href: string) {
  return href.startsWith("#") || href.startsWith("/");
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    magnetic = false,
    className,
    children,
  } = props;

  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide will-change-transform transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );

  const colorStyle = { color: variantColor[variant] } as const;
  const magneticAttr = magnetic ? true : undefined;

  if ("href" in props && props.href) {
    const href = props.href;
    const shared = {
      className: classes,
      style: colorStyle,
      onClick: props.onClick,
      "data-magnetic": magneticAttr,
      children: renderLabel(children),
    };

    // In-page hashes: native anchor avoids Next Link prefetch/hydration noise
    if (href.startsWith("#")) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...shared}
        />
      );
    }

    if (isHashOrRelative(href)) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...shared}
        />
      );
    }

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...shared}
      />
    );
  }

  const {
    href: _href,
    variant: _v,
    size: _s,
    magnetic: _m,
    className: _c,
    children: _ch,
    ...btnProps
  } = props as ButtonAsButton & CommonProps;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      style={colorStyle}
      data-magnetic={magneticAttr}
      {...btnProps}
    >
      {renderLabel(children)}
    </button>
  );
});
