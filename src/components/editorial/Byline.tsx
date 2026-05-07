/**
 * Byline — the editorial metadata strip.
 *
 * Mono caption sitting between thin horizontal rules. Each item is a
 * label/value pair; the label is bold, the value is normal weight.
 * Used for plan version, lead reviewer, resident, last edit date.
 */
interface BylineItem {
  label: string;
  value: string;
}

interface BylineProps {
  items: BylineItem[];
}

export function Byline({ items }: BylineProps) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 border-y border-[#ECEAE3] py-3 my-5 font-mono text-xs text-[#6B7280]">
      {items.map((item) => (
        <span key={item.label}>
          <strong className="text-black font-semibold">{item.label}</strong>{" "}
          {item.value}
        </span>
      ))}
    </div>
  );
}
