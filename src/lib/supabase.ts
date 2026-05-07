import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Browser-safe client (uses anon key + RLS).
 * Returns null if env vars are missing — callers should fall back gracefully so
 * the marketing site still builds and renders without a Supabase project.
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Server-only client with service role. Bypasses RLS — never expose to the browser.
 * Used inside /api/lead route to insert leads.
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Lead = {
  id?: string;
  type: "quote" | "contact" | "newsletter" | "partner";
  name?: string | null;
  email: string;
  phone?: string | null;
  company?: string | null;
  origin?: string | null;
  destination?: string | null;
  cargo_type?: string | null;
  weight_kg?: number | null;
  message?: string | null;
  source?: string | null;
  created_at?: string;
};
