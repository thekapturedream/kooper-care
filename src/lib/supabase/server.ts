/**
 * Server-side Supabase client for Kapture Care.
 *
 * Two flavours:
 *   getServerClient() — RLS-aware, uses the user's auth cookie. Use this from
 *                       server components, route handlers, and server actions
 *                       where you want the policy engine to enforce scope.
 *
 *   getServiceClient() — Service-role key, bypasses RLS. Use this ONLY for
 *                        trusted server actions where the calling code has
 *                        already verified the actor's authority. Never expose
 *                        service-role responses to the browser without
 *                        re-checking permissions in app code.
 *
 * Both helpers no-op when env vars are missing so the marketing site builds
 * cleanly during preview deploys without a Supabase project wired up.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server client carrying the calling user's auth cookie. Reads + writes are
 * subject to row-level security policies. Returns null when env vars aren't
 * set (e.g. during marketing-only preview deploys).
 */
export function getServerClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const cookieStore = cookies();
  /**
   * The `sb-access-token` cookie is set by the auth callback. We pass it in
   * the Authorization header so PostgREST resolves auth.uid() correctly.
   */
  const accessToken = cookieStore.get("sb-access-token")?.value;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  });
}

/**
 * Service-role client — RLS bypassed. NEVER ship the service-role key to the
 * browser, never use this in a route that doesn't first verify the actor.
 */
export function getServiceClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
