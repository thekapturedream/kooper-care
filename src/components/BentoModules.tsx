import Link from "next/link";
import {
  Users,
  FileText,
  Mic,
  TrendingUp,
  ClipboardList,
  Heart,
  Clock,
  ShieldCheck,
  Sparkles,
  Sun,
  Check,
} from "lucide-react";

/**
 * Bento grid of all 10 Kapture Care modules.
 *
 * HR is the locked-on spine — it gets a 2×2 cell as the focal point and is
 * styled in the dark/yellow brand DNA. The other 9 modules sit around it as
 * lighter add-on cards. The yellow Insights card breaks the grid colour pattern
 * to call out the in-box AI module — Kapture's wedge against PCS's IQ upsell.
 */

const ADDON_MODULES = [
  {
    n: 2,
    title: "Care Plans",
    icon: <FileText size={20} />,
    body:
      "62 clinical domains across Cognition, Psychological, Physical, Social, End-of-life. Versioned. Diff-aware. Audit-ready.",
    price: 1.2,
    note: "Standalone or +HR",
  },
  {
    n: 3,
    title: "Recording",
    icon: <Mic size={20} />,
    body:
      "Voice-first care notes. Carer speaks, AI structures, classifies, and links to care plan. Confirm in 14 seconds.",
    price: 0.8,
    note: "PWA · works offline",
  },
  {
    n: 4,
    title: "Charts",
    icon: <TrendingUp size={20} />,
    body:
      "22 clinical charts: NEWS2, MAR, SSKIN, Pain (PainChek), Fluid, Food, Repositioning, Behaviour ABC, and more.",
    price: 0.6,
    note: "PainChek integrated",
  },
  {
    n: 5,
    title: "Reports",
    icon: <ClipboardList size={20} />,
    body:
      "Audience-curated. CQC inspector pack, ops dashboards, clinical lead views, family digests. Every export audited.",
    price: 0.5,
    note: "CQC SAF aligned",
  },
  {
    n: 6,
    title: "Family",
    icon: <Heart size={20} />,
    body:
      "PWA relatives gateway. Daily AI summary push, photos, video calls, care plan visibility (consented), peace of mind.",
    price: 0.4,
    note: "Installable on phone",
  },
  {
    n: 7,
    title: "Operations",
    icon: <Clock size={20} />,
    body:
      "Shift handover as a starter screen. Capacity planning, occupancy, mandatory care minutes, evacuation plans.",
    price: 0.5,
    note: "Multi-site ready",
  },
  {
    n: 8,
    title: "Compliance",
    icon: <ShieldCheck size={20} />,
    body:
      "DSPT submission pack, GDPR toolkit, audit log viewer, retention policy controls, DoLS automation.",
    price: 0.5,
    note: "DSPT auto-submit",
  },
  {
    n: 9,
    title: "Wellbeing",
    icon: <Heart size={20} />,
    body:
      "Activities planner, engagement tracking, mood/energy trends, family event calendar, life-story prompts.",
    price: 0.4,
    note: "Oomph-equivalent",
  },
] as const;

export function BentoModules() {
  return (
    <section
      id="modules"
      className="relative bg-kapture-paper py-20 dark:bg-kapture-ink lg:py-28"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="container-kapture">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="chip-kapture mb-4 border-kapture-yellow bg-kapture-yellow font-mono text-[0.6875rem] tracking-widest text-kapture-black">
              10 MODULES
            </span>
            <h2 className="mt-4 font-display text-section-xl text-balance text-kapture-black dark:text-kapture-white">
              One core. Nine extensions. Pick the stack you need.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-kapture-smoke dark:text-kapture-fog md:text-lg">
              HR is required and always on. Everything else is yours to add or skip.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip-kapture">Standalone</span>
            <span className="chip-kapture">Integrated</span>
            <span className="chip-kapture border-kapture-black bg-kapture-black text-kapture-white">Required</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <CoreCard />
          {ADDON_MODULES.map((m) => (
            <AddonCard key={m.n} {...m} />
          ))}
          <InsightsCard />
        </div>

        <p className="mt-8 max-w-2xl text-xs text-kapture-smoke dark:text-kapture-fog">
          All prices indicative. Volume discounts above 100 residents. NHS-block contracts on application.
          White-label available for resellers.
        </p>
      </div>
    </section>
  );
}

function CoreCard() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-kapture-black bg-kapture-black p-7 text-white md:col-span-2 lg:row-span-2">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kapture-yellow text-kapture-black">
            <Users size={26} />
          </div>
          <span className="chip-kapture border-kapture-yellow bg-kapture-yellow text-[0.6875rem] text-kapture-black">
            CORE · REQUIRED
          </span>
        </div>
        <div className="mb-2 font-mono text-[0.6875rem] uppercase tracking-widest text-kapture-yellow">
          Module 01
        </div>
        <h3 className="mb-3 font-display text-3xl font-semibold tracking-tight lg:text-4xl">Kapture HR</h3>
        <p className="mb-5 max-w-md text-kapture-fog leading-relaxed">
          The spine. Every login pulls user role, shift, residents in scope, training status, access
          privileges, and routes the entire experience.
        </p>
        <ul className="space-y-2 text-sm text-kapture-fog">
          {[
            "Staff records, contracts, right-to-work, DBS",
            "Role-based access at the field level",
            "Mandatory training tracker, evidence stored",
            "Rota, timesheets, payroll-ready exports",
            "OAuth + PKCE, MFA, single sign-on ready",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check size={14} strokeWidth={2.5} className="text-kapture-yellow" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-kapture-ash pt-5">
        <div className="text-xs text-kapture-mist">
          From <span className="font-mono text-base font-semibold text-kapture-yellow">£2.40</span> /
          resident / month
        </div>
        <Link href="/modules/hr" className="text-sm font-medium text-kapture-yellow hover:underline">
          Explore Kapture HR →
        </Link>
      </div>
    </div>
  );
}

type AddonProps = (typeof ADDON_MODULES)[number];

function AddonCard({ n, title, icon, body, price, note }: AddonProps) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-kapture-fog bg-white p-6 transition-all hover:-translate-y-1 hover:border-kapture-black hover:shadow-lg dark:border-kapture-ash dark:bg-kapture-coal dark:hover:border-kapture-white">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-kapture-fog bg-kapture-paper text-kapture-black dark:border-kapture-ash dark:bg-kapture-ink dark:text-kapture-white">
        {icon}
      </div>
      <div className="mb-1 font-mono text-[0.6875rem] uppercase tracking-widest text-kapture-mist">
        Module {String(n).padStart(2, "0")}
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold text-kapture-black dark:text-kapture-white">{title}</h3>
      <p className="mb-3 text-sm leading-relaxed text-kapture-smoke dark:text-kapture-fog">{body}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="chip-kapture text-[0.6875rem]">Add £{price.toFixed(2)} / resident</span>
        <span className="text-kapture-mist">{note}</span>
      </div>
    </div>
  );
}

function InsightsCard() {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-kapture-yellow bg-kapture-yellow p-6 text-kapture-black transition-all hover:-translate-y-1 hover:bg-kapture-amber">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-kapture-black text-kapture-yellow">
          <Sparkles size={20} />
        </div>
        <span className="chip-kapture border-kapture-black bg-kapture-black text-[0.6875rem] text-kapture-white">AI</span>
      </div>
      <div className="mb-1 font-mono text-[0.6875rem] uppercase tracking-widest text-kapture-coal">Module 10</div>
      <h3 className="mb-2 font-display text-lg font-semibold">Insights</h3>
      <p className="mb-3 text-sm leading-relaxed text-kapture-coal">
        Anomaly detection, predictive risk, trend surfacing, weekly AI digests for managers and families.
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="chip-kapture border-kapture-black bg-kapture-black text-[0.6875rem] text-kapture-white">
          Add £0.80 / resident
        </span>
        <span className="font-medium text-kapture-coal">In-box. No upsell.</span>
      </div>
    </div>
  );
}
