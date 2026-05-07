/**
 * Label — the small editorial sub-section label.
 *
 * Yellow leading bar, mono uppercase. Used to tag fields within an
 * editorial domain section ("Desired outcome", "Interventions", etc).
 */
import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export function Label({ children, className = "" }: LabelProps) {
  return (
    <div
      className={[
        "font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#6B7280]",
        "border-l-2 border-[#FFD400] pl-3 my-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
