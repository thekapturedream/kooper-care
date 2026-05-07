/**
 * "On the corridor" — testimonials from carers, managers, owners.
 * Replaces the Logistics OnTheGround. The middle quote is the dark/yellow card
 * to give the section visual rhythm matching the brand DNA.
 */
const QUOTES = [
  {
    name: "Rebecca",
    role: "Senior Carer",
    org: "Residential, 24-bed",
    initials: "RA",
    body:
      "I record a note in my voice. I confirm. Done. No typing on a tiny screen with gloves on. I get fifteen minutes back every shift.",
  },
  {
    name: "Lola",
    role: "Registered Manager",
    org: "Supported living, 48-bed",
    initials: "LO",
    body:
      "CQC arrived. I clicked the inspector pack. Every line traced back to the source note. The inspector said it was the cleanest evidence pack she'd seen in 2026.",
    dark: true,
  },
  {
    name: "Daniel",
    role: "Owner",
    org: "3-site domiciliary",
    initials: "DC",
    body:
      "We dropped two modules we weren't using. Saved £4,200 this quarter. The incumbents wanted a 12-month renewal commitment to even start that conversation.",
  },
] as const;

export function OnTheGround() {
  return (
    <section className="bg-kapture-paper py-20 dark:bg-kapture-ink lg:py-28">
      <div className="container-kapture">
        <div className="mb-12">
          <span className="chip-kapture mb-4 border-kapture-yellow bg-kapture-yellow font-mono text-[0.6875rem] tracking-widest text-kapture-black">
            VOICES
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-section-xl text-balance text-kapture-black dark:text-kapture-white">
            From the corridor, not the boardroom.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {QUOTES.map((q) => (
            <Quote key={q.name} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}

type QuoteProps = (typeof QUOTES)[number] & { dark?: boolean };

function Quote({ name, role, org, initials, body, dark }: QuoteProps) {
  if (dark) {
    return (
      <figure className="rounded-2xl bg-kapture-black p-7 text-white">
        <div className="mb-3 font-display text-4xl leading-none text-kapture-yellow">&ldquo;</div>
        <blockquote className="text-base leading-relaxed">{body}</blockquote>
        <figcaption className="mt-5 flex items-center gap-3 border-t border-kapture-ash pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kapture-yellow font-mono text-xs font-semibold text-kapture-black">
            {initials}
          </div>
          <div>
            <div className="text-sm font-semibold">{name}, {role}</div>
            <div className="text-xs text-kapture-mist">{org}</div>
          </div>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="rounded-2xl border border-kapture-fog bg-white p-7 dark:border-kapture-ash dark:bg-kapture-coal">
      <div className="mb-3 font-display text-4xl leading-none text-kapture-yellow">&ldquo;</div>
      <blockquote className="text-base leading-relaxed text-kapture-black dark:text-kapture-white">
        {body}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-kapture-fog pt-5 dark:border-kapture-ash">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kapture-coal font-mono text-xs text-white">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-kapture-black dark:text-kapture-white">
            {name}, {role}
          </div>
          <div className="text-xs text-kapture-mist">{org}</div>
        </div>
      </figcaption>
    </figure>
  );
}
