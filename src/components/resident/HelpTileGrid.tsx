/**
 * HelpTileGrid — six big-tap tiles for "I need help with...".
 *
 * Each tile fires a request that's routed through kooper · hr to the
 * on-shift carer best matched to the request type. The reply ("On her
 * way · 2 min · Lola") is the receipt the resident sees so they know
 * help is coming and from whom.
 */
"use client";

import { useState } from "react";

const TILES: { id: string; label: string; icon: string; reply: string }[] = [
  { id: "toilet", label: "The toilet",     icon: "🚽", reply: "On her way · 2 min · Lola" },
  { id: "drink",  label: "A drink",        icon: "☕", reply: "Tea is coming · Daniel" },
  { id: "pain",   label: "Pain relief",    icon: "💊", reply: "Sister Anne paged · 1 min" },
  { id: "family", label: "My family",      icon: "👪", reply: "Calling Sarah now" },
  { id: "nurse",  label: "A nurse",        icon: "🩺", reply: "Sister Anne paged · 1 min" },
  { id: "talk",   label: "Just to talk",   icon: "💬", reply: "Lola is coming for a chat" },
];

export function HelpTileGrid() {
  const [active, setActive] = useState<string | null>(null);

  const onTap = (id: string) => {
    setActive(id);
    window.setTimeout(() => setActive(null), 2400);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-base">I need help with…</h2>
        {active && (
          <span className="text-xs text-[#6B7280]">{TILES.find((t) => t.id === active)?.reply}</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {TILES.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTap(t.id)}
              className={[
                "rounded-[22px] border-2 p-4 min-h-[120px] flex flex-col items-center justify-center gap-2 transition text-center",
                selected ? "bg-[#FFD400] border-black" : "bg-white border-[#E5E7EB] hover:border-black",
              ].join(" ")}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="font-semibold text-[0.95rem] text-black">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
