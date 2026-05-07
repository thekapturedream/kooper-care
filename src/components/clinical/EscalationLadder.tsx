/**
 * EscalationLadder — the four-tier escalation stack.
 *
 * Tier 1: page nurse (1 min). Tier 2: page clinical lead (5 min).
 * Tier 3: GP-on-call (priority, yellow). Tier 4: 999 ambulance (critical, red).
 *
 * Each button is a server-action target — wired here as toasts via the
 * onAction callback. The clinician sees the escalation path at all
 * times; the choice is theirs.
 */
"use client";

import { useState } from "react";

const TIERS = [
  { id: "nurse",   label: "Page nurse", sub: "Sister Anne",       eta: "1m", tone: "default" as const },
  { id: "lead",    label: "Page clinical lead", sub: "",          eta: "5m", tone: "default" as const },
  { id: "gp",      label: "GP-on-call",   sub: "",                eta: "priority", tone: "yellow" as const },
  { id: "999",     label: "999 · ambulance", sub: "deteriorating", eta: "now", tone: "critical" as const },
];

const TONE: Record<"default" | "yellow" | "critical", string> = {
  default:  "bg-[#F5F5F5] hover:bg-[#E5E7EB] text-[#0A0A0A]",
  yellow:   "bg-[#FFD400] hover:bg-[#F5B400] text-[#0A0A0A]",
  critical: "bg-[#E5484D] hover:opacity-90 text-white",
};

export function EscalationLadder() {
  const [pressed, setPressed] = useState<string | null>(null);

  const trigger = (id: string, label: string) => {
    setPressed(id);
    // In production: server action → page service.
    // Demo: clear after a beat.
    window.setTimeout(() => setPressed(null), 1400);
    if (typeof window !== "undefined") {
      const ev = new CustomEvent("kooper:toast", { detail: label + " · request sent" });
      window.dispatchEvent(ev);
    }
  };

  return (
    <div className="space-y-2">
      {TIERS.map((t) => (
        <button
          key={t.id}
          onClick={() => trigger(t.id, t.label)}
          className={[
            "w-full text-left rounded-[10px] p-2.5 text-xs flex items-center justify-between transition",
            TONE[t.tone],
            pressed === t.id ? "ring-2 ring-offset-2 ring-[#FFD400]" : "",
          ].join(" ")}
        >
          <span>
            <strong>{t.label}</strong>
            {t.sub && <span className="ml-1 opacity-75">· {t.sub}</span>}
          </span>
          <span className="font-mono text-[0.6875rem] opacity-75">{t.eta === "now" ? "⚠ now" : t.eta === "priority" ? "⚠ priority" : "⏱ " + t.eta}</span>
        </button>
      ))}
    </div>
  );
}
