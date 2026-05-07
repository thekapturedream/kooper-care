"use client";

/**
 * Browser-side Supabase client for Kapture Care.
 *
 * Used by client components for live subscriptions, voice-note uploads, and
 * any direct-from-browser Supabase calls that benefit from RLS.
 *
 * Persists the session in localStorage so the user stays signed in across
 * page loads. Magic-link callbacks land on /auth/callback and exchange the
 * URL token for a session that's then stored locally.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (!url || !anon) return null;
  if (cached) return cached;
  cached = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}
