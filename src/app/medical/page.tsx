import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medical Travel Inquiry (Separate Journey)",
  description:
    "Architecture placeholder for procedure-specific medical travel campaigns. Kept fully separate from vacation-club membership marketing.",
  robots: { index: false, follow: false },
};

/**
 * Medical tourism must remain independent from vacation ownership campaigns.
 * This route is an architecture stub only — do not collect PHI here until
 * healthcare privacy safeguards, intake flows, and legal review are complete.
 */
export default function MedicalTravelStubPage() {
  return (
    <main className="min-h-screen bg-ivory text-ink">
      <div className="container-rh py-24 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-ocean">
          Separate campaign architecture
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          Medical travel campaigns stay separate
        </h1>
        <p className="mt-5 text-ink-soft leading-relaxed">
          Procedure-specific U.S. patient campaigns require their own landing
          pages, qualification flow, secure medical intake, healthcare privacy
          safeguards, consultation scheduling, individualized quotes, and
          deposit/treatment tracking.
        </p>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Do not collect detailed health information in the vacation-club form.
          Do not send sensitive medical information to ordinary marketing
          analytics.
        </p>
        <ul className="mt-8 space-y-2 text-sm text-ink-soft list-disc pl-5">
          <li>Procedure-specific content</li>
          <li>Initial qualification (non-PHI)</li>
          <li>Secure medical intake & review</li>
          <li>HIPAA / applicable privacy safeguards</li>
          <li>Consultation scheduling</li>
          <li>Individualized quote process</li>
          <li>Deposit and treatment booking tracking</li>
        </ul>
        <Link
          href="/"
          className="inline-block mt-10 text-ocean underline-offset-4 hover:underline"
        >
          ← Return to vacation-club membership site
        </Link>
      </div>
    </main>
  );
}
