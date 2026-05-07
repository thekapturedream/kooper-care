import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection, LegalDl } from "@/components/LegalLayout";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How Kapture Logistics collects, uses, and protects your data. UK GDPR aligned.`,
  alternates: { canonical: "/privacy" },

};

const LAST_UPDATED = "12 May 2026";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy policy."
      lastUpdated={LAST_UPDATED}
      intro="This policy explains what data we collect when you use the Kapture Logistics website, why we collect it, how it's stored, and what your rights are under the UK GDPR and the Data Protection Act 2018."
    >
      <LegalSection n="01" title="Who we are">
        <p>
          Kapture Logistics is a deployable system designed and engineered by{" "}
          <strong>Kapture Studio</strong>. Kapture Studio is the data controller
          for personal data collected through this website.
        </p>
        <LegalDl
          items={[
            { term: "Controller", def: "Kapture Studio" },
            { term: "Studios",    def: SITE.cities.join(" · ") },
            { term: "Email",      def: <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">{SITE.email}</a> },
            { term: "Phone",      def: SITE.phone },
            { term: "ICO",        def: <span>Registration number to be inserted by the customer once issued.</span> },
          ]}
        />
      </LegalSection>

      <LegalSection n="02" title="What we collect">
        <p>We collect three categories of data:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Form submissions.</strong> When you submit a quote, contact,
            audit request, or report-download form, we collect the fields you
            fill in (name, work email, phone, business name, domain, role,
            sector, message, lane endpoints, cargo details).
          </li>
          <li>
            <strong>Technical data.</strong> Standard server logs (IP address,
            user-agent, request path, timestamp), and aggregated, anonymised
            analytics from Vercel.
          </li>
          <li>
            <strong>Cookies.</strong> Limited preference cookies (theme
            choice). See our{" "}
            <Link href="/cookies" className="font-semibold text-kapture-black underline dark:text-kapture-white">
              Cookies policy
            </Link>{" "}
            for the full list.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="03" title="Why we collect it (legal basis)">
        <LegalDl
          items={[
            { term: "Contract",        def: "To respond to quote and audit requests, and to deliver the services you've engaged us for." },
            { term: "Legitimate interest", def: "To run our business, defend against fraud, improve the website, and keep records of correspondence." },
            { term: "Consent",         def: "Where you opt in to the email digest or the State of UK Logistics quarterly newsletter, you can withdraw at any time." },
            { term: "Legal obligation", def: "To meet tax, accounting, and other regulatory requirements." },
          ]}
        />
      </LegalSection>

      <LegalSection n="04" title="How we store and process it">
        <p>
          Lead and form data is stored in <strong>Supabase</strong> (Postgres
          hosted in the EU), notification emails are sent via{" "}
          <strong>Resend</strong>, hosting and edge runtime are provided by{" "}
          <strong>Vercel</strong>, and discovery-call bookings are managed via{" "}
          <strong>Calendly</strong>.
        </p>
        <p>
          All four are bound by appropriate data-processing agreements and
          provide SCC-based safeguards for any international transfers.
        </p>
      </LegalSection>

      <LegalSection n="05" title="How long we keep it">
        <ul className="ml-5 list-disc space-y-2">
          <li>Quote, contact, and audit-request leads — kept for 36 months from last contact.</li>
          <li>Newsletter subscribers — kept until you unsubscribe.</li>
          <li>Technical logs — 30 days.</li>
          <li>Tax-relevant records — 7 years (UK statutory minimum).</li>
        </ul>
      </LegalSection>

      <LegalSection n="06" title="Who we share it with">
        <p>
          We don't sell, rent, or trade personal data. We share it only with
          the processors above and only to the extent necessary to deliver the
          service. We may also disclose data to comply with a lawful request
          from authorities or to defend legal claims.
        </p>
      </LegalSection>

      <LegalSection n="07" title="Your rights">
        <p>Under UK GDPR you have the right to:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Request deletion ("right to be forgotten").</li>
          <li>Restrict or object to processing.</li>
          <li>Receive your data in a portable format.</li>
          <li>Withdraw consent for processing based on consent.</li>
          <li>Lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="font-semibold text-kapture-black underline dark:text-kapture-white">ico.org.uk</a>.</li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">
            {SITE.email}
          </a>
          . We respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection n="08" title="Children">
        <p>
          The website is not directed at children under 13. We do not knowingly
          collect data from children. If you believe we have, contact us and
          we'll delete it.
        </p>
      </LegalSection>

      <LegalSection n="09" title="Changes to this policy">
        <p>
          We update this policy when our processing practices change. The "last
          updated" date at the top of the page reflects the most recent
          revision. Material changes are announced by email to the Kapture
          newsletter list.
        </p>
      </LegalSection>

      <LegalSection n="10" title="Contact">
        <p>
          Questions about privacy, rights, or any of the above —{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
