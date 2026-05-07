"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "magic" | "password";

/**
 * The actual sign-in form. Defaults to magic-link auth (no password to forget,
 * no password to leak) with an opt-in password mode for the rare environment
 * where email isn't reachable from the handset (closed Wi-Fi, etc.).
 *
 * Both flows route through Supabase Auth. RLS does the rest.
 */
export function SignInCard() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("magic");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ kind: "info" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setBusy(true);

    const supa = getBrowserClient();
    if (!supa) {
      setBusy(false);
      setMessage({
        kind: "error",
        text: "Auth not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      });
      return;
    }

    try {
      if (mode === "magic") {
        const { error } = await supa.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage({ kind: "info", text: `Check ${email} for a sign-in link. It expires in 60 minutes.` });
      } else {
        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/app");
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ kind: "error", text: err?.message ?? "Sign-in failed. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-kapture-fog bg-white p-7 shadow-xl dark:border-kapture-ash dark:bg-kapture-coal">
      <div className="mb-6 flex items-center gap-2">
        <span className="chip-kapture border-kapture-yellow bg-kapture-yellow font-mono text-[0.6875rem] tracking-widest text-kapture-black">
          STEP 1 · SIGN IN
        </span>
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-kapture-black dark:text-kapture-white">
        Welcome back.
      </h2>
      <p className="mt-1 text-sm text-kapture-smoke dark:text-kapture-fog">
        Use the email your operator registered with us.
      </p>

      <div className="mt-6 flex gap-1 rounded-full bg-kapture-paper p-1 dark:bg-kapture-ink">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "magic"
              ? "bg-kapture-black text-white dark:bg-kapture-white dark:text-kapture-black"
              : "text-kapture-smoke hover:text-kapture-black dark:text-kapture-fog dark:hover:text-kapture-white",
          )}
        >
          <Mail size={13} /> Magic link
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "password"
              ? "bg-kapture-black text-white dark:bg-kapture-white dark:text-kapture-black"
              : "text-kapture-smoke hover:text-kapture-black dark:text-kapture-fog dark:hover:text-kapture-white",
          )}
        >
          <KeyRound size={13} /> Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-kapture-mist">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="anne@your-care-home.co.uk"
            className="field h-12 text-base"
          />
        </label>

        {mode === "password" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-kapture-mist">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field h-12 text-base"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-kapture h-12 w-full !min-h-0 bg-kapture-black text-white hover:bg-transparent hover:text-kapture-black hover:ring-2 hover:ring-inset hover:ring-kapture-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-kapture-yellow dark:text-kapture-black dark:hover:bg-kapture-amber"
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Working…
            </>
          ) : (
            <>
              {mode === "magic" ? "Send sign-in link" : "Sign in"}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {message && (
        <div
          className={cn(
            "mt-4 rounded-lg border px-4 py-3 text-sm",
            message.kind === "info"
              ? "border-status-ok/30 bg-status-ok/10 text-emerald-700"
              : "border-status-critical/30 bg-status-critical/10 text-rose-700",
          )}
        >
          {message.text}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-kapture-fog bg-kapture-paper p-3 text-xs text-kapture-smoke dark:border-kapture-ash dark:bg-kapture-ink dark:text-kapture-fog">
        <ShieldCheck size={14} className="shrink-0 text-kapture-black dark:text-kapture-white" />
        <span>
          We use OAuth 2.0 with PKCE and never store your password in plain text. Sessions are bound to this
          device and audit-logged.
        </span>
      </div>
    </div>
  );
}
