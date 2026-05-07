/**
 * AudienceTabs — switch the reports view by who's asking.
 *
 * CQC pack, Operations, Clinical, Family, Board. Each carries its own
 * count and is a single-click swap. State stays local; the underlying
 * tile grid re-filters server-side on real builds.
 */
"use client";

import { useState } from "react";

const TABS = [
  { id: "cqc",      label: "CQC pack",   count: 22, deck: "Inspector-ready evidence across the five SAF quality statements." },
  { id: "ops",      label: "Operations", count: 14, deck: "Shift handover, occupancy, training, complaints. Manager view." },
  { id: "clinical", label: "Clinical",   count: 11, deck: "NEWS2 trends, MAR exceptions, wound healing, behaviour patterns." },
  { id: "family",   label: "Family",     count: 5,  deck: "Plain-English daily and weekly summaries the family can open in seconds." },
  { id: "board",    label: "Board",      count: 8,  deck: "Outcomes, finance proxies, incident counts, regulatory standing." },
] as const;
type AudId = typeof TABS[number]["id"];

interface AudienceTabsProps {
  onChange?: (audience: AudId) => void;
  defaultId?: AudId;
}

export function AudienceTabs({ onChange, defaultId = "cqc" }: AudienceTabsProps) {
  const [active, setActive] = useState<AudId>(defaultId);
  const meta = TABS.find((t) => t.id === active)!;

  return (
    <div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-[#6B7280] font-mono mr-2 shrink-0">AUDIENCE</span>
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActive(t.id);
                onChange?.(t.id);
              }}
              className={[
                "inline-flex items-center gap-2 rounded-[12px] border px-3.5 py-2.5 text-sm font-medium transition shrink-0",
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-[#2A2A2A] border-[#D4D4D4] hover:border-black",
              ].join(" ")}
            >
              {t.label}
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold",
                  isActive ? "bg-[#FFD400] text-black" : "bg-[#F5F5F5] text-[#2A2A2A]",
                ].join(" ")}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-[#6B7280] font-serif italic">{meta.deck}</div>
    </div>
  );
}
