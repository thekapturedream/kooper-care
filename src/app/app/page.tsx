import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, FileText, Mic, TrendingUp, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getCurrentSession, isManagerOrAbove } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/rbac";
import { PersonaDashboard } from "@/components/dashboards/PersonaDashboard";

// Belt-and-braces with the layout — never prerender authed pages.
export const dynamic = "force-dynamic";

/**
 * /app
 *
 * The post-login landing — the "system knows you" payoff. Greets the worker
 * by name, surfaces their active role + community, and renders a persona-
 * specific dashboard above the shared module grid.
 *
 * Phase D: persona-aware. The PersonaDashboard branches off the worker's
 * role and renders the right card stack — owner sees multi-site exec view,
 * nurse sees clinical priorities, carer sees the recording shortcut, etc.
 *
 * The shared "Your stack" grid sits underneath so every persona has fast
 * access to the broader ecosystem.
 */
export default async function AppHomePage() {
  const session = await getCurrentSession();

  // Layout already redirects unauthenticated visitors to /sign-in and shows
  // the "no community" page when the worker has zero roles, but TypeScript
  // doesn't know that, so we narrow defensively here too.
  if (!session.signedIn || !session.worker || !session.activeCommunity) {
    redirect("/sign-in");
  }

  const worker = session.worker;
  const active = session.activeCommunity;
  const greeting = greetingForHour(new Date().getHours());

  const showManagerOnly = isManagerOrAbove(session);

  return (
    <div className="space-y-10">
      {/* HEADLINE */}
      <header>
        <span className="chip-kapture mb-3 border-status-ok/30 bg-status-ok/10 text-emerald-700 font-mono text-[0.6875rem] tracking-widest">
          <CheckCircle2 size={11} strokeWidth={2.5} /> SESSION RESOLVED · {ROLE_LABELS[active.role]}
        </span>
        <h1 className="font-display text-section-xl tracking-tight text-kapture-black dark:text-kapture-white">
          {greeting}, {worker.preferred_name}.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-kapture-smoke dark:text-kapture-fog">
          You&apos;re signed in to {active.community_name} as a {ROLE_LABELS[active.role]}. Below is your dashboard, tuned to your role.
        </p>
      </header>

      {/* PERSONA DASHBOARD — branches off active.role */}
      <PersonaDashboard worker={worker} community={active} />

      {/* MODULES THIS COMMUNITY HAS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-kapture-black dark:text-kapture-white">
            Your stack
          </h2>
          <span className="text-xs text-kapture-smoke dark:text-kapture-fog">
            <span className="font-mono">{active.modules.length}</span> modules active
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            id="hr"
            modules={active.modules}
            title="Kapture HR"
            note="Active · core"
            icon={<Users size={20} />}
            href="/app/hr"
            description="Workers, roles, training currency, RTW + DBS evidence."
          />
          <ModuleCard
            id="care-plans"
            modules={active.modules}
            title="Care Plans"
            note="Active"
            icon={<FileText size={20} />}
            href="/app/care-plans"
            description="62 clinical domains. Versioned. Diff-aware. Audit-ready."
          />
          <ModuleCard
            id="recording"
            modules={active.modules}
            title="Recording"
            note="Active"
            icon={<Mic size={20} />}
            href="/app/notes"
            description="Voice-first care notes. AI-structured. Confirm in 14s."
          />
          <ModuleCard
            id="charts"
            modules={active.modules}
            title="Charts"
            note="Active"
            icon={<TrendingUp size={20} />}
            href="/app/charts"
            description="22 clinical charts: NEWS2, MAR, SSKIN, Pain, and more."
          />
          <ModuleCard
            id="reports"
            modules={active.modules}
            title="Reports"
            note="Active"
            icon={<Clock size={20} />}
            href="/app/reports"
            description="CQC pack, ops dashboards, family digests. Every export audited."
          />
          <ModuleCard
            id="compliance"
            modules={active.modules}
            title="Compliance"
            note="Inactive · upgrade"
            icon={<ShieldCheck size={20} />}
            href="/app/compliance"
            description="DSPT pack, GDPR toolkit, audit-log viewer, DoLS automation."
            inactive
          />
        </div>
      </section>

      {/* MANAGER QUICK LINKS */}
      {showManagerOnly && (
        <section className="rounded-2xl bg-kapture-black p-7 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="max-w-lg">
              <span className="chip-kapture mb-3 border-kapture-yellow bg-kapture-yellow text-[0.6875rem] tracking-widest text-kapture-black font-mono">
                MANAGER VIEW
              </span>
              <h3 className="font-display text-2xl font-semibold mt-1">{active.community_name} this week</h3>
              <p className="mt-2 text-sm text-kapture-fog">
                Headline operations metrics. Drill in for incident lists, audit trails, training currency, and
                staff utilisation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/app/hr/team" className="btn-kapture bg-kapture-yellow text-kapture-black hover:bg-kapture-amber">
                Workforce
              </Link>
              <Link href="/app/audit" className="btn-kapture border border-white text-white hover:bg-white hover:text-kapture-black">
                Audit log
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

type ModuleCardProps = {
  id: string;
  modules: string[];
  title: string;
  note: string;
  icon: React.ReactNode;
  href: string;
  description: string;
  inactive?: boolean;
};

function ModuleCard({ id, modules, title, note, icon, href, description, inactive }: ModuleCardProps) {
  const isActive = modules.includes(id) && !inactive;
  return (
    <Link
      href={isActive ? href : "/contact?topic=module-upgrade"}
      className={
        isActive
          ? "group rounded-2xl border border-kapture-fog bg-white p-6 transition-all hover:-translate-y-1 hover:border-kapture-black hover:shadow-lg dark:border-kapture-ash dark:bg-kapture-coal dark:hover:border-kapture-white"
          : "group rounded-2xl border border-kapture-fog/60 bg-kapture-paper p-6 opacity-70 transition-all hover:opacity-100 dark:border-kapture-ash dark:bg-kapture-ink"
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={
            isActive
              ? "flex h-10 w-10 items-center justify-center rounded-lg border border-kapture-fog bg-kapture-paper text-kapture-black dark:border-kapture-ash dark:bg-kapture-ink dark:text-kapture-white"
              : "flex h-10 w-10 items-center justify-center rounded-lg border border-kapture-fog bg-white text-kapture-mist dark:border-kapture-ash dark:bg-kapture-coal"
          }
        >
          {icon}
        </div>
        <span
          className={
            isActive
              ? "chip-kapture text-[0.6875rem] border-status-ok/30 bg-status-ok/10 text-emerald-700"
              : "chip-kapture text-[0.6875rem]"
          }
        >
          {note}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-kapture-black dark:text-kapture-white">{title}</h3>
      <p className="mt-1 text-sm text-kapture-smoke dark:text-kapture-fog">{description}</p>
      <div className="mt-3 text-xs font-medium text-kapture-mist group-hover:text-kapture-black dark:group-hover:text-kapture-white">
        {isActive ? "Open →" : "Upgrade →"}
      </div>
    </Link>
  );
}

function greetingForHour(h: number) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
