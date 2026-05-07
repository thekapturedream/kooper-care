import Link from "next/link";
import { Home, House, Users, Heart, ShieldAlert } from "lucide-react";

/**
 * Five service-type tiles. Same modules, different stack per service type.
 * Forensic / MH is the dark featured card to signal Kapture Care's depth in
 * specialist settings (a wedge against PCS's dominance there).
 */
const SOLUTIONS = [
  {
    slug: "care-home",
    title: "Care home",
    body: "Residential, 8–100+ beds. Full stack typical.",
    price: "~£5.20/res",
    icon: <Home size={42} strokeWidth={1.5} />,
  },
  {
    slug: "domiciliary",
    title: "Domiciliary",
    body: "Visit-based home care. Mobile-first stack.",
    price: "~£3.40/res",
    icon: <House size={42} strokeWidth={1.5} />,
  },
  {
    slug: "supported-living",
    title: "Supported living",
    body: "Tenancy-based. Self-sufficiency tracking core.",
    price: "~£4.20/res",
    icon: <Users size={42} strokeWidth={1.5} />,
  },
  {
    slug: "nursing",
    title: "Nursing home",
    body: "Clinical complexity, NEWS2, wound care.",
    price: "~£6.10/res",
    icon: <Heart size={42} strokeWidth={1.5} />,
  },
  {
    slug: "forensic",
    title: "Forensic / MH",
    body: "Behaviour ABC + restrictive practice + DoLS.",
    price: "From £6.80/res",
    icon: <ShieldAlert size={42} strokeWidth={1.5} />,
    dark: true,
  },
] as const;

export function SolutionsGrid() {
  return (
    <section id="solutions" className="bg-white py-20 dark:bg-kapture-black lg:py-28">
      <div className="container-kapture">
        <div className="mb-12 max-w-2xl">
          <span className="chip-kapture mb-4 border-kapture-yellow bg-kapture-yellow font-mono text-[0.6875rem] tracking-widest text-kapture-black">
            SOLUTIONS
          </span>
          <h2 className="mt-4 font-display text-section-xl text-balance text-kapture-black dark:text-kapture-white">
            Built for every shape of UK care.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-kapture-smoke dark:text-kapture-fog md:text-lg">
            Five service types. One platform. Same modules, different stack.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {SOLUTIONS.map((s) => (
            <Tile key={s.slug} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

type TileProps = (typeof SOLUTIONS)[number];

function Tile({ slug, title, body, price, icon, dark }: TileProps) {
  if (dark) {
    return (
      <Link
        href={`/solutions/${slug}`}
        className="group rounded-2xl border border-kapture-black bg-kapture-black p-6 text-white transition-all hover:border-kapture-yellow"
      >
        <div className="mb-4 flex aspect-square items-center justify-center rounded-xl border border-kapture-ash bg-kapture-coal text-kapture-yellow">
          {icon}
        </div>
        <h3 className="mb-1 font-display font-semibold">{title}</h3>
        <p className="text-xs leading-relaxed text-kapture-mist">{body}</p>
        <div className="mt-3 flex items-center justify-between text-[0.6875rem] text-kapture-mist">
          <span className="font-mono">{price}</span>
          <span className="text-kapture-yellow group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </Link>
    );
  }
  return (
    <Link
      href={`/solutions/${slug}`}
      className="group rounded-2xl border border-kapture-fog bg-kapture-paper p-6 transition-all hover:border-kapture-black dark:border-kapture-ash dark:bg-kapture-ink dark:hover:border-kapture-white"
    >
      <div className="mb-4 flex aspect-square items-center justify-center rounded-xl border border-kapture-fog bg-white text-kapture-coal dark:border-kapture-ash dark:bg-kapture-coal dark:text-kapture-fog">
        {icon}
      </div>
      <h3 className="mb-1 font-display font-semibold text-kapture-black dark:text-kapture-white">{title}</h3>
      <p className="text-xs leading-relaxed text-kapture-smoke dark:text-kapture-fog">{body}</p>
      <div className="mt-3 flex items-center justify-between text-[0.6875rem] text-kapture-mist">
        <span className="font-mono">{price}</span>
        <span className="group-hover:text-kapture-black dark:group-hover:text-kapture-white">→</span>
      </div>
    </Link>
  );
}
