/**
 * Clinical (Phase B proof) — `/app/clinical`.
 *
 * Mirrors the clinical workspace from the standalone prototype at
 * /Kaptire Website Templates/kooper-clinical.html. Composes the
 * editorial primitives with the new clinical components (NEWS2,
 * EscalationLadder) for the central problem-detail editorial pane and
 * the right-hand operational rail.
 *
 * Hard-coded "Mixed anxiety & depressive disorder" focus for proof. The
 * tree, problem registry, and per-resident context come from Supabase
 * once Phase C migrations land.
 */
import {
  Article,
  Masthead,
  Kicker,
  Heading,
  Byline,
  Prose,
  StatPanel,
  SAFRow,
} from "@/components/editorial";
import { NEWS2 } from "@/components/clinical/NEWS2";
import { EscalationLadder } from "@/components/clinical/EscalationLadder";

export default function ClinicalPage() {
  return (
    <main className="container-kapture py-8">
      {/* Identity & comms-needs banner — pinned in production */}
      <header className="mb-6 rounded-[14px] bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-kapture-yellow text-black font-display font-bold flex items-center justify-center">EB</div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-semibold">Mr Edward Banda</h1>
              <span className="bg-white text-black rounded-full px-2.5 py-0.5 text-xs font-semibold">Eddie · he/him</span>
              <span className="border border-white/25 rounded-full px-2.5 py-0.5 text-[0.6875rem]">Age 78 · Room 12</span>
              <span className="border border-white/25 rounded-full px-2.5 py-0.5 text-[0.6875rem]">NHS 485 777 3456</span>
            </div>
            <div className="text-xs text-white/70 mt-1">English first language · large-print preferred · hearing aid (R) · MCA assessed 12 Mar 2026 · capacity fluctuating</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[rgba(255,212,0,0.2)] text-[#876300] border border-[rgba(255,212,0,0.5)] rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium">NEWS2 = 2 · low risk</span>
          <span className="border border-white/25 rounded-full px-2.5 py-0.5 text-[0.6875rem]">Plan v4 · current</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <article className="lg:col-span-8 space-y-6">
          <Article>
            <Masthead left="kooper · clinical" right="Major active problems · Vol. 4" />

            <Kicker tone="warn">Active · monitor</Kicker>
            <Heading
              title="Mixed anxiety & depressive disorder"
              deck="A long bereavement disorder, well held by medication, music, and the steady hand of Sister Anne. The team’s job is to keep it steady."
            />
            <Byline
              items={[
                { label: "SNOMED CT",     value: "231485007" },
                { label: "ICD-10",        value: "F41.2" },
                { label: "Since",         value: "Sep 2025" },
                { label: "Lead clinician", value: "Dr K. Adesina" },
              ]}
            />

            <Prose>
              <p className="no-indent">
                Eddie was diagnosed with mixed anxiety and depressive disorder
                in the months after Margaret died in 2019. The grief did the
                heavy lifting; the adjustment to Draycott on admission did the
                rest. Six years on, the picture is steady.
              </p>
              <p>
                Mood is mostly bright. There are brief low days around the
                September anniversary, which the team flags weeks in advance.
                The PHQ-9 has trended down over six months — eight to six —
                and the GAD-7 sits at five. Sertraline 50mg in the morning and
                mirtazapine 15mg at night are well tolerated. There is no
                suicidal ideation. Family contact, especially the daily call
                with his daughter Sarah, is protective.
              </p>
              <p>
                Risk to self is assessed low and stable. The link to the risk
                register is open and current.
              </p>
            </Prose>

            <StatPanel
              stats={[
                { label: "Severity",          value: "Mild",         foot: "PHQ-9 6 · GAD-7 5 · 28 Apr" },
                { label: "Active medication", value: "Sertraline 50", foot: "+ mirtazapine 15mg ON" },
                { label: "Talking therapy",   value: "Completed",    foot: "10 sessions, Sep 2025" },
                { label: "CMHT review",       value: "6-monthly",    foot: "next 12 Sep · Dr K. Adesina" },
              ]}
            />

            <SAFRow />
          </Article>

          <NEWS2
            score={2}
            cells={[
              { label: "Resp rate", value: "17",  unit: "/min",  band: "ok" },
              { label: "SpO₂",      value: "96%", unit: "on air", band: "ok" },
              { label: "Temp",      value: "37.6", unit: "°C",   band: "warn" },
              { label: "Sys BP",    value: "128", unit: "mmHg",  band: "ok" },
              { label: "Pulse",     value: "78",  unit: "bpm",   band: "ok" },
              { label: "AVPU",      value: "A",   unit: "alert", band: "ok" },
            ]}
          />
        </article>

        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-[14px] border border-[#D4D4D4] bg-white p-5 space-y-5">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider mb-2">Active medications</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center justify-between"><span>Sertraline 50mg</span><span className="font-mono text-xs text-[#6B7280]">OD</span></li>
                <li className="flex items-center justify-between"><span>Mirtazapine 15mg</span><span className="font-mono text-xs text-[#6B7280]">ON</span></li>
                <li className="flex items-center justify-between"><span>Apixaban 5mg</span><span className="font-mono text-xs text-[#6B7280]">BD</span></li>
                <li className="flex items-center justify-between"><span>Paracetamol 1g</span><span className="font-mono text-xs text-[#6B7280]">PRN · max 4/d</span></li>
              </ul>
            </div>

            <div className="border-t border-[#ECEAE3] pt-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider mb-2">Allergies</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] bg-[#FEE2E2] text-[#B42318] border border-[rgba(229,72,77,0.25)]">Penicillin · rash</span>
            </div>

            <div className="border-t border-[#ECEAE3] pt-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider mb-2">Escalate</h3>
              <EscalationLadder />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
