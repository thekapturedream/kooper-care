/**
 * PersonaDashboard — server-rendered, role-branched dashboard.
 *
 * The post-login hub. Reads the worker's role and renders a dashboard
 * tuned to that role: owner sees multi-site exec view, nurse sees
 * NEWS2 + handover, carer sees the recording shortcut, etc.
 *
 * Each persona returns a small block of role-specific cards; the
 * outer hub layers a shared "Your stack" module grid below it so every
 * persona has fast access to the broader ecosystem.
 *
 * Composes existing primitives from @/components/editorial and small
 * inline cards. Per-persona depth grows with each Phase D iteration.
 */
import Link from "next/link";
import type { Role, Worker, WorkerCommunity } from "@/lib/auth";
import { Kicker } from "@/components/editorial";

export interface PersonaDashboardProps {
  worker: Worker;
  community: WorkerCommunity;
}

export function PersonaDashboard({ worker, community }: PersonaDashboardProps) {
  switch (community.role) {
    case "admin":
    case "owner":
      return <OwnerDashboard worker={worker} community={community} />;
    case "manager":
      return <ManagerDashboard worker={worker} community={community} />;
    case "clinical_lead":
      return <ClinicalLeadDashboard worker={worker} community={community} />;
    case "senior_carer":
      return <SeniorCarerDashboard worker={worker} community={community} />;
    case "nurse":
      return <NurseDashboard worker={worker} community={community} />;
    case "carer":
      return <CarerDashboard worker={worker} community={community} />;
    case "activities":
      return <ActivitiesDashboard worker={worker} community={community} />;
    case "cook":
      return <CookDashboard worker={worker} community={community} />;
    case "maintenance":
      return <MaintenanceDashboard worker={worker} community={community} />;
    case "resident":
      return <ResidentSignpost worker={worker} />;
    case "family":
      return <FamilySignpost worker={worker} />;
    case "inspector":
      return <InspectorDashboard worker={worker} community={community} />;
    default:
      return <NurseDashboard worker={worker} community={community} />;
  }
}

/* ---------- shared blocks ---------- */

function Card({ tone = "light", children, className = "" }: { tone?: "light" | "dark" | "yellow"; children: React.ReactNode; className?: string }) {
  const cls =
    tone === "dark"
      ? "bg-black text-white border-black"
      : tone === "yellow"
      ? "bg-[#FFD400] text-black border-[#FFD400]"
      : "bg-white text-black border-[#ECEAE3]";
  return <div className={["rounded-2xl border p-5", cls, className].join(" ")}>{children}</div>;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-[#ECEAE3] last:border-0">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className="font-mono font-semibold text-sm">{value}</span>
    </div>
  );
}

/* ---------- persona blocks ---------- */

function OwnerDashboard({ worker, community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card tone="dark" className="md:col-span-3">
        <Kicker tone="on-dark">Owner · multi-site executive</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">{community.community_name} group performance</h2>
        <p className="text-sm text-white/70 mt-1">Outcomes, occupancy, regulatory standing across every site you operate.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
          <Stat label="Communities" value="3" />
          <Stat label="Residents" value="84" />
          <Stat label="CQC SAF" value="99%" />
          <Stat label="Margin" value="18.4%" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Open incidents</h3>
        <div className="space-y-1.5">
          <StatRow label="High severity" value="0" />
          <StatRow label="Medium" value="2" />
          <StatRow label="Last 30 days" value="11 closed" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Workforce</h3>
        <div className="space-y-1.5">
          <StatRow label="On shift" value="14 / 14" />
          <StatRow label="Sickness today" value="1" />
          <StatRow label="Training current" value="96%" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Reports for the board</h3>
        <Link href="/app/reports" className="font-medium text-sm underline-offset-4 hover:underline">Open reports →</Link>
      </Card>
    </div>
  );
}

function ManagerDashboard({ worker, community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card tone="dark" className="lg:col-span-2">
        <Kicker tone="on-dark">Registered manager</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">{community.community_name} this morning</h2>
        <p className="text-sm text-white/70 mt-1">Live status of every shift, every resident, every flag.</p>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          <Stat label="Residents present" value="28 / 28" />
          <Stat label="Carers on shift" value="6" />
          <Stat label="Open alerts" value="2" />
        </div>
      </Card>
      <Card tone="yellow">
        <div className="font-mono text-xs uppercase tracking-[0.06em] text-black/70 mb-1">Action queue</div>
        <ul className="space-y-2 text-sm font-medium">
          <li>Sign off Incident #418 · Mr H</li>
          <li>2 care plan reviews due</li>
          <li>3 applicants for night carer</li>
        </ul>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Workforce on shift</h3>
        <div className="space-y-1.5">
          <StatRow label="Sister Anne · Nurse" value="07:00–19:00" />
          <StatRow label="Craig · Carer" value="07:00–15:00" />
          <StatRow label="Daniel · Activities" value="10:00–16:00" />
        </div>
        <Link href="/app/recording" className="text-xs font-medium text-black underline-offset-4 hover:underline mt-3 inline-block">Open recording →</Link>
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="font-display font-semibold mb-2">Today's escalations</h3>
        <div className="space-y-1.5">
          <StatRow label="Mrs Cross · NEWS2 5" value="Sister Anne · 5m" />
          <StatRow label="Edward Banda · review due 17 May" value="Pencilled" />
        </div>
        <Link href="/app/clinical" className="text-xs font-medium text-black underline-offset-4 hover:underline mt-3 inline-block">Open clinical →</Link>
      </Card>
    </div>
  );
}

function ClinicalLeadDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card tone="dark" className="md:col-span-2">
        <Kicker tone="on-dark">Clinical lead</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">Cross-resident clinical view</h2>
        <p className="text-sm text-white/70 mt-1">Major active problems, NEWS2 outliers, MHA / DoLS expiry, pathology returns.</p>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">NEWS2 outliers</h3>
        <div className="space-y-1.5">
          <StatRow label="Mrs Cross" value="5 · paged" />
          <StatRow label="Mr Banda" value="2 · stable" />
          <StatRow label="Mr Rossi" value="1 · stable" />
        </div>
        <Link href="/app/clinical" className="text-xs font-medium underline-offset-4 hover:underline mt-3 inline-block">Open clinical →</Link>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">MHA · DoLS · ECT</h3>
        <div className="space-y-1.5">
          <StatRow label="DoLS renewals due" value="2 (5d, 14d)" />
          <StatRow label="S117 plans" value="3 active" />
          <StatRow label="ECT records" value="0" />
        </div>
      </Card>
    </div>
  );
}

function SeniorCarerDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card tone="dark" className="md:col-span-2">
        <Kicker tone="on-dark">Senior carer · floor lead</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">Round assignments</h2>
        <p className="text-sm text-white/70 mt-1">Who's with whom, what's overdue, what needs a hand.</p>
      </Card>
      <Card tone="yellow">
        <div className="font-mono text-xs uppercase tracking-[0.06em] text-black/70 mb-1">Now</div>
        <div className="font-display font-semibold">Morning round · 4 of 6 done</div>
        <Link href="/app/recording" className="text-xs font-medium text-black underline-offset-4 hover:underline mt-2 inline-block">Open recording →</Link>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Behind the round</h3>
        <div className="space-y-1.5">
          <StatRow label="Mrs Cross · personal care" value="Pending" />
          <StatRow label="Mr Banda · breakfast" value="In progress" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Continence + skin checks</h3>
        <div className="space-y-1.5">
          <StatRow label="Due in next hour" value="3" />
          <StatRow label="Skin issues today" value="1" />
        </div>
      </Card>
    </div>
  );
}

function NurseDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card tone="dark" className="md:col-span-2">
        <Kicker tone="on-dark">Nurse on shift</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">Clinical priorities right now</h2>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          <Stat label="NEWS2 ≥ 3" value="2" />
          <Stat label="MAR exceptions" value="0" />
          <Stat label="Wounds open" value="2" />
        </div>
      </Card>
      <Card tone="yellow">
        <div className="font-mono text-xs uppercase tracking-[0.06em] text-black/70 mb-1">Open clinical</div>
        <div className="font-display font-semibold mb-2">Mrs Cross · NEWS2 5</div>
        <Link href="/app/clinical" className="text-xs font-semibold underline-offset-4 underline">Open clinical →</Link>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Care plan reviews</h3>
        <div className="space-y-1.5">
          <StatRow label="Due this week" value="3" />
          <StatRow label="Overdue" value="1" />
        </div>
        <Link href="/app/care-plans" className="text-xs font-medium text-black underline-offset-4 hover:underline mt-3 inline-block">Open care plans →</Link>
      </Card>
      <Card className="md:col-span-2">
        <h3 className="font-display font-semibold mb-2">Drug round</h3>
        <div className="space-y-1.5">
          <StatRow label="Morning round" value="22 of 22 ✓" />
          <StatRow label="Lunch round" value="12:00 · 18 due" />
          <StatRow label="Controlled drugs" value="2 · witness needed" />
        </div>
      </Card>
    </div>
  );
}

function CarerDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card tone="yellow" className="md:col-span-2">
        <div className="font-mono text-xs uppercase tracking-[0.06em] text-black/70 mb-1">Tap to record</div>
        <div className="font-display text-2xl font-semibold mb-1">3 taps. The note writes itself.</div>
        <Link href="/app/recording" className="text-sm font-semibold underline-offset-4 underline">Open recording →</Link>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Your residents this shift</h3>
        <div className="space-y-1.5">
          <StatRow label="Mr Banda" value="07:42 ✓" />
          <StatRow label="Mrs Cross" value="Due 09:15" />
          <StatRow label="Mr Rossi" value="Due 10:00" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Handover from Sister Anne</h3>
        <p className="text-sm text-[#1A1A1A] font-serif italic">"Mrs Cross was warm overnight — please recheck temp at 09:00. Mr Banda asked for music in the lounge."</p>
      </Card>
    </div>
  );
}

function ActivitiesDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card tone="dark" className="md:col-span-2">
        <Kicker tone="on-dark">Activities coordinator</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">Today's programme</h2>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Sessions today</h3>
        <div className="space-y-1.5">
          <StatRow label="10:30 · Reading group" value="6 booked" />
          <StatRow label="14:30 · Sing-along" value="11 booked" />
          <StatRow label="16:00 · Garden walk" value="4 booked" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Birthdays this week</h3>
        <div className="space-y-1.5">
          <StatRow label="Mr Rossi" value="Thu · 84" />
          <StatRow label="Mrs Pope" value="Sat · 91" />
        </div>
      </Card>
    </div>
  );
}

function CookDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card tone="dark" className="md:col-span-2">
        <Kicker tone="on-dark">Kitchen lead</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">Today's covers</h2>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Modified diets</h3>
        <div className="space-y-1.5">
          <StatRow label="Soft / IDDSI 6" value="4" />
          <StatRow label="Diabetic" value="3" />
          <StatRow label="Halal / kosher" value="1 / 0" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Allergies on file</h3>
        <div className="space-y-1.5">
          <StatRow label="Nuts" value="2" />
          <StatRow label="Shellfish" value="1" />
          <StatRow label="Gluten" value="1" />
        </div>
      </Card>
    </div>
  );
}

function MaintenanceDashboard({ community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card tone="dark" className="md:col-span-2">
        <Kicker tone="on-dark">Maintenance · estate</Kicker>
        <h2 className="font-display text-2xl font-semibold mt-2">Open tickets</h2>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Open tickets</h3>
        <div className="space-y-1.5">
          <StatRow label="Room 14 · radiator" value="High" />
          <StatRow label="Lounge · light flicker" value="Medium" />
          <StatRow label="Garden · shed roof" value="Low" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Compliance checks due</h3>
        <div className="space-y-1.5">
          <StatRow label="PAT testing" value="3 days" />
          <StatRow label="Fire alarm" value="11 days" />
        </div>
      </Card>
    </div>
  );
}

function ResidentSignpost({ worker }: { worker: Worker }) {
  return (
    <Card tone="yellow" className="lg:col-span-3">
      <Kicker>Welcome back, {worker.preferred_name}</Kicker>
      <h2 className="font-display text-2xl font-semibold mt-2">Open your home page</h2>
      <p className="text-sm text-black/80 mt-1 mb-4 max-w-md">Mood, what's on today, your family. Big buttons, no clutter.</p>
      <Link href="/app/resident" className="inline-flex items-center gap-1 bg-black text-white rounded-[10px] px-3 py-1.5 text-sm font-semibold">Open resident app →</Link>
    </Card>
  );
}

function FamilySignpost({ worker }: { worker: Worker }) {
  return (
    <Card tone="dark" className="lg:col-span-3">
      <Kicker tone="on-dark">For family · {worker.preferred_name}</Kicker>
      <h2 className="font-display text-2xl font-semibold mt-2">Daily summary, photos, calls</h2>
      <p className="text-sm text-white/75 mt-1 mb-4 max-w-md">The care plan stays private. You see the bits Dad asked us to share.</p>
      <Link href="/app/family" className="inline-flex items-center gap-1 bg-[#FFD400] text-black rounded-[10px] px-3 py-1.5 text-sm font-semibold">Open family app →</Link>
    </Card>
  );
}

function InspectorDashboard({ worker, community }: PersonaDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card tone="yellow" className="lg:col-span-3">
        <div className="font-mono text-xs uppercase tracking-[0.06em] text-black/70 mb-1">Time-bound access · 11 days remaining</div>
        <div className="font-display text-xl font-semibold">Read-only · audit pack only · every action logged</div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">SAF readiness</h3>
        <div className="space-y-1.5">
          <StatRow label="Safe" value="98%" />
          <StatRow label="Effective" value="100%" />
          <StatRow label="Caring" value="100%" />
          <StatRow label="Responsive" value="96%" />
          <StatRow label="Well-led" value="100%" />
        </div>
        <Link href="/app/reports" className="text-xs font-medium underline-offset-4 hover:underline mt-3 inline-block">Open reports →</Link>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Audit log</h3>
        <div className="space-y-1.5">
          <StatRow label="Events 30d" value="847" />
          <StatRow label="Edits" value="64" />
          <StatRow label="Deletions" value="0" />
        </div>
      </Card>
      <Card>
        <h3 className="font-display font-semibold mb-2">Recent inspections</h3>
        <div className="space-y-1.5">
          <StatRow label="Last CQC visit" value="Mar 2024" />
          <StatRow label="Outcome" value="Good" />
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-white/60">{label}</div>
      <div className="font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
