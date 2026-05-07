import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection, LegalDl } from "@/components/LegalLayout";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cookies policy",
  description: `What cookies the Kapture Logistics website uses and how to manage them.`,
  alternates: { canonical: "/cookies" },

};

const LAST_UPDATED = "12 May 2026";

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookies policy."
      lastUpdated={LAST_UPDATED}
      intro="This page lists the cookies and similar storage technologies the Kapture Logistics website uses, why we use them, and how you control them."
    >
      <LegalSection n="01" title="What cookies are">
        <p>
          Cookies are small text files placed on your device when you visit a
          website. They let the site remember preferences, keep you signed in,
          or measure usage. Similar technologies — local storage, session
          storage, web beacons — work the same way.
        </p>
      </LegalSection>

      <LegalSection n="02" title="Cookies we set directly">
        <LegalDl
          items={[
            {
              term: "kapture-theme",
              def: "Stored in localStorage. Remembers whether you chose light or dark mode. Preference cookie. Persists until you clear browser storage.",
            },
            {
              term: "kapture-banner-dismissed",
              def: "Stored in sessionStorage. Remembers that you closed an in-page notification for the rest of your session. Cleared when you close the tab.",
            },
            {
              term: "Form autofill data",
              def: "Stored in localStorage by your browser, not by us. Pickup and drop-off lane suggestions are remembered by the browser based on what you've previously typed.",
            },
          ]}
        />
        <p>
          None of the above set tracking cookies, identify you personally, or
          share data with third parties.
        </p>
      </LegalSection>

      <LegalSection n="03" title="Third-party cookies">
        <LegalDl
          items={[
            {
              term: "Vercel Analytics",
              def: "Privacy-friendly aggregate analytics from our hosting provider. Anonymised, no cross-site tracking. Used to measure page load performance and visit volume.",
            },
            {
              term: "Calendly",
              def: "Loaded only on success pages where the booking widget appears. Calendly sets its own cookies for its booking flow. Their policy: calendly.com/privacy.",
            },
            {
              term: "Resend",
              def: "Server-side only. Resend processes the emails we send but does not set cookies in your browser.",
            },
            {
              term: "Supabase",
              def: "Server-side only. Stores form submissions in a Postgres database. No browser cookies.",
            },
          ]}
        />
      </LegalSection>

      <LegalSection n="04" title="What we don't do">
        <ul className="ml-5 list-disc space-y-2">
          <li>No cross-site advertising cookies.</li>
          <li>No third-party retargeting pixels (Meta, Google Ads, LinkedIn).</li>
          <li>No fingerprinting.</li>
          <li>No selling or sharing of cookie data.</li>
        </ul>
      </LegalSection>

      <LegalSection n="05" title="How to manage cookies">
        <p>
          You can clear, block, or limit cookies through your browser
          settings. Most modern browsers also let you choose which cookies to
          accept on a per-site basis.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="font-semibold text-kapture-black underline dark:text-kapture-white">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noreferrer" className="font-semibold text-kapture-black underline dark:text-kapture-white">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noreferrer" className="font-semibold text-kapture-black underline dark:text-kapture-white">
              Firefox
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/en-gb/microsoft-edge" target="_blank" rel="noreferrer" className="font-semibold text-kapture-black underline dark:text-kapture-white">
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Disabling preference cookies will reset your theme choice every
          visit. Disabling third-party cookies may stop the Calendly booking
          widget from loading.
        </p>
      </LegalSection>

      <LegalSection n="06" title="Updates to this policy">
        <p>
          When we add or change cookies on the site, we update this page and
          the "last updated" date at the top.
        </p>
      </LegalSection>

      <LegalSection n="07" title="Contact">
        <p>
          See our full{" "}
          <Link href="/privacy" className="font-semibold text-kapture-black underline dark:text-kapture-white">
            Privacy policy
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-kapture-black underline dark:text-kapture-white">
            {SITE.email}
          </a>{" "}
          with any questions.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
