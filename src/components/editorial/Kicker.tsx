/**
 * Kicker — the small mono label that sits above an editorial heading.
 *
 * Yellow leading bar, mono uppercase text. The "warning amber" colour
 * means active/due, "ok green" means current, default colour ships
 * neutral.
 */
import { ReactNode } from "react";

type KickerTone = "default" | "ok" | "warn" | "crit" | "on-dark";

interface KickerProps {
  children: ReactNode;
  tone?: KickerTone;
  className?: string;
}

const TONE: Record<KickerTone, string> = {
  default: "text-[#876300]",
  ok: "text-[#047857]",
  warn: "text-[#B45309]",
  crit: "text-[#B42318]",
  "on-dark": "text-[#FFD400]",
};

export function Kicker({ children, tone = "default", className = "" }: KickerProps) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2",
        "font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
        TONE[tone],
        className,
      ].join(" ")}
    >
      <span aria-hidden className="inline-block h-[2px] w-[18px] bg-[#FFD400]" />
      {children}
    </div>
  );
}
