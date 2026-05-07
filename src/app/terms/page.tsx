import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection, LegalDl } from "@/components/LegalLayout";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: `The terms that apply when you use the Kapture Logistics website or engage Kapture Studio for services.`,
  alternates: { canonical: "/terms" },

};

const LAST_UPDATED = "12 May 2026";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & conditions."
      lastUpdated={LAST_UPDATED}
      intro="These terms govern your use of the Kapture Logistics website and any services delivered by Kapture Studio. By using the site or engaging us, you agree to them."
    >
      <LegalSection n="01" title="Definitions">
        <LegalDl
          items={[
            { term: "Kapture, we, us", def: "Kapture Studio, the studio that designs and engineers Kapture Logistics." },
            { term: "Customer, you",   def: "Any person or business engaging us to deploy, customise, or build a Kapture Logistics site." },
            { term: "Site",            def: "The website at kapture-logistics.com (or any sub-domain operated by Kapture Studio)." },
            { term: "Services",        def: "Template deployment, customisation, custom builds, ongoing studio retainers, and audit services delivered by Kapture Studio." },
            { term: "Deliverables",    def: "The branded website, source code repository, hosting project, supporting documentation, and any agreed assets we ship to you." },
          ]}
        />
      </LegalSection>

      <LegalSection n="02" title="Our services">
        <p>
          Kapture Studio offers three core deliverables: <strong>Deploy</strong>{" "}
          (the Kapture Logistics template branded for your business),{" "}
          <strong>Brand</strong> (Deploy plus custom photography and sector
          tailoring), and <strong>Studio</strong> (a custom build using the
          Kapture Logistics core). We also offer free brand audits and
          post-launch retainers.
        </p>
        <p>
          The exact scope, deliverables, timeline, and price are agreed in
          writing on the discovery call before any payment is taken.
        </p>
      </LegalSection>

      <LegalSection n="03" title="Pricing and payment">
        <p>
          Prices are quoted in GBP and exclude VAT unless stated otherwise.
          Standard payment terms are a 50% deposit on engagement and 50% on
          launch. Custom builds may follow a milestone-based payment schedule.
        </p>
        <p>
          Payment links are issued via Stripe. Bank transfers are accepted for
          engagements above £5,000.
        </p>
      </LegalSection>

      <LegalSection n="04" title="Delivery and timeline">
        <p>
          Standard template deployments go live within{" "}
          <strong>24 hours</strong> of brief lock and deposit clearance,
          subject to receipt of brand assets, hosting access, and any third-
          party credentials we need. Brand and Studio engagements run on agreed
          timelines.
        </p>
        <p>
          We commit to clear-eyed timelines and we hit them. If we ever miss a
          delivery date you've paid a deposit against, we credit 5% of the
          engagement fee for each business day late, capped at 25%.
        </p>
      </LegalSection>

      <LegalSection n="05" title="Your obligations">
        <ul className="ml-5 list-disc space-y-2">
          <li>Provide accurate information when filling out forms or briefs.</li>
          <li>Supply brand assets, copy, photography, and access credentials in a timely manner.</li>
          <li>Approve milestones within 3 business days unless agreed otherwise.</li>
          <li>Respect Kapture's intellectual property in the underlying codebase.</li>
        </ul>
      </LegalSection>

      <LegalSection n="06" title="Intellectual property">
        <p>
          On full payment, you receive a{" "}
          <strong>perpetual, non-exclusive, worldwide licence</strong> to use,
          modify, and host the deliverables for your own business. The
          underlying Kapture Logistics codebase remains the intellectual
          property of Kapture Studio.
        </p>
        <p>
          You may not resell the codebase as-is to third parties, sublicense
          it, or use it to create a competing template product. You may use it
          freely for any internal or client-facing business purpose of your
          own.
        </p>
      </LegalSection>

      <LegalSection n="07" title="Hosting and operational responsibility">
        <p>
          Once the deliverables are handed over, you are responsible for the
          ongoing hosting, security, and operation of the site, unless you've
          engaged us on a Studio retainer.
        </p>
        <p>
          We provide a 30-day post-launch support window for any defects in
          our work. After that, additional work is billable at our standard
          studio rates.
        </p>
      </LegalSection>

      <LegalSection n="08" title="Warranties and liability">
        <p>
          We warrant that the deliverables will materially conform to the
          agreed scope and will be free of significant defects when handed
          over. Beyond that, the deliverables are provided "as is" without
          further warranties, express or implied.
        </p>
        <p>
          To the maximum extent permitted by law, our total liability under or
          in connection with the engagement is capped at the fees you've paid
          us in the 12 months preceding the claim. We are not liable for
          indirect, special, or consequential losses, lost profits, or
          business interruption.
        </p>
      </LegalSection>

      <LegalSection n="09" title="Termination">
        <p>
          Either party may terminate the engagement on written notice if the
          other materially breaches these terms and fails to remedy the breach
          within 14 days of being notified.
        </p>
        <p>
          On termination, you remain responsible for paying for work
          completed up to the date of termination. See our{" "}
          <Link href="/refunds" className="font-semibold text-kapture-black underline dark:text-kapture-white">
            Refund policy
          </Link>{" "}
          for refund-eligible scenarios.
        </p>
      </LegalSection>

      <LegalSection n="10" title="Governing law and disputes">
        <p>
          These terms are governed by the laws of England and Wales. Any
          dispute will be resolved through good-faith discussion in the first
          instance, then mediation, and finally the exclusive jurisdiction of
          the courts of England and Wales.
        </p>
      </LegalSection>

      <LegalSection n="11" title="Changes to these terms">
        <p>
          We may revise these terms from time to time. The "last updated" date
          at the top reflects the latest revision. Engagements already
          underway are governed by the version of these terms in effect at the
          time the engagement started.
        </p>
      </LegalSection>

      <LegalSection n="12" title="Contact">
        <p>
          Questions about these terms — email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
