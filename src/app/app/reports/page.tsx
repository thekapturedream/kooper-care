/**
 * Reports (Phase C proof) — `/app/reports`.
 *
 * Mirrors /Kaptire Website Templates/kooper-reports.html. Audience tabs
 * over a tile grid, each tile sourced from a kooper · X app.
 *
 * The featured CQC SAF readiness card is the inspector entry point —
 * it renders the five quality-statement scores at a glance with deeper
 * drill-throughs.
 *
 * In production:
 *   · The tile grid is filtered by the audience tab + a `saved_views`
 *     row keyed to the user's role.
 *   · The AI search field is wired to a streaming server action that
 *     plans + queries the Care Graph and returns either a one-off chart
 *     or a save-as-tile recipe.
 */
import { AudienceTabs } from "@/components/reports/AudienceTabs";
import { ReportTile } from "@/components/reports/ReportTile";

export default function ReportsPage() {
  return (
    <main>
      {/* Hero strip */}
      <section className="bg-black text-white">
        <div className="container-kapture py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#FFD400] mb-3 inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-[2px] w-[18px] bg-[#FFD400]" />
                REPORTS HUB
              </div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] mb-3">
                The destination of every recorded event.
              </h1>
              <p className="font-serif italic text-base lg:text-lg text-white/75 max-w-2xl leading-relaxed">
                Reports built for the audience asking the question. CQC inspectors get an inspector pack. Managers get an operations panel. Clinicians get the early-warning view. Families get a daily summary in plain English.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[#9A9A9A]">Window</div>
                  <span className="text-xs text-white/70">28 Apr → 6 May</span>
                </div>
                <div className="font-mono text-sm">9 days</div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#2A2A2A] text-xs">
                  <div><div className="text-white/50">Events</div><div className="font-mono font-semibold text-base">847</div></div>
                  <div><div className="text-white/50">Alerts</div><div className="font-mono font-semibold text-base">12</div></div>
                  <div><div className="text-white/50">Residents</div><div className="font-mono font-semibold text-base">28</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience tabs */}
      <section className="bg-[#F5F5F5] border-b border-[#D4D4D4] py-5">
        <div className="container-kapture">
          <AudienceTabs />
        </div>
      </section>

      {/* Tile grid */}
      <section className="container-kapture py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReportTile
            featured
            kicker="CQC SAF readiness"
            source="⊕ all apps"
            stat="99%"
            subtitle="All five quality statements green or close. Inspector-ready."
            spark={[88, 90, 92, 95, 97, 98, 99]}
            className="md:col-span-2 lg:col-span-2 lg:row-span-2"
          />
          <ReportTile
            kicker="Safe"
            source="⊕ recording · risk"
            stat="3"
            subtitle="falls in 30 days · 1 incident · 2 near miss"
            spark={[18, 22, 14, 30, 22, 18, 42]}
            sparkTone="yellow"
          />
          <ReportTile
            kicker="Effective"
            source="⊕ mar"
            stat="4"
            subtitle="medication refusals · MAR exceptions logged"
            spark={[30, 0, 50, 20, 40, 60, 20]}
          />
          <ReportTile
            kicker="Caring"
            source="⊕ recording · personal care"
            stat="100%"
            subtitle="personal-care episodes carry a dignity tap"
            spark={[96, 100, 100, 100, 100, 100, 100]}
            sparkTone="green"
          />
          <ReportTile
            kicker="Effective"
            source="⊕ care plans"
            stat="94%"
            subtitle="events match the care plan · 6% deviated, all logged"
            spark={[88, 90, 92, 91, 93, 96, 94]}
          />
          <ReportTile
            kicker="Responsive"
            source="⊕ vitals · clinical"
            stat="2"
            subtitle="residents above NEWS2 score 3 right now"
          />
          <ReportTile
            kicker="Well-led"
            source="⊕ care plans"
            stat="7"
            subtitle="care plan reviews due this fortnight"
          />
          <ReportTile
            kicker="Caring · Family"
            source="⊕ family"
            stat="87%"
            subtitle="family daily summaries opened in 24h"
            spark={[75, 78, 81, 84, 86, 85, 87]}
            sparkTone="green"
          />
          <ReportTile
            kicker="Well-led"
            source="⊕ hr"
            stat="96%"
            subtitle="mandatory training current across the team"
          />
        </div>
      </section>
    </main>
  );
}
