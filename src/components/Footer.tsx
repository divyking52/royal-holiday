import Image from "next/image";
import { navLinks, pendingApprovals, siteConfig, destinations } from "@/content/site";
import { Button } from "@/components/ui/Button";

const footerImage = destinations[0];

export function Footer() {
  return (
    <footer className="bg-ivory pb-6 sm:pb-8 pt-2" role="contentinfo">
      <div className="container-rh">
        <div className="overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] bg-ocean-deep text-white shadow-[0_24px_60px_rgba(28,26,24,0.18)]">
          <div className="relative h-60 sm:h-72 md:h-80">
            <Image
              src={footerImage.image}
              alt={footerImage.imageAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-black/15" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-5 sm:px-10 sm:pb-8">
              <p className="font-display text-[2rem] leading-none sm:text-4xl md:text-5xl">
                Royal Holiday
              </p>
              <p className="mt-2 max-w-md text-sm text-white/80 leading-relaxed">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <div className="px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                ))}
                <a
                  href={siteConfig.phoneHref}
                  className="hover:text-white whitespace-nowrap"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </div>
              <Button href="#qualify" variant="light" size="lg" magnetic>
                Begin your journey
              </Button>
            </div>

            <div className="mt-7 sm:mt-9 pt-5 sm:pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="text-xs text-white/45 max-w-xl leading-relaxed">
                <p>
                  © {new Date().getFullYear()} {siteConfig.legalName}. Vacation-club
                  membership &amp; timeshare products only.
                </p>
                <p className="mt-2">
                  Layout inspired by a Framer template aesthetic. Motion patterns
                  adapted with GSAP. Text-roll interactions inspired by{" "}
                  <a
                    href="https://skiper-ui.com"
                    className="underline underline-offset-2 hover:text-white/70"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Skiper UI
                  </a>
                  .
                </p>
              </div>
              <div className="text-xs text-white/40 space-y-2">
                <a
                  href={siteConfig.urls.privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white/70"
                >
                  Privacy policy
                </a>
                <details>
                  <summary className="cursor-pointer hover:text-white/70">
                    Outstanding approvals ({pendingApprovals.length})
                  </summary>
                  <ul className="mt-2 list-disc pl-4 space-y-1 max-w-xs">
                    {pendingApprovals.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
