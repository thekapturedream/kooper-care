/**
 * PrivacyBoundary — visible RBAC for the family app.
 *
 * Two-card panel: what the family CAN see (consented daily life) vs
 * what stays with the clinical team (the full plan, MAR, MHA, risks).
 * Below it, four "request access" tiles for common asks. The custom
 * request opens a write to a `family_access_requests` table that the
 * registered manager triages.
 *
 * In production this whole component is gated by
 *   `family_resident_consent.care_plan_visible = false`
 * (default). Toggling that field at the field level changes the lists
 * here. Every request and response is audit-logged.
 */
"use client";

import { useState } from "react";

const VISIBLE = [
  "Daily AI summary, in plain English",
  "Photos, video calls, sing-alongs",
  "About Me — pronouns, foods, what cheers him",
  "Visit planner",
  "Mood at a glance (today)",
  "Anniversary flags · 14 Sep",
];
const PRIVATE = [
  "The full care plan (62 domains)",
  "Major active problems & SNOMED codes",
  "Medications & MAR",
  "MHA · DoLS · ECT",
  "Risk register & safeguarding",
  "NEWS2 & pathology",
];
const QUICK_REQUESTS = [
  { id: "falls",  title: "Falls history",     foot: "For my own peace of mind" },
  { id: "meds",   title: "Current medications", foot: "In case of emergency" },
  { id: "vitals", title: "Recent vitals",     foot: "Just to keep an eye" },
];

export function PrivacyBoundary() {
  const [pending, setPending] = useState<string | null>(null);

  const submit = (id: string) => {
    setPending(id);
    // In production: server action → family_access_requests row.
    window.setTimeout(() => setPending(null), 2000);
  };

  return (
    <section className="rounded-[18px] border border-[#ECEAE3] bg-white p-5 mb-5">
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <div className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#876300] mb-1 inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-[2px] w-[18px] bg-[#FFD400]" />
            PRIVACY
          </div>
          <h2 className="font-display font-semibold text-lg">What you see · what stays private</h2>
        </div>
        <span className="rounded-full bg-[#F5F5F5] border border-[#D4D4D4] px-2.5 py-0.5 text-[0.6875rem]">RBAC v1</span>
      </div>
      <p className="text-xs text-[#6B7280] mb-4">Dad consented to share daily life — not clinical detail. The team holds the medical view; you get the human one. You can ask for more, anytime.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#F5F5F5] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#10B981] text-white inline-flex items-center justify-center text-xs">✓</span>
            <div className="font-semibold text-sm">You can see</div>
          </div>
          <ul className="space-y-1.5 text-xs text-black">
            {VISIBLE.map((v) => (
              <li key={v} className="flex items-start gap-2"><span className="text-[#10B981]">·</span>{v}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-black text-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-white/10 inline-flex items-center justify-center" aria-hidden>🔒</span>
            <div className="font-semibold text-sm">Stays with the clinical team</div>
          </div>
          <ul className="space-y-1.5 text-xs text-white/85">
            {PRIVATE.map((p) => (
              <li key={p} className="flex items-start gap-2"><span className="text-[#FFD400]">·</span>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#ECEAE3]">
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-semibold text-sm">Want access to something here?</div>
          <span className="rounded-full bg-[#F5F5F5] border border-[#D4D4D4] px-2.5 py-0.5 text-[0.6875rem]">2 prior requests</span>
        </div>
        <p className="text-xs text-[#6B7280] mb-3">If something private would help you support Dad — like the falls history, or his current medication list — ask Sister Anne. She’ll say yes if she can, no if she can’t, and tell you why.</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_REQUESTS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => submit(r.id)}
              className={[
                "rounded-xl border border-[#ECEAE3] bg-[#F5F5F5] hover:bg-white p-2.5 text-left transition",
                pending === r.id ? "ring-2 ring-[#FFD400]" : "",
              ].join(" ")}
            >
              <div className="text-xs font-semibold">{r.title}</div>
              <div className="text-[0.6875rem] text-[#6B7280]">{pending === r.id ? "Sent — Sister Anne notified" : r.foot}</div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => submit("custom")}
            className="rounded-xl border border-dashed border-[#ECEAE3] hover:border-black p-2.5 text-left transition"
          >
            <div className="text-xs font-semibold">Ask for something else</div>
            <div className="text-[0.6875rem] text-[#6B7280]">Open request to the team</div>
          </button>
        </div>
        <p className="text-[0.6875rem] text-[#6B7280] mt-3 italic">Every request is logged with who asked, when, and how the team responded. Dad can see it too.</p>
      </div>
    </section>
  );
}
