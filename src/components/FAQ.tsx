"use client";

import { useId, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "@/content/site";
import { Tag } from "@/components/ui/Tag";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref, { stagger: 0.08, y: 28 });

  return (
    <section
      ref={ref}
      id="faq"
      className="section-pad"
      aria-labelledby="faq-heading"
    >
      <div className="container-rh max-w-3xl">
        <div data-reveal className="text-center mb-7 sm:mb-10 md:mb-12">
          <Tag>FAQ</Tag>
          <h2
            id="faq-heading"
            className="mt-4 sm:mt-5 font-display text-[1.65rem] sm:text-4xl md:text-5xl text-ink"
          >
            Everything You{" "}
            <em className="italic-em">Need to Know</em>
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;

            return (
              <div
                key={item.id}
                data-reveal
                className="rounded-[1.75rem] bg-sand shadow-sm px-5 md:px-7"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 sm:py-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span className="font-medium text-ink pr-2 text-[0.95rem] sm:text-base">
                      {item.question}
                    </span>
                    <span
                      className="shrink-0 text-ink-soft rounded-full bg-mist p-1.5"
                      aria-hidden
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn("faq-panel")}
                  data-open={isOpen}
                >
                  <div>
                    {isOpen ? (
                      <p className="pb-5 text-ink-soft leading-relaxed text-sm sm:text-base">
                        {item.answer}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
