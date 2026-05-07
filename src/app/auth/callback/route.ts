/**
 * /auth/callback
 *
 * The magic-link / OAuth landing endpoint. Supabase redirects here with a
 * `code` query param after the user clicks the email link. We exchange the
 * code for a session, set it on the cookies, and redirect to /app.
 *
 * If anything goes wrong, fall back to /sign-in with an error param.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=missing-code`);
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return NextResponse.redirect(`${origin}/sign-in?error=auth-not-configured`);
  }

  const supa = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supa.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error?.message ?? "exchange-failed")}`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: data.session.expires_in,
  });
  response.cookies.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
