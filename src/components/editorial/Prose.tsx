/**
 * Prose — Source Serif body container with editorial rhythm.
 *
 * Sets font, size, leading, and paragraph spacing. First paragraph is
 * flush left; subsequent paragraphs are indented to mark the rhythm,
 * unless the parent passes `noIndent`.
 */
import { ReactNode } from "react";

interface ProseProps {
  children: ReactNode;
  className?: string;
  noIndent?: boolean;
}

export function Prose({ children, className = "", noIndent = false }: ProseProps) {
  return (
    <div
      className={[
        "font-serif text-[1.0625rem] leading-[1.7] text-[#1A1A1A]",
        "[&>p]:mb-[1em]",
        noIndent ? "" : "[&>p+p]:[text-indent:1.2em]",
        "[&>p:first-of-type+p]:[text-indent:0]",
        "[&>p.no-indent+p]:[text-indent:0]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
