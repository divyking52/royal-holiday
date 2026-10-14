import { cn } from "@/lib/utils";

export function Tag({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn("tag-pill", className)}>{children}</span>
  );
}
