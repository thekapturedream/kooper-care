import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/rbac";
import { KaptureSun } from "@/components/KaptureSun";

/**
 * Authenticated app routes are never statically generated — every render
 * needs the live session cookie. force-dynamic cascades to every nested
 * page so /app, /app/care-plans, /app/clinical, etc. all opt out of
 * prerender automatically.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * /app/* layout.
 *
 * Every nested page renders inside this server component. We resolve the
 * full session here once — the result is cached for the rest of the request,
 * so child components can call getCurrentSession() again at zero extra cost.
 *
 * If the session resolves but the worker has no community roles, we drop
 * them on a "no-access" sub-page rather than the full app shell.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();

  if (!session.signedIn) {
    redirect("/sign-in");
  }

  if (!session.worker || session.communities.length === 0) {
    return (
      <div className="container-kapture py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-kapture-fog bg-white p-8 text-center dark:border-kapture-ash dark:bg-kapture-coal">
          <h1 className="font-display text-2xl font-semibold">Almost there.</h1>
          <p className="mt-2 text-sm text-kapture-smoke dark:text-kapture-fog">
            Your account is authenticated but no community has been assigned to you yet. Ask your operator
            to add you to their Kapture Care workspace, or contact us if you think this is a mistake.
          </p>
          <Link href="/contact" className="btn-kapture mt-6 bg-kapture-black text-white hover:bg-transparent hover:text-kapture-black hover:ring-2 hover:ring-inset hover:ring-kapture-black">
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  const active = session.activeCommunity!;
  const roleLabel = ROLE_LABELS[active.role];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* App-context strip — sits below the marketing nav. Shows worker, role,
          active community, and module chips. Confirms the HR-spine read at a
          glance. */}
      <div className="border-b border-kapture-fog bg-kapture-paper dark:border-kapture-ash dark:bg-kapture-ink">
        <div className="container-kapture flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <KaptureSun size={20} className="text-kapture-black dark:text-kapture-white" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-kapture-black dark:text-kapture-white">
                {session.worker.preferred_name}
              </span>
              <span className="chip-kapture text-[0.6875rem]">{roleLabel}</span>
              <span className="text-kapture-mist">·</span>
              <span className="text-kapture-smoke dark:text-kapture-fog">{active.community_name}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {active.modules.map((m) => (
              <span key={m} className="chip-kapture text-[0.6875rem] font-mono">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-kapture py-8">{children}</div>
    </div>
  );
}
