/**
 * Article — the editorial paper surface.
 *
 * Wraps a body of editorial content in a warm-cream paper card with
 * generous padding and soft border. Used by every kooper · X surface
 * that needs to read like a magazine spread (Care Plans, Clinical).
 *
 * Composition: Article → Masthead, Kicker, Heading, Deck, Byline, Prose,
 * StatPanel, PullQuote, SAFRow, Divider.
 */
import { ReactNode } from "react";

interface ArticleProps {
  children: ReactNode;
  className?: string;
}

export function Article({ children, className = "" }: ArticleProps) {
  return (
    <article
      className={[
        "rounded-[18px] border border-[#ECEAE3] bg-[#FAFAF7]",
        "px-6 py-7 lg:px-11 lg:py-10",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
