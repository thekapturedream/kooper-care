"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertTriangle, CalendarClock } from "lucide-react";
import { CalendlyEmbed } from "./CalendlyEmbed";

type Status = "idle" | "submitting" | "success" | "error";

// Kapture Studio solutions — the parent agency's real menu of services.
// Even though this lives on the Logistics demo, every contact submission
// routes back to Kapture as a lead, so the topics reflect what Kapture
// actually sells across web, brand, audit, education, and partnership work.
const TOPICS = [
  { value: "general",        label: "General enquiry" },
  { value: "web-build",      label: "Build my website" },
  { value: "brand-identity", label: "Brand identity & design" },
  { value: "brand-audit",    label: "Brand audit · Kurongeka" },
  { value: "templates",      label: "Templates & stock assets" },
  { value: "courses",        label: "Courses & training" },
  { value: "workshops",      label: "Workshops & live events" },
  { value: "consulting",     label: "Strategic consulting" },
  { value: "partnership",    label: "Partnership / collaboration" },
  { value: "press",          label: "Press" },
  { value: "careers",        label: "Careers" },
];

type SubmittedLead = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

export function ContactForm({ topic = "general" }: { topic?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState<SubmittedLead>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, type: "contact", source: "contact-page" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Could not submit. Please try again.");
      }
      setSubmitted({
        name:    typeof payload.name    === "string" ? payload.name    : undefined,
        email:   typeof payload.email   === "string" ? payload.email   : undefined,
        company: typeof payload.company === "string" ? payload.company : undefined,
        message: typeof payload.message === "string" ? payload.message : undefined,
      });
      setStatus("success");
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-kapture-yellow bg-kapture-yellow/10 p-7 md:p-8">
          <CheckCircle2 className="text-kapture-amber" size={28} />
          <h3 className="mt-4 font-display text-2xl font-bold">Message received.</h3>
          <p className="mt-2 text-sm text-kapture-smoke dark:text-kapture-fog md:text-base">
            A Kapture team member will be in touch. To fast-track your enquiry, lock a
            15-minute discovery call below — we'll cover everything on the call.
          </p>
        </div>

        <div className="flex items-center gap-3 px-1">
          <CalendarClock size={18} className="text-kapture-yellow" />
          <p className="text-sm font-semibold uppercase tracking-wider text-kapture-mist">
            Pick a slot · Free · 15 minutes
          </p>
        </div>

        <CalendlyEmbed
          prefill={{
            name: submitted.name,
            email: submitted.email,
            company: submitted.company,
            notes: submitted.message,
          }}
        />
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-2xl border bg-white p-6 shadow-kapture-soft dark:border-kapture-ash dark:bg-kapture-coal md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="label">What's this about?</span>
          <select className="field" name="topic" defaultValue={topic}>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="label">Full name *</span>
          <input className="field" type="text" name="name" required />
        </label>
        <label>
          <span className="label">Work email *</span>
          <input className="field" type="email" name="email" required />
        </label>
        <label>
          <span className="label">Company</span>
          <input className="field" type="text" name="company" />
        </label>
        <label>
          <span className="label">Phone</span>
          <input className="field" type="tel" name="phone" />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="label">Message *</span>
        <textarea
          className="field"
          name="message"
          rows={5}
          required
          placeholder="Tell us what you're moving, what's broken, or what you want built."
        />
      </label>

      <div className="mt-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-kapture-mist">
          By submitting you agree to be contacted by Kapture.
        </p>
        <button type="submit" disabled={status === "submitting"} className="btn-primary disabled:opacity-60">
          {status === "submitting" ? "Sending…" : "Send message"}
          <Send size={14} />
        </button>
      </div>

      {status === "error" && errorMsg && (
        <div className="mt-4 flex items-start gap-2 rounded-kapture border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <AlertTriangle size={16} className="mt-0.5" />
          {errorMsg}
        </div>
      )}
    </form>
  );
}
