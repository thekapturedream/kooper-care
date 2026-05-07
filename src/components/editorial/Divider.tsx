/**
 * Divider — the centred dotted ornament between editorial sections.
 *
 * Two thin rules with a mono · · · glyph centred between them. Used
 * between domain sections in Care Plans, between problems in Clinical.
 */
export function Divider() {
  return (
    <div className="my-12 flex items-center justify-center gap-3.5 text-[#D4D4D4]">
      <span aria-hidden className="h-px flex-1 bg-[#ECEAE3]" />
      <span className="font-mono text-sm tracking-[0.4em] text-[#6B7280]">· · ·</span>
      <span aria-hidden className="h-px flex-1 bg-[#ECEAE3]" />
    </div>
  );
}
