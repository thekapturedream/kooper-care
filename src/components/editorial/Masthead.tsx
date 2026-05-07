/**
 * Masthead — the editorial paper's title strip.
 *
 * Two mono labels separated by a black hairline. The left side is the
 * publication identity ("kooper · care plans"); the right side is the
 * volume/number/date stamp.
 */
interface MastheadProps {
  left: string;
  right: string;
}

export function Masthead({ left, right }: MastheadProps) {
  return (
    <header className="flex items-center justify-between border-b-2 border-black pb-4 mb-7">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[#6B7280]">
        {left}
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[#6B7280]">
        {right}
      </span>
    </header>
  );
}
