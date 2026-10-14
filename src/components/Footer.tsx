import { navLinks, pendingApprovals, siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="pb-8 sm:pb-10 pt-2 sm:pt-4" role="contentinfo">
      <div className="container-rh">
        <div className="card-soft bg-ocean-deep text-white rounded-[1.75rem] sm:rounded-[2.5rem] px-6 py-9 sm:px-8 sm:py-12 md:px-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7 sm:gap-10">
            <div>
              <p className="text-2xl md:text-3xl font-semibold tracking-tight">
                Royal Holiday
              </p>
              <p className="mt-3 text-white/65 max-w-sm text-sm leading-relaxed">
                {siteConfig.tagline}
              </p>
              <a
                href={siteConfig.phoneHref}
                className="mt-5 inline-block text-sm text-white/80 hover:text-white"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              ))}
              <a href="#qualify" className="hover:text-white">
                Begin your journey
              </a>
            </div>

            <Button href="#qualify" variant="light" size="lg" magnetic>
              Begin your journey
            </Button>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
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
    </footer>
  );
}
