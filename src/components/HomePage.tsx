"use client";

import { CinematicLoader } from "@/components/CinematicLoader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ImpactStats } from "@/components/ImpactStats";
import { DestinationGallery } from "@/components/DestinationGallery";
import { MembershipExplainer } from "@/components/MembershipExplainer";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { ConversionCTA } from "@/components/ConversionCTA";
import { QualificationForm } from "@/components/QualificationForm";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { GsapInteractions } from "@/components/motion/GsapInteractions";
import { AttributionCapture } from "@/components/AttributionCapture";
import { CookieConsent } from "@/components/CookieConsent";

export function HomePage() {
  return (
    <>
      <AttributionCapture />
      <CinematicLoader />
      <ScrollProgress />
      <GsapInteractions />
      <Navbar />
      <main>
        <Hero />
        <PhilosophySection />
        <ImpactStats />
        <DestinationGallery />
        <MembershipExplainer />
        <Testimonials />
        <FAQ />
        <ConversionCTA />
        <QualificationForm />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
