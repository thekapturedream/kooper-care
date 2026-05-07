import { Hero } from "@/components/Hero";
import { ComplianceMarquee } from "@/components/ComplianceMarquee";
import { ValueProp } from "@/components/ValueProp";
import { BentoModules } from "@/components/BentoModules";
import { Stats } from "@/components/Stats";
import { OnTheGround } from "@/components/OnTheGround";
import { SolutionsGrid } from "@/components/SolutionsGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";

/**
 * Kapture Care — homepage.
 *
 * Section order mirrors the validated Kapture Logistics flow:
 *   Hero → Marquee → ValueProp → Bento → Stats → Voices → Solutions → How → CTA
 *
 * Each section is a self-contained component. Re-arrange or A/B test by
 * shuffling these imports — every block reads the SITE config from
 * `@/lib/utils` so brand chrome stays consistent.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ComplianceMarquee />
      <ValueProp />
      <BentoModules />
      <Stats />
      <OnTheGround />
      <SolutionsGrid />
      <HowItWorks />
      <CTA />
    </>
  );
}
