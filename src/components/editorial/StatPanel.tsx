/**
 * StatPanel — the four-up editorial stat block.
 *
 * Mono kicker label, large Space Grotesk numeral, italic serif foot.
 * Sits between two thin rules. Used to surface frequency, scores,
 * responsible parties, and counts in a glanceable row.
 */
interface Stat {
  label: string;
  value: string;
  foot?: string;
}

interface StatPanelProps {
  stats: Stat[];
  className?: string;
}

export function StatPanel({ stats, className = "" }: StatPanelProps) {
  return (
    <div
      className={[
        "grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4",
        "py-4 my-5 border-y border-[#ECEAE3]",
        className,
      ].join(" ")}
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#6B7280] mb-1">
            {stat.label}
          </div>
          <div className="font-display text-[1.375rem] font-semibold leading-[1.1] text-black">
            {stat.value}
          </div>
          {stat.foot && (
            <div className="font-serif italic text-[0.8125rem] text-[#6B7280] mt-0.5">
              {stat.foot}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
