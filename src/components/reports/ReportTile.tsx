/**
 * ReportTile — the canonical reports-grid tile.
 *
 * Three-line layout: kicker, big stat, italic-serif subtitle. Optional
 * sparkline at the foot. The `featured` variant flips to dark with
 * yellow accents and is used for the SAF readiness card.
 *
 * The `source` chip declares which kooper · X app feeds the tile so the
 * audience can trace any number back to its source.
 */
import { ReactNode } from "react";

type Tone = "default" | "yellow" | "green";

interface ReportTileProps {
  kicker: string;
  source: string;
  stat: ReactNode;
  subtitle: string;
  spark?: number[];        // values 0-100
  sparkTone?: Tone;
  featured?: boolean;
  className?: string;
}

const TONE_BAR: Record<Tone, string> = {
  default: "bg-black",
  yellow:  "bg-[#FFD400]",
  green:   "bg-[#10B981]",
};

export function ReportTile({
  kicker,
  source,
  stat,
  subtitle,
  spark,
  sparkTone = "default",
  featured = false,
  className = "",
}: ReportTileProps) {
  const base = featured
    ? "bg-gradient-to-b from-black to-[#1A1A1A] text-white border-black"
    : "bg-white text-black border-[#E5E7EB]";

  return (
    <div
      className={[
        "rounded-[16px] border p-5 transition",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.12)]",
        base,
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className={[
            "font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-2",
            featured ? "text-[#FFD400]" : "text-[#876300]",
          ].join(" ")}
        >
          <span aria-hidden className="inline-block h-[2px] w-[18px] bg-[#FFD400]" />
          {kicker}
        </span>
        <span
          className={[
            "font-mono text-[0.6875rem] inline-flex items-center gap-1 px-2 py-0.5 rounded-md border",
            featured
              ? "bg-white/10 border-white/15 text-white/80"
              : "bg-[#F5F5F5] border-[#E5E7EB] text-[#6B7280]",
          ].join(" ")}
        >
          {source}
        </span>
      </div>
      <div className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.015em] font-semibold">{stat}</div>
      <div className={["font-serif italic text-sm mt-1", featured ? "text-white/80" : "text-[#6B7280]"].join(" ")}>{subtitle}</div>
      {spark && (
        <div className="flex items-end gap-[2px] h-8 mt-4">
          {spark.map((v, i) => (
            <span
              key={i}
              className={["flex-1 rounded-t-[2px]", featured ? "bg-[#FFD400]" : TONE_BAR[sparkTone]].join(" ")}
              style={{ height: `${Math.max(6, v)}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
