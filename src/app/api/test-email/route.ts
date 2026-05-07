import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Email pipeline diagnostic.
 *
 *   GET  /api/test-email          → reports env var status + attempts send
 *   GET  /api/test-email?dry=1    → reports env var status only (no send)
 *
 * Returns JSON with everything you need to figure out why a real form
 * submission isn't landing in the inbox. Safe to hit from a browser.
 *
 * Hide or remove this route once email is confirmed working in production.
 */

function redact(v: string | undefined): string {
  if (!v) return "(missing)";
  if (v.length <= 8) return "***";
  return `${v.slice(0, 4)}…${v.slice(-4)} (${v.length} chars)`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.KAPTURE_LEAD_NOTIFY_EMAIL || "studio@thekapture.com";
  const from = process.env.RESEND_FROM_EMAIL || "Kapture Logistics <onboarding@resend.dev>";

  const env = {
    RESEND_API_KEY: redact(apiKey),
    RESEND_FROM_EMAIL: from,
    KAPTURE_LEAD_NOTIFY_EMAIL: to,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  // Hints to surface common misconfigurations
  const hints: string[] = [];
  if (!apiKey) {
    hints.push("RESEND_API_KEY is not set in your Vercel environment variables. Add it under Settings → Environment Variables and redeploy.");
  } else if (!apiKey.startsWith("re_")) {
    hints.push("RESEND_API_KEY does not start with 're_' — it may be malformed. Generate a fresh key at resend.com/api-keys.");
  }
  if (from.includes("onboarding@resend.dev")) {
    hints.push(`Sandbox sender in use ('onboarding@resend.dev'). Resend's free tier with the sandbox sender ONLY delivers to the email address you signed up with. If your Resend account email isn't ${to}, the message will be rejected. Either: (a) ensure your Resend account email is ${to}, or (b) verify thekapture.com in Resend (Domains → Add Domain) and update RESEND_FROM_EMAIL.`);
  }

  if (dry) {
    return NextResponse.json({ ok: true, mode: "dry-run", env, hints });
  }

  if (!apiKey) {
    return NextResponse.json({ ok: false, mode: "send", env, hints, error: "RESEND_API_KEY missing" }, { status: 500 });
  }

  // Send a real test email
  const subject = "[Kapture] Email pipeline test";
  const now = new Date().toISOString();
  const payload = {
    from,
    to: [to],
    subject,
    html: `<!DOCTYPE html>
<html><body style="margin:0;padding:32px 16px;background:#f5f5f5;font-family:system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
    <div style="background:#0A0A0A;color:white;padding:24px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#FFD400;">Kapture Logistics · Diagnostic</div>
      <div style="margin-top:6px;font-size:18px;font-weight:700;">Email pipeline is alive.</div>
    </div>
    <div style="padding:24px;color:#333;font-size:14px;line-height:1.55;">
      <p style="margin:0 0 12px;">If you're reading this, the Resend integration is working end-to-end. Real form submissions will land in this inbox the same way.</p>
      <p style="margin:0 0 12px;color:#666;font-size:12px;">Sent at ${now}</p>
      <p style="margin:0;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Sender: ${from} · Recipient: ${to}</p>
    </div>
  </div>
</body></html>`,
  };

  let resendResponse: { status: number; ok: boolean; body: unknown } = {
    status: 0,
    ok: false,
    body: null,
  };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => null);
    }
    resendResponse = { status: res.status, ok: res.ok, body };
  } catch (err) {
    resendResponse = {
      status: 0,
      ok: false,
      body: err instanceof Error ? err.message : String(err),
    };
  }

  // Add post-send guidance
  if (!resendResponse.ok) {
    const body = resendResponse.body as { message?: string; name?: string } | null;
    if (body && typeof body === "object" && "message" in body) {
      const msg = String(body.message ?? "").toLowerCase();
      if (msg.includes("domain")) {
        hints.push("Resend rejected the FROM address. Verify your domain at resend.com/domains, OR keep RESEND_FROM_EMAIL as 'Kapture Logistics <onboarding@resend.dev>' AND make sure the recipient email matches your Resend account email.");
      }
      if (msg.includes("api key") || msg.includes("authoriz") || msg.includes("unauthor")) {
        hints.push("API key is invalid. Regenerate at resend.com/api-keys, paste the new value into Vercel, redeploy.");
      }
      if (msg.includes("validation") || msg.includes("invalid")) {
        hints.push("Resend says the request is invalid. Check the body shape returned below for the specific field that failed.");
      }
    }
  } else {
    hints.push(`Test email accepted by Resend (200/202). Check ${to} in 5-30 seconds. If it doesn't arrive: (1) check spam folder, (2) check resend.com → Logs to confirm delivery, (3) verify the recipient address is the one you signed up with.`);
  }

  return NextResponse.json(
    {
      ok: resendResponse.ok,
      mode: "send",
      env,
      resendResponse,
      hints,
    },
    { status: resendResponse.ok ? 200 : 500 },
  );
}
