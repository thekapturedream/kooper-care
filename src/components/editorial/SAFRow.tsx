/**
 * SAFRow — the CQC Single Assessment Framework pill row.
 *
 * Five small pills, each tinted to its quality statement: Safe, Effective,
 * Caring, Responsive, Well-led. Used at the foot of every domain section
 * to declare the SAF mapping for inspector traceability.
 */
const PILLS = [
  { label: "Safe",       cls: "bg-[#FEE2E2] text-[#B42318]" },
  { label: "Effective",  cls: "bg-[#DCFCE7] text-[#047857]" },
  { label: "Caring",     cls: "bg-[#FEF3C7] text-[#876300]" },
  { label: "Responsive", cls: "bg-[#0A0A0A]/10 text-[#1A1A1A]" },
  { label: "Well-led",   cls: "bg-[#EDE9FE] text-[#5B21B6]" },
];

interface SAFRowProps {
  className?: string;
}

export function SAFRow({ className = "" }: SAFRowProps) {
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-1.5 pt-4 mt-4 border-t border-[#ECEAE3]",
        "font-mono text-[0.6875rem] text-[#6B7280]",
        className,
      ].join(" ")}
    >
      <span>CQC SAF</span>
      {PILLS.map((p) => (
        <span
          key={p.label}
          className={[
            "inline-flex items-center px-2 py-0.5 rounded-full",
            "font-mono text-[0.625rem] font-semibold uppercase tracking-[0.04em]",
            p.cls,
          ].join(" ")}
        >
          {p.label}
        </span>
      ))}
    </div>
  );
}
