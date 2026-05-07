import { SITE } from "@/lib/utils";
import type { Role } from "@/lib/roles";

/**
 * JSON-LD structured data components.
 *
 * Each component renders a single <script type="application/ld+json"> tag
 * with the schema.org payload Google reads to power rich SERP features:
 *
 *   · OrganizationSchema  — sitewide brand entity (knowledge panel)
 *   · WebSiteSchema       — sitewide + sitelinks search box
 *   · BreadcrumbSchema    — breadcrumb trail in SERP results
 *   · ArticleSchema       — Article rich result (date, author, image)
 *   · JobPostingSchema    — Google Jobs panel (single biggest careers SEO win)
 *   · ServiceSchema       — Service offerings
 *   · LocalBusinessSchema — local pack visibility for UK searches
 *   · FAQSchema           — FAQ rich result
 *
 * All components return strings safely escaped via JSON.stringify;
 * dangerouslySetInnerHTML is the supported pattern for JSON-LD.
 */

function jsonLdScript(payload: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────── */

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/favicon.svg`,
    description: SITE.description,
    foundingDate: SITE.foundingYear,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.countryCode,
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE.parent,
      url: SITE.parentUrl,
    },
    sameAs: [
      SITE.social.linkedin,
      SITE.social.youtube,
      `https://twitter.com/${SITE.social.twitter.replace(/^@/, "")}`,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        email: SITE.email,
        contactType: "customer service",
        areaServed: ["GB", "ZA", "ZM", "ZW", "AE"],
        availableLanguage: ["en-GB"],
      },
    ],
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.locale,
    publisher: { "@id": `${SITE.url}/#organization` },
    /**
     * Sitelinks search box — when Google trusts the brand it will render
     * a search input under the SERP result that posts to /quote with the
     * candidate query. Path uses the {search_term_string} placeholder.
     */
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/quote?service={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE.url}${it.url}`,
    })),
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

type ArticleProps = {
  headline: string;
  description: string;
  image: string;
  datePublished: string; // ISO string
  dateModified?: string;
  authorName?: string;
  url: string;
};

export function ArticleSchema(props: ArticleProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.url.startsWith("http") ? props.url : `${SITE.url}${props.url}`,
    },
    headline: props.headline,
    description: props.description,
    image: props.image.startsWith("http") ? props.image : `${SITE.url}${props.image}`,
    datePublished: props.datePublished,
    dateModified: props.dateModified ?? props.datePublished,
    author: {
      "@type": "Organization",
      name: props.authorName ?? SITE.parent,
      url: SITE.parentUrl,
    },
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: SITE.locale,
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

/**
 * Google Jobs schema — this is THE single biggest SEO win for the
 * careers system. Pages with valid JobPosting schema appear in the
 * dedicated Google Jobs panel, which sits above traditional results
 * and bypasses normal ranking. Required fields enforced by Google
 * are all present.
 *
 * Reference: https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
export function JobPostingSchema({ role, datePosted }: { role: Role; datePosted: string }) {
  // Parse the salary band string into min/max numbers when possible.
  const salaryNumbers = role.salary.match(/£?([\d,]+)\s*[-–to]+\s*£?([\d,]+)/i);
  const minSalary = salaryNumbers ? Number(salaryNumbers[1].replace(/,/g, "")) : undefined;
  const maxSalary = salaryNumbers ? Number(salaryNumbers[2].replace(/,/g, "")) : undefined;

  // Map role.type to Google's enum.
  const employmentType = (() => {
    switch (role.type) {
      case "Full-time":      return "FULL_TIME";
      case "Part-time":      return "PART_TIME";
      case "Contract":       return "CONTRACTOR";
      case "Agency":         return "TEMPORARY";
      case "Apprenticeship": return "INTERN";
      default:               return "FULL_TIME";
    }
  })();

  // Valid through — 60 days from posted date by default. Google requires
  // a future ISO date or the listing is filtered out of the Jobs panel.
  const valid = new Date(datePosted);
  valid.setDate(valid.getDate() + 60);

  const data = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: `<p>${role.intro}</p><h3>Responsibilities</h3><ul>${role.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul><h3>Requirements</h3><ul>${role.requirements.map((r) => `<li>${r}</li>`).join("")}</ul><h3>Benefits</h3><ul>${role.benefits.map((r) => `<li>${r}</li>`).join("")}</ul>`,
    datePosted,
    validThrough: valid.toISOString(),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE.name,
      sameAs: SITE.url,
      logo: `${SITE.url}/favicon.svg`,
    },
    jobLocation: role.location.split(",").map((loc) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: loc.trim(),
        addressCountry: "GB",
      },
    })),
    applicantLocationRequirements: {
      "@type": "Country",
      name: "United Kingdom",
    },
    directApply: true,
    industry: "Logistics & Supply Chain",
    occupationalCategory: role.department,
    ...(minSalary && maxSalary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "GBP",
            value: {
              "@type": "QuantitativeValue",
              minValue: minSalary,
              maxValue: maxSalary,
              unitText: "YEAR",
            },
          },
        }
      : {}),
    url: `${SITE.url}/careers/${role.slug}`,
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

type ServiceItem = {
  name: string;
  description: string;
  slug: string;
};

export function ServiceSchema({ services }: { services: ServiceItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization-services`,
    name: SITE.name,
    url: SITE.url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Logistics Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          url: `${SITE.url}/services#${s.slug}`,
          provider: { "@id": `${SITE.url}/#organization` },
          areaServed: [
            { "@type": "Country", name: "United Kingdom" },
            { "@type": "Country", name: "South Africa" },
            { "@type": "Country", name: "Zimbabwe" },
            { "@type": "Country", name: "Zambia" },
          ],
        },
      })),
    },
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}${SITE.ogImage}`,
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.countryCode,
    },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "South Africa" },
      { "@type": "Country", name: "Zimbabwe" },
      { "@type": "Country", name: "Zambia" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };
  return jsonLdScript(data);
}

/* ────────────────────────────────────────────────────────────────────── */

type FAQ = { question: string; answer: string };

export function FAQSchema({ items }: { items: FAQ[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
  return jsonLdScript(data);
}
