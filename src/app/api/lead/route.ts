import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead validation schema.
 *
 * The careers application form has a wide field surface (45+ fields once
 * role-specific extras are included) and the set is dynamic — a Class 1
 * driver and a software engineer share only the universal fields. Rather
 * than enumerate every possible career field in zod, the schema validates
 * a strict universal core and accepts arbitrary string passthrough for
 * the rest (capped at 4000 chars per value to prevent abuse).
 */
const LeadSchema = z
  .object({
    type: z
      .enum(["quote", "contact", "newsletter", "partner", "careers"])
      .default("contact"),
    // Personal details
    name: z.string().min(1).max(120).optional(),
    email: z.string().email().max(180),
    phone: z.string().max(40).optional().or(z.literal("")),
    company: z.string().max(160).optional().or(z.literal("")),
    // Freight quote fields (logistics demo flow)
    origin: z.string().max(160).optional().or(z.literal("")),
    destination: z.string().max(160).optional().or(z.literal("")),
    cargo_type: z.string().max(80).optional().or(z.literal("")),
    weight_kg: z.coerce.number().positive().max(10_000_000).optional().or(z.literal("")),
    mode: z.string().max(40).optional().or(z.literal("")),
    pickup_date: z.string().max(40).optional().or(z.literal("")),
    // Kapture onboarding fields (template buy/customize/custom flow)
    intent: z.string().max(40).optional().or(z.literal("")),
    domain: z.string().max(180).optional().or(z.literal("")),
    industry: z.string().max(80).optional().or(z.literal("")),
    timeline: z.string().max(80).optional().or(z.literal("")),
    // General
    topic: z.string().max(80).optional().or(z.literal("")),
    service: z.string().max(80).optional().or(z.literal("")),
    message: z.string().max(4000).optional().or(z.literal("")),
    source: z.string().max(80).optional().or(z.literal("")),
    // Careers (universal + open passthrough below)
    first_name: z.string().max(80).optional().or(z.literal("")),
    last_name: z.string().max(80).optional().or(z.literal("")),
  })
  .catchall(z.string().max(4000));

type Lead = Record<string, unknown>;

function blankToNull<T extends Record<string, unknown>>(obj: T) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v === "" ? null : v;
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Email delivery — Resend HTTP API                                        */
/*                                                                         */
/* Free tier: 3,000 emails/month. Default `onboarding@resend.dev` sender   */
/* works without domain verification — perfect for shipping today.         */
/* Set RESEND_FROM_EMAIL once you verify thekapture.com.                   */
/* ────────────────────────────────────────────────────────────────────── */

const FIELD_LABELS: Record<string, string> = {
  type:         "Lead type",
  name:         "Name",
  email:        "Email",
  phone:        "Phone",
  company:      "Company",
  origin:       "Pickup",
  destination:  "Drop-off",
  cargo_type:   "Cargo type",
  weight_kg:    "Weight (kg)",
  mode:         "Mode",
  pickup_date:  "Pickup date",
  intent:       "Intent",
  domain:       "Domain",
  industry:     "Industry",
  timeline:     "Timeline",
  topic:        "Topic / Department",
  service:      "Role",
  message:      "Message",
  source:       "Source",
  // ── Careers — universal ─────────────────────────────────────────────
  first_name:           "First name",
  last_name:            "Last name",
  city:                 "City",
  postcode:             "Postcode",
  rtw_status:           "Right to work",
  ni_number:            "NI number",
  date_of_birth:        "Date of birth",
  notice_period:        "Notice period",
  address_history:      "5-year address history",
  current_employer:     "Current employer",
  current_title:        "Current job title",
  current_dates:        "Current role dates",
  previous_employers:   "Previous employers",
  employment_gaps:      "Employment gaps",
  ref1_name:            "Ref 1 — Name",
  ref1_company:         "Ref 1 — Company",
  ref1_title:           "Ref 1 — Title",
  ref1_email:           "Ref 1 — Email",
  ref2_name:            "Ref 2 — Name",
  ref2_company:         "Ref 2 — Company",
  ref2_title:           "Ref 2 — Title",
  ref2_email:           "Ref 2 — Email",
  cv_link:              "CV link",
  found_via:            "Found us via",
  referrer_name:        "Referred by",
  declare_truthful:     "Declared truthful",
  declare_dvla_check:   "Consent — DVLA check",
  declare_dbs:          "Consent — DBS",
  declare_data:         "Consent — data use",
  // ── Careers — driver fields ────────────────────────────────────────
  licence_categories:        "Licence categories",
  licence_issue_country:     "Licence country",
  licence_points:            "Penalty points",
  licence_endorsements:      "Endorsements",
  driver_cpc_card:           "Driver CPC",
  tacho_card:                "Digital tacho",
  adr_held:                  "ADR",
  hiab_held:                 "HIAB",
  vehicle_experience:        "Vehicle experience",
  preferred_work_pattern:    "Preferred pattern",
  // ── Careers — warehouse fields ─────────────────────────────────────
  flt_licences:              "FLT licences",
  flt_provider:              "FLT provider / expiry",
  warehouse_systems:         "WMS / scanner systems",
  shift_pattern_pref:        "Shift preference",
  // ── Careers — office / commercial / tech / compliance ──────────────
  tms_systems:               "TMS systems",
  fluent_languages:          "Languages",
  patch:                     "Sales territory",
  ticket_size:               "Avg contract size",
  vertical_focus:            "Verticals",
  primary_stack:             "Primary stack",
  github:                    "GitHub / portfolio",
  transport_manager_cpc:     "TM CPC",
  operator_licence_experience: "Years on O-licence",
  audit_history:             "Audit history",
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Field display priority — universal contact info first, role-specific tail. */
const FIELD_ORDER = [
  "type", "service", "topic",
  "first_name", "last_name", "name",
  "email", "phone",
  "city", "postcode", "rtw_status", "date_of_birth", "ni_number", "notice_period",
  "current_employer", "current_title", "current_dates",
  "previous_employers", "employment_gaps", "address_history",
  "licence_categories", "licence_issue_country", "licence_points", "licence_endorsements",
  "driver_cpc_card", "tacho_card", "adr_held", "hiab_held",
  "vehicle_experience", "preferred_work_pattern",
  "flt_licences", "flt_provider", "warehouse_systems", "shift_pattern_pref",
  "tms_systems", "fluent_languages", "patch", "ticket_size", "vertical_focus",
  "primary_stack", "github",
  "transport_manager_cpc", "operator_licence_experience", "audit_history",
  "ref1_name", "ref1_company", "ref1_title", "ref1_email",
  "ref2_name", "ref2_company", "ref2_title", "ref2_email",
  "cv_link", "found_via", "referrer_name",
  "declare_truthful", "declare_dvla_check", "declare_dbs", "declare_data",
  "company", "origin", "destination", "cargo_type", "weight_kg", "mode",
  "pickup_date", "intent", "domain", "industry", "timeline",
  "message", "source",
];

function orderEntries(lead: Lead): [string, unknown][] {
  const filtered = Object.entries(lead).filter(([, v]) => v != null && v !== "");
  const indexOf = (k: string) => {
    const i = FIELD_ORDER.indexOf(k);
    return i === -1 ? FIELD_ORDER.length : i;
  };
  return filtered.sort(([a], [b]) => indexOf(a) - indexOf(b));
}

function buildEmailHtml(lead: Lead, subject: string) {
  const isCareers = lead.type === "careers";
  const headerEyebrow = isCareers
    ? "New application · Kapture Careers"
    : "New lead · Kapture Logistics";

  const rows = orderEntries(lead)
    .map(([k, v]) => {
      const label = FIELD_LABELS[k] ?? k;
      const value = String(v);
      const isLong = k === "message" || k === "address_history" || k === "previous_employers" || k === "employment_gaps" || k === "audit_history" || k === "licence_endorsements";
      return `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #eaeaea;color:#9A9A9A;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;font-weight:600;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #eaeaea;color:#0A0A0A;font-size:14px;line-height:1.55;${isLong ? "white-space:pre-wrap;" : ""}">${escapeHtml(value)}</td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:32px 16px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0A0A0A;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
    <div style="background:#0A0A0A;color:#ffffff;padding:24px 28px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#FFD400;">${escapeHtml(headerEyebrow)}</div>
      <div style="margin-top:6px;font-size:20px;font-weight:700;">${escapeHtml(subject)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <div style="padding:18px 28px;background:#f5f5f5;color:#9A9A9A;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">
      Captured ${new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · Reply directly to respond
    </div>
  </div>
</body>
</html>`;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Report attachment — read once, cache base64                             */
/* ────────────────────────────────────────────────────────────────────── */

const REPORT_FILENAME = "state-of-uk-logistics-2026.pdf";
let reportCache: { base64: string; size: number } | null = null;

function readReportAsBase64() {
  if (reportCache) return reportCache;
  try {
    const filepath = path.join(process.cwd(), "public", REPORT_FILENAME);
    const buffer = fs.readFileSync(filepath);
    reportCache = {
      base64: buffer.toString("base64"),
      size: buffer.length,
    };
    return reportCache;
  } catch (err) {
    console.error("[lead] failed reading report PDF:", err);
    return null;
  }
}

function buildSubscriberEmailHtml(firstName: string) {
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi there,";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Your State of UK Logistics 2026 report</title></head>
<body style="margin:0;padding:32px 16px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0A0A0A;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
    <div style="background:#0A0A0A;color:#ffffff;padding:28px 32px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#FFD400;">Kapture Studio · Annual report</div>
      <div style="margin-top:8px;font-size:22px;font-weight:700;line-height:1.2;">Your State of UK Logistics 2026 report.</div>
    </div>
    <div style="padding:28px 32px;color:#3A3A3A;font-size:14px;line-height:1.6;">
      <p style="margin:0 0 14px;">${greeting}</p>
      <p style="margin:0 0 14px;">Attached is the free edition of <strong>State of UK Logistics Websites 2026</strong> — 14 pages, the AI thesis in full, the score curve across 200 brands, the survivor's stack, and the seven prioritised moves we'd make tomorrow.</p>
      <p style="margin:0 0 14px;">If a single thing in there resonates, two paths from here:</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;">
        <tr>
          <td style="padding-right:8px;">
            <a href="https://logistics.thekapture.com/request-audit" style="display:inline-block;background:#FFD400;color:#0A0A0A;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:9999px;font-size:13px;">Request a free audit →</a>
          </td>
          <td>
            <a href="https://logistics.thekapture.com/quote" style="display:inline-block;background:#0A0A0A;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:9999px;font-size:13px;">Ship a new website →</a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 14px;color:#9A9A9A;font-size:12px;">The full 64-page edition — every brand named, every score published, every sector breakdown — drops to subscribers next quarter. You're already on the list.</p>
      <p style="margin:0 0 8px;">— Acie<br/><span style="color:#9A9A9A;">Kapture Studio</span></p>
    </div>
    <div style="padding:18px 32px;background:#f5f5f5;color:#9A9A9A;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">
      Kapture Studio · London · Harare · Johannesburg · Dubai · Lusaka
    </div>
  </div>
</body>
</html>`;
}

async function sendReportToSubscriber(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[lead] RESEND_API_KEY not set — subscriber email skipped.");
    return { ok: false, reason: "no-api-key" as const };
  }

  const subscriberEmail = typeof lead.email === "string" ? lead.email : "";
  if (!subscriberEmail) {
    return { ok: false, reason: "no-recipient" as const };
  }

  const report = readReportAsBase64();
  if (!report) {
    return { ok: false, reason: "no-pdf" as const };
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "Kapture Studio <onboarding@resend.dev>";
  const firstName =
    typeof lead.name === "string" && lead.name ? lead.name.split(/\s+/)[0] : "";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [subscriberEmail],
        subject: "Your State of UK Logistics 2026 report",
        html: buildSubscriberEmailHtml(firstName),
        attachments: [
          {
            filename: REPORT_FILENAME,
            content: report.base64,
          },
        ],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "(no body)");
      console.error(
        `[lead] Resend rejected subscriber send. status=${res.status} to=${subscriberEmail} body=${errBody}`,
      );
      return { ok: false, reason: "send-failed" as const };
    }
    const okBody = await res.json().catch(() => ({}));
    console.log(
      `[lead] Resend accepted subscriber email. id=${(okBody as { id?: string }).id ?? "?"} to=${subscriberEmail}`,
    );
    return { ok: true as const };
  } catch (err) {
    console.error("[lead] subscriber send exception:", err);
    return { ok: false, reason: "exception" as const };
  }
}

async function sendLeadEmail(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[lead] RESEND_API_KEY not set — email skipped. Hit /api/test-email for diagnostics.");
    return { ok: false, reason: "no-api-key" as const };
  }

  const to = process.env.KAPTURE_LEAD_NOTIFY_EMAIL || "studio@thekapture.com";
  const from = process.env.RESEND_FROM_EMAIL || "Kapture Logistics <onboarding@resend.dev>";
  const replyTo = typeof lead.email === "string" ? lead.email : undefined;

  const leadType = typeof lead.type === "string" ? lead.type : "lead";
  // Synthesise a name from first_name + last_name for careers submissions
  // — that form doesn't have a single `name` field.
  const candidateName =
    (typeof lead.first_name === "string" && lead.first_name) ||
    (typeof lead.last_name === "string" && lead.last_name)
      ? [lead.first_name, lead.last_name].filter(Boolean).join(" ")
      : (typeof lead.name === "string" && lead.name ? lead.name : "anonymous");

  const subject =
    leadType === "careers"
      ? `Application — ${typeof lead.service === "string" ? lead.service : "Speculative"} · ${candidateName}`
      : `New ${leadType} from ${candidateName}`;

  // Tag the inbox prefix so careers vs. logistics is sortable in one glance.
  const tag = leadType === "careers" ? "[Kapture · Careers]" : "[Kapture]";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${tag} ${subject}`,
        html: buildEmailHtml(lead, subject),
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      // Capture full Resend response body for debugging in Vercel logs
      const errBody = await res.text().catch(() => "(no body)");
      console.error(
        `[lead] Resend rejected send. status=${res.status} from=${from} to=${to} body=${errBody}`,
      );
      return { ok: false, reason: "send-failed" as const, status: res.status, errBody };
    }
    const okBody = await res.json().catch(() => ({}));
    console.log(`[lead] Resend accepted email. id=${(okBody as { id?: string }).id ?? "?"} to=${to}`);
    return { ok: true as const };
  } catch (err) {
    console.error("[lead] resend send exception:", err);
    return { ok: false, reason: "exception" as const };
  }
}

/* ────────────────────────────────────────────────────────────────────── */
/* Optional fan-out hooks                                                  */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * HubSpot Forms API — push every lead to the free HubSpot CRM.
 *
 * Configure via env vars:
 *   HUBSPOT_PORTAL_ID         — your HubSpot portal / hub ID (numeric)
 *   HUBSPOT_FORM_ID_DEFAULT   — fallback form GUID for any lead type
 *   HUBSPOT_FORM_ID_QUOTE     — (optional) override for quote leads
 *   HUBSPOT_FORM_ID_CONTACT   — (optional) override for contact leads
 *   HUBSPOT_FORM_ID_NEWSLETTER — (optional) override for newsletter signups
 *   HUBSPOT_FORM_ID_CAREERS   — (optional) override for careers applications
 *
 * The HubSpot Forms API is unauthenticated — no API key required, the
 * portal+form GUID combination is the auth surface. Free CRM tier
 * accepts unlimited form submissions.
 *
 * Reference: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
 */
async function pushToHubSpot(lead: Lead) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  if (!portalId) return { ok: false, reason: "no-portal" as const };

  const leadType = typeof lead.type === "string" ? lead.type : "contact";
  const formId =
    (leadType === "quote" && process.env.HUBSPOT_FORM_ID_QUOTE) ||
    (leadType === "contact" && process.env.HUBSPOT_FORM_ID_CONTACT) ||
    (leadType === "newsletter" && process.env.HUBSPOT_FORM_ID_NEWSLETTER) ||
    (leadType === "careers" && process.env.HUBSPOT_FORM_ID_CAREERS) ||
    process.env.HUBSPOT_FORM_ID_DEFAULT;

  if (!formId) return { ok: false, reason: "no-form" as const };

  // Map our schema to HubSpot's standard contact properties. Anything
  // not in this map is dropped — HubSpot rejects unknown fields by
  // default. Custom HubSpot properties can be added by extending the
  // mapping below to match their internal names.
  const HUBSPOT_FIELDS: Record<string, string> = {
    email:        "email",
    name:         "fullname",
    first_name:   "firstname",
    last_name:    "lastname",
    phone:        "phone",
    company:      "company",
    domain:       "website",
    industry:     "industry",
    city:         "city",
    postcode:     "zip",
    message:      "message",
    service:      "kapture_role",
    topic:        "kapture_topic",
    source:       "kapture_source",
    notice_period: "kapture_notice_period",
    cv_link:      "kapture_cv_link",
  };

  const fields = Object.entries(lead)
    .filter(([k, v]) => HUBSPOT_FIELDS[k] && v != null && v !== "")
    .map(([k, v]) => ({
      name: HUBSPOT_FIELDS[k],
      value: String(v),
    }));

  if (fields.length === 0 || !lead.email) {
    return { ok: false, reason: "no-email" as const };
  }

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: typeof lead.source === "string" ? `${SITE_URL}${lead.source}` : SITE_URL,
            pageName: leadType,
          },
        }),
      },
    );
    if (!res.ok) {
      const errBody = await res.text().catch(() => "(no body)");
      console.error(`[lead] HubSpot rejected. status=${res.status} body=${errBody}`);
      return { ok: false, reason: "send-failed" as const };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("[lead] HubSpot send exception:", err);
    return { ok: false, reason: "exception" as const };
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://logistics.thekapture.com";

async function notifyWebhook(lead: Lead) {
  const url = process.env.KAPTURE_LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site: "kapture-logistics",
        receivedAt: new Date().toISOString(),
        lead,
      }),
    });
  } catch (err) {
    console.error("[lead] webhook notify failed:", err);
  }
}

/** Whitelist of columns that exist in the public.leads Supabase table. */
const SUPABASE_COLUMNS = [
  "type", "name", "email", "phone", "company",
  "origin", "destination", "cargo_type", "weight_kg",
  "mode", "pickup_date", "topic", "service",
  "message", "source",
] as const;

function pickSupabaseColumns(lead: Lead): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of SUPABASE_COLUMNS) {
    if (k in lead) out[k] = lead[k];
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Route handlers                                                          */
/* ────────────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const lead = blankToNull(parsed.data);

  // Synthesise a single `name` for careers applications so the rest of
  // the pipeline (subject lines, supabase, webhook) has a clean handle.
  if (
    lead.type === "careers" &&
    !lead.name &&
    (typeof lead.first_name === "string" || typeof lead.last_name === "string")
  ) {
    const fn = typeof lead.first_name === "string" ? lead.first_name : "";
    const ln = typeof lead.last_name === "string" ? lead.last_name : "";
    const joined = [fn, ln].filter(Boolean).join(" ");
    if (joined) lead.name = joined;
  }

  // Three jobs fire in parallel — none blocks the user response.
  //   1. notify studio inbox (every lead)
  //   2. fan out to webhook (Make.com etc.)
  //   3. email the report PDF to subscribers — only when this is a
  //      newsletter signup from /state-of-uk-logistics-2026
  const isReportSignup = lead.type === "newsletter";
  const [emailResult] = await Promise.all([
    sendLeadEmail(lead),
    notifyWebhook(lead),
    pushToHubSpot(lead),
    isReportSignup ? sendReportToSubscriber(lead) : Promise.resolve(),
  ]);

  // Best-effort Supabase persistence — never fails the user request.
  // If columns drift (e.g. new template fields), they're filtered out by
  // pickSupabaseColumns rather than crashing the insert.
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const payload = pickSupabaseColumns(lead);
    const { error } = await supabase.from("leads").insert(payload);
    if (error) {
      console.error("[lead] supabase insert failed:", error);
    }
  }

  return NextResponse.json({ ok: true, emailed: emailResult.ok });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "lead" });
}
