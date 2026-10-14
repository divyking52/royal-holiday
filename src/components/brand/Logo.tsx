import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  tone?: "dark" | "light" | "gold";
  markOnly?: boolean;
};

export function Logo({ className, tone = "dark", markOnly = false }: Props) {
  const color =
    tone === "light"
      ? "text-ink"
      : tone === "gold"
        ? "text-gold"
        : "text-ocean";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        color,
        className,
      )}
      aria-label="Royal Holiday"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle
          cx="18"
          cy="18"
          r="16.5"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M18 7.5c2.8 3.2 4.5 6.8 4.5 10.5S20.8 25.3 18 28.5C15.2 25.3 13.5 21.7 13.5 18S15.2 10.7 18 7.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M8 18h20"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
      {!markOnly ? (
        <span className="font-display text-xl md:text-2xl tracking-[0.04em] leading-none">
          Royal Holiday
        </span>
      ) : null}
    </span>
  );
}
