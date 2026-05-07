/**
 * Auth + worker-context resolution for Kapture Care.
 *
 * One call — `getCurrentSession()` — returns everything an HR-spine session
 * needs:
 *   · The Supabase session (or null if signed out)
 *   · The matching worker record
 *   · Every community the worker has an active role in
 *   · The role they hold in each
 *   · A typed boolean helper for permission checks
 *
 * Server-only. Designed to be called from the layout, server components, and
 * server actions. The returned object is small enough to pass through props
 * without duplication.
 */
import { cache } from "react";
import { getServerClient } from "@/lib/supabase/server";

export type Role =
  | "admin"
  | "owner"
  | "manager"
  | "clinical_lead"
  | "senior_carer"
  | "nurse"
  | "carer"
  | "activities"
  | "cook"
  | "maintenance"
  | "resident"
  | "family"
  | "inspector";

export type Worker = {
  id: string;
  auth_user_id: string;
  preferred_name: string;
  legal_name: string | null;
  email: string;
  photo_url: string | null;
  rtw_verified: boolean;
  active: boolean;
};

export type WorkerCommunity = {
  community_id: string;
  community_name: string;
  community_slug: string;
  service_type: string;
  modules: string[];
  role: Role;
};

export type CareSession = {
  signedIn: boolean;
  authUserId: string | null;
  worker: Worker | null;
  communities: WorkerCommunity[];
  /** The community currently in scope. First active community by default. */
  activeCommunity: WorkerCommunity | null;
};

/**
 * Resolve the current session. Cached per-request so repeated calls inside
 * one render are free.
 */
export const getCurrentSession = cache(async (): Promise<CareSession> => {
  const empty: CareSession = {
    signedIn: false,
    authUserId: null,
    worker: null,
    communities: [],
    activeCommunity: null,
  };

  const supa = getServerClient();
  if (!supa) return empty;

  const { data: authUser } = await supa.auth.getUser();
  if (!authUser?.user) return empty;
  const authUserId = authUser.user.id;

  const { data: worker } = await supa
    .from("workers")
    .select("id, auth_user_id, preferred_name, legal_name, email, photo_url, rtw_verified, active")
    .eq("auth_user_id", authUserId)
    .single();

  if (!worker) {
    // Authed but not yet a worker — onboarding state. Return signed-in but
    // empty communities. The /sign-in page will redirect appropriately.
    return { ...empty, signedIn: true, authUserId };
  }

  const { data: roleRows } = await supa
    .from("worker_roles")
    .select(
      `
      role,
      community:communities (
        id, name, slug, service_type, modules
      )
      `,
    )
    .eq("worker_id", worker.id)
    .eq("active", true);

  const communities: WorkerCommunity[] = (roleRows ?? [])
    .filter((r: any) => r.community)
    .map((r: any) => ({
      community_id: r.community.id,
      community_name: r.community.name,
      community_slug: r.community.slug,
      service_type: r.community.service_type,
      modules: r.community.modules ?? [],
      role: r.role as Role,
    }));

  return {
    signedIn: true,
    authUserId,
    worker,
    communities,
    activeCommunity: communities[0] ?? null,
  };
});

/**
 * Permission helpers — read the most senior role across all communities,
 * or check membership of a specific role set.
 */
export function hasAnyRole(session: CareSession, roles: Role[]): boolean {
  return session.communities.some((c) => roles.includes(c.role));
}

export function isManagerOrAbove(session: CareSession): boolean {
  return hasAnyRole(session, ["admin", "owner", "manager"]);
}
