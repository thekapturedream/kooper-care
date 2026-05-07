import { PageHeader } from "./PageHeader";

/**
 * Shared layout for legal documents — Privacy, Terms, Cookies, Refunds.
 * Consistent typography + structure across all four pages.
 *
 * Usage:
 *   <LegalLayout
 *     title="Privacy policy"
 *     lastUpdated="12 May 2026"
 *     intro="..."
 *   >
 *     <LegalSection n="01" title="Who we are">...</LegalSection>
 *     <LegalSection n="02" title="What we collect">...</LegalSection>
 *   </LegalLayout>
 */

type LayoutProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, lastUpdated, intro, children }: LayoutProps) {
  return (
    <>
      <PageHeader
        eyebrow={`Legal · Updated ${lastUpdated}`}
        title={title}
        lede={intro}
      />
      {/* Body anchored to the same container left edge as the page header.
          No mx-auto — content alignment must stay consistent vertically. */}
      <section className="container-kapture py-16 md:py-24">
        <div className="max-w-3xl space-y-14 text-kapture-smoke dark:text-kapture-fog">
          {children}
        </div>
      </section>
    </>
  );
}

type SectionProps = {
  n: string;
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ n, title, children }: SectionProps) {
  return (
    <section className="border-t border-kapture-fog/60 pt-10 first:border-0 first:pt-0 dark:border-kapture-ash">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-kapture-yellow">{n}</span>
        <h2 className="font-display text-2xl font-bold tracking-tight text-kapture-black dark:text-kapture-white md:text-3xl">
          {title}
        </h2>
      </div>
      <div className="prose-kapture mt-5 space-y-4 text-sm leading-relaxed md:text-base">
        {children}
      </div>
    </section>
  );
}

/** Definition list — used for "What we collect" type rows. */
export function LegalDl({ items }: { items: { term: string; def: React.ReactNode }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 rounded-2xl border bg-white p-6 dark:border-kapture-ash dark:bg-kapture-coal sm:grid-cols-[160px,1fr]">
      {items.map((it) => (
        <div
          key={it.term}
          className="contents text-sm"
        >
          <dt className="text-xs font-semibold uppercase tracking-wider text-kapture-mist sm:pt-1">
            {it.term}
          </dt>
          <dd className="text-kapture-smoke dark:text-kapture-fog">{it.def}</dd>
        </div>
      ))}
    </dl>
  );
}
