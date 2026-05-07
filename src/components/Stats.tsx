/**
 * Care market stats strip. Four big numbers — UK CQC providers, residents in
 * residential care, daily admin minutes Kapture saves, starting price.
 */
export function Stats() {
  return (
    <section className="border-y border-kapture-fog bg-white py-16 dark:border-kapture-ash dark:bg-kapture-black lg:py-20">
      <div className="container-kapture">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-10">
          <Stat n="14,500" label="UK care providers regulated by CQC" />
          <Stat n="410k" label="Older people in residential care today" />
          <Stat n="62" suffix="min" label="Average daily admin time we eliminate" />
          <Stat n="£2.40" label="Per resident, per month, starting price" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, suffix, label }: { n: string; suffix?: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl font-semibold tracking-tight text-kapture-black dark:text-kapture-white lg:text-5xl">
        <span className="font-mono">{n}</span>
        {suffix && <span className="ml-2 text-2xl text-kapture-smoke">{suffix}</span>}
      </div>
      <div className="mt-2 text-sm text-kapture-smoke dark:text-kapture-fog">{label}</div>
    </div>
  );
}
