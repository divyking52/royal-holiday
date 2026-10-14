import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";

type Props = {
  tag?: string;
  headline: React.ReactNode;
  supporting?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({
  tag,
  headline,
  supporting,
  align = "left",
  className,
  id,
}: Props) {
  return (
    <header
      id={id}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {tag ? (
        <div className={cn("mb-5", align === "center" && "flex justify-center")}>
          <Tag>{tag}</Tag>
        </div>
      ) : null}
      <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] text-ink text-balance">
        {headline}
      </h2>
      {supporting ? (
        <p
          className={cn(
            "mt-5 text-base md:text-lg text-ink-soft leading-relaxed max-w-xl",
            align === "center" && "mx-auto",
          )}
        >
          {supporting}
        </p>
      ) : null}
    </header>
  );
}
