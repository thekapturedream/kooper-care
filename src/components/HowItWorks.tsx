import Link from "next/link";

/**
 * Four-step process diagram. Login → System knows you → Pick modules → Care.
 * The fourth step is the yellow card to mark the moment value is delivered —
 * matching the brand DNA of yellow as a signal for "where the work happens".
 */
const STEPS = [
  {
    n: "01",
    title: "Login",
    body:
      "Sister Anne taps her face on the handset. OAuth + PKCE + MFA in one motion. The session is now her — not the device's.",
  },
  {
    n: "02",
    title: "System knows you",
    body:
      "HR pulls her role, her shift, her residents, her training status, her access privileges. The platform configures itself around her in under 800ms.",
  },
  {
    n: "03",
    title: "Pick your modules",
    body:
      "Your operator has selected Care Plans, Recording, Charts, Reports. Sister Anne sees only those — no clutter, no upsells, no unused buttons.",
  },
  {
    n: "04",
    title: "Care happens",
    body:
      "She taps the yellow record button. Speaks. Confirms. The note is filed, audited, and linked to the right care plan domain. She's back to caring in 14 seconds.",
    yellow: true,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-kapture-black py-20 text-white lg:py-28">
      <div
        aria-hidden
        className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-kapture-yellow/10 blur-3xl"
      />
      <div className="container-kapture relative">
        <div className="mb-14 max-w-2xl">
          <span className="chip-kapture mb-4 border-kapture-yellow bg-kapture-yellow font-mono text-[0.6875rem] tracking-widest text-kapture-black">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 font-display text-section-xl text-balance text-white">
            Login. Context. Tools. Care.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-kapture-fog md:text-lg">
            Four steps from a fresh install to a live service.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {STEPS.map((s) => (
            <Step key={s.n} {...s} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-kapture-ash pt-8 lg:mt-16 md:flex-row md:items-center">
          <div>
            <div className="mb-2 font-mono text-[0.6875rem] uppercase tracking-widest text-kapture-yellow">Setup</div>
            <h3 className="font-display text-2xl font-semibold">Most operators are live within 7 days.</h3>
            <p className="mt-1 max-w-xl text-sm text-kapture-mist">
              We migrate from your incumbent system, set up roles, train staff in person, and stand by for
              the first inspection.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/contact" className="btn-kapture bg-kapture-yellow text-kapture-black hover:bg-kapture-amber">
              Book setup call
            </Link>
            <Link href="/demo" className="btn-kapture border border-white text-white hover:bg-white hover:text-kapture-black">
              See live demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

type StepProps = (typeof STEPS)[number] & { yellow?: boolean };
function Step({ n, title, body, yellow }: StepProps) {
  if (yellow) {
    return (
      <div className="rounded-2xl bg-kapture-yellow p-6 text-kapture-black ring-1 ring-kapture-yellow">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kapture-black font-mono text-sm font-semibold text-kapture-yellow">
          {n}
        </div>
        <h3 className="mb-2 mt-5 font-display text-xl font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-kapture-coal">{body}</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-kapture-ash bg-kapture-coal p-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kapture-yellow font-mono text-sm font-semibold text-kapture-black">
        {n}
      </div>
      <h3 className="mb-2 mt-5 font-display text-xl font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-kapture-mist">{body}</p>
    </div>
  );
}
