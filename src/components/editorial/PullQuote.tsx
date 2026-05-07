/**
 * PullQuote — italic serif quote with yellow gutter and mono cite.
 *
 * Used to surface the resident's own voice inside a care plan domain.
 * The yellow gradient on the left is intentional — the team's reminder
 * that the resident is the primary author of the plan.
 */
import { ReactNode } from "react";

interface PullQuoteProps {
  children: ReactNode;
  cite?: ReactNode;
  className?: string;
}

export function PullQuote({ children, cite, className = "" }: PullQuoteProps) {
  return (
    <blockquote
      className={[
        "my-7 border-l-[3px] border-[#FFD400] pl-6 pr-6 py-5",
        "bg-gradient-to-r from-[rgba(255,212,0,0.08)] to-transparent",
        "font-serif italic font-medium text-[1.375rem] leading-[1.4] text-black",
        className,
      ].join(" ")}
    >
      {children}
      {cite && (
        <cite className="block mt-2.5 not-italic font-mono text-[0.8125rem] font-medium text-[#6B7280] tracking-[0.04em]">
          {cite}
        </cite>
      )}
    </blockquote>
  );
}
