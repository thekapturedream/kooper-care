import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Refund policy",
  description: `When and how Kapture Studio issues refunds for engagements.`,
  alternates: { canonical: "/refunds" },

};

const LAST_UPDATED = "12 May 2026";

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Refund policy."
      lastUpdated={LAST_UPDATED}
      intro="We move fast and we want every engagement to land well. This policy covers the cases where you're entitled to a refund, and how we handle the rare ones that go sideways."
    >
      <LegalSection n="01" title="Cooling-off period">
        <p>
          Under the UK Consumer Contracts Regulations 2013, consumers
          ordering services online have a <strong>14-day cooling-off
          period</strong> from the date of the engagement during which they
          can cancel for any reason and receive a full refund.
        </p>
        <p>
          Two important conditions:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            The cooling-off right applies to consumers (individuals acting
            outside their trade), not to businesses.
          </li>
          <li>
            If you've explicitly asked us to start work inside the cooling-
            off period, you may be liable for the proportion of work
            completed up to your cancellation request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="02" title="Pre-launch refunds (template Deploy)">
        <p>
          If you cancel a Deploy engagement <strong>before</strong> we begin
          branding and customisation work, we refund 100% of the deposit.
        </p>
        <p>
          Once branding work has started (typically within 6 hours of brief
          lock), we refund the deposit minus any time already spent at our
          standard rates.
        </p>
      </LegalSection>

      <LegalSection n="03" title="Pre-launch refunds (Brand & Studio)">
        <p>
          For Brand and Studio engagements with milestone-based delivery,
          refunds are calculated against the milestone you've reached.
          Completed milestones are non-refundable. Work in progress at the
          point of cancellation is refundable on a pro-rata basis.
        </p>
      </LegalSection>

      <LegalSection n="04" title="Post-launch refunds">
        <p>
          Once your site is live and you've signed off on the handover, the
          deliverables are considered accepted and the engagement fees are
          non-refundable. The 30-day post-launch support window covers
          defects in our work — that's the route for any issues that surface
          after launch.
        </p>
      </LegalSection>

      <LegalSection n="05" title="Studio retainers">
        <p>
          Monthly studio retainers can be cancelled with 30 days' written
          notice. Already-paid months are non-refundable. We'll continue to
          deliver the agreed monthly hours through the notice period.
        </p>
      </LegalSection>

      <LegalSection n="06" title="Free audits">
        <p>
          The Kurongeka audit and the State of UK Logistics report are
          delivered free of charge. There's nothing to refund. If you're not
          happy with an audit, email us and we'll re-run it at no extra cost.
        </p>
      </LegalSection>

      <LegalSection n="07" title="How to request a refund">
        <p>
          Email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">
            {SITE.email}
          </a>{" "}
          with the subject line{" "}
          <em>"Refund request — [your business name]"</em>. Include your
          original invoice or Stripe payment reference. We confirm receipt
          within 1 business day, agree the refund amount within 5 business
          days, and process the refund within 10 business days of agreement.
        </p>
      </LegalSection>

      <LegalSection n="08" title="Disputes">
        <p>
          If we can't agree on a refund amount, we both commit to a good-
          faith resolution discussion before escalating to chargebacks or
          legal proceedings. See our{" "}
          <Link href="/terms" className="font-semibold text-kapture-black underline dark:text-kapture-white">
            Terms & conditions
          </Link>{" "}
          for the full dispute-resolution path.
        </p>
      </LegalSection>

      <LegalSection n="09" title="Contact">
        <p>
          For anything refund-related, email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">
            {SITE.email}
          </a>{" "}
          or call us on {SITE.phone}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
