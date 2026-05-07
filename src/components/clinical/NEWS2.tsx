/**
 * NEWS2 — early-warning vitals panel.
 *
 * Six cells: respiratory rate, SpO2, temperature, systolic BP, pulse,
 * AVPU. Each cell tints by score band (warn/crit) so a clinician
 * eyeballs the deteriorating dimension first.
 *
 * Auto-escalation triggers at composite score ≥ 5 — that logic lives
 * server-side in the Care Graph; this component is presentational.
 */
type Band = "ok" | "warn" | "crit";

interface Cell {
  label: string;
  value: string;
  unit: string;
  band?: Band;
}

interface NEWS2Props {
  score: number;
  cells: Cell[];
}

const BAND_CLS: Record<Band, string> = {
  ok:   "bg-white border-[#E5E7EB]",
  warn: "bg-[#FFFBEB] border-[#FCD34D]",
  crit: "bg-[#FEE2E2] border-[#FCA5A5]",
};

export function NEWS2({ score, cells }: NEWS2Props) {
  return (
    <div className="rounded-[14px] border border-[#D4D4D4] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <div className="font-display font-semibold">NEWS2 · early warning</div>
          <div className="text-xs text-[#6B7280]">Auto-calculated from kooper · vitals · last reading 07:40</div>
        </div>
        <span
          className={[
            "inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[0.6875rem] font-semibold tracking-[0.04em]",
            score >= 5
              ? "bg-[#FEE2E2] text-[#B42318] border border-[#FCA5A5]"
              : score >= 3
              ? "bg-[rgba(255,212,0,0.2)] text-[#876300] border border-[rgba(255,212,0,0.5)]"
              : "bg-[#DCFCE7] text-[#047857] border border-[rgba(16,185,129,0.25)]",
          ].join(" ")}
        >
          SCORE {score}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {cells.map((c) => (
          <div
            key={c.label}
            className={["rounded-[10px] border p-2.5 text-center", BAND_CLS[c.band ?? "ok"]].join(" ")}
          >
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.06em] text-[#6B7280] mb-0.5">{c.label}</div>
            <div className="font-mono font-semibold">{c.value}</div>
            <div className="font-mono text-[0.6875rem] text-[#6B7280]">{c.unit}</div>
          </div>
        ))}
      </div>
      <p className="font-mono text-[0.6875rem] text-[#6B7280] mt-3">
        Auto-escalation triggers at score ≥ 5. Currently below threshold. Recheck in 4h or sooner if symptoms change.
      </p>
    </div>
  );
}
