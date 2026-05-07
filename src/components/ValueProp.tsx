import { LayoutGrid, Users, BadgePoundSterling } from "lucide-react";

/**
 * Three-pillar thesis. Modular by design / HR is the spine / Pay what you use.
 * Server component. The middle card is the dark hero card to draw the eye to
 * the HR-spine differentiator — that's the layered repeat from the Hero copy.
 */
export function ValueProp() {
  return (
    <section className="bg-white py-20 lg:py-28 dark:bg-kapture-black">
      <div className="container-kapture">
        <div className="mb-14 max-w-3xl">
          <span className="chip-kapture mb-4 border-kapture-yellow bg-kapture-yellow font-mono text-[0.6875rem] tracking-widest text-kapture-black">
            THE THESIS
          </span>
          <h2 className="mt-4 font-display text-section-xl text-balance text-kapture-black dark:text-kapture-white">
            Care software shouldn&apos;t make you buy what you don&apos;t use.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-kapture-smoke dark:text-kapture-fog md:text-lg">
            PCS, Nourish, CareDocs sell you everything. You pay for assessment tools you&apos;ll never run,
            charts you&apos;ll never plot, and modules you don&apos;t need. Kapture Care is built differently.
            HR is the spine. Every other module is opt-in, works standalone, and integrates the moment
            you turn it on.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            icon={<LayoutGrid size={22} />}
            iconBg="bg-kapture-black text-kapture-yellow"
            title="Modular by design"
            body="10 modules. Every one works standalone. Snap them together however your service needs. Domiciliary takes Recording + Charts + Reports. Forensic adds Behaviour + Compliance. Nursing home takes the lot. You decide."
          />
          <Card
            dark
            icon={<Users size={22} />}
            iconBg="bg-kapture-yellow text-kapture-black"
            title="HR is the spine"
            body="Every session starts with a person. Login pulls your role, your shift, your residents, your tools, your training, your access privileges. The system already knows what you can see and what you can do — before you've clicked a thing."
          />
          <Card
            icon={<BadgePoundSterling size={22} />}
            iconBg="bg-kapture-black text-kapture-yellow"
            title="Manage costs effectively"
            body="From £2.40 per resident / month for HR-only. Add modules as your service grows. Drop them as needs change. No 12-month lock-ins. No setup fees. No surprise add-on tax. The opposite of how the incumbents charge."
          />
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  body: string;
  dark?: boolean;
};

function Card({ icon, iconBg, title, body, dark }: CardProps) {
  if (dark) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-kapture-black p-7 text-white">
        <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-kapture-yellow/20 blur-2xl" />
        <div className="relative">
          <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
          <h3 className="mb-2 font-display text-xl font-semibold">{title}</h3>
          <p className="text-sm leading-relaxed text-kapture-fog">{body}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-kapture-fog bg-kapture-paper p-7 dark:border-kapture-ash dark:bg-kapture-ink">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
      <h3 className="mb-2 font-display text-xl font-semibold text-kapture-black dark:text-kapture-white">{title}</h3>
      <p className="text-sm leading-relaxed text-kapture-smoke dark:text-kapture-fog">{body}</p>
    </div>
  );
}
