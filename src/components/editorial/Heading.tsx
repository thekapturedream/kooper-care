/**
 * Heading — display title and italic serif deck.
 *
 * H1 uses Space Grotesk at clamp(2.5rem → 3.5rem). The deck is set in
 * Source Serif 4 italic at clamp(1.125rem → 1.25rem) with comfortable
 * leading. Together they form the editorial title block.
 */
import { ReactNode } from "react";

interface HeadingProps {
  title: ReactNode;
  deck?: ReactNode;
  level?: 1 | 2;
  className?: string;
}

export function Heading({ title, deck, level = 1, className = "" }: HeadingProps) {
  const sizeClass =
    level === 1
      ? "text-[clamp(2.5rem,4.2vw,3.5rem)] leading-[1.02] tracking-[-0.02em]"
      : "text-[clamp(1.625rem,2.4vw,1.875rem)] leading-[1.15] tracking-[-0.012em]";

  const Tag = level === 1 ? "h1" : "h2";

  return (
    <div className={["mb-2", className].join(" ")}>
      <Tag className={["font-display font-semibold text-black", sizeClass, "mb-2"].join(" ")}>
        {title}
      </Tag>
      {deck && (
        <p className="font-serif italic text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.5] text-[#3A3A3A] max-w-[42ch]">
          {deck}
        </p>
      )}
    </div>
  );
}
