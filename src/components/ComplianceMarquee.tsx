/**
 * Continuous-scroll marquee of compliance standards Kapture Care meets.
 * Replaces the Logistics CityMarquee. Pure CSS animation — no JS.
 */
const STANDARDS = [
  "CQC Single Assessment Framework",
  "NHS DSPT",
  "DSCR 14 Standards",
  "UK GDPR",
  "ISO 27001",
  "GP Connect",
  "One London Care Record",
  "Cyber Essentials Plus",
];

export function ComplianceMarquee() {
  return (
    <section className="overflow-hidden border-y border-kapture-fog bg-kapture-paper py-6 dark:border-kapture-ash dark:bg-kapture-ink">
      <div className="container-kapture mb-3">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-kapture-smoke dark:text-kapture-fog">
          Built to the standards UK care providers must meet
        </p>
      </div>
      <div className="flex animate-marquee gap-12">
        <Strip />
        <Strip />
      </div>
    </section>
  );
}

function Strip() {
  return (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {STANDARDS.map((s, i) => (
        <span key={`${s}-${i}`} className="flex items-center gap-12">
          <span className="whitespace-nowrap font-display font-semibold text-kapture-smoke dark:text-kapture-fog">
            {s}
          </span>
          <span className="text-kapture-fog dark:text-kapture-ash" aria-hidden>
            ·
          </span>
        </span>
      ))}
    </div>
  );
}
