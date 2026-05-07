"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Kapture Care Hero.
 *
 * Layered HR-driven login spine messaging:
 *  · Headline: "Log in. Care appears." — the differentiator.
 *  · Right-hand demo card: pick a role + toggle modules → live price preview.
 *
 * Roles available in the demo are the four primary RBAC profiles HR ships
 * with on day one. Modules reflect the 10-module catalog with HR locked as
 * required. The price ticker mirrors the published per-resident tariffs.
 */

type Role = "nurse" | "carer" | "manager" | "inspector";
const ROLES: { id: Role; label: string }[] = [
  { id: "nurse", label: "Sister Anne · Nurse" },
  { id: "carer", label: "Craig · Carer" },
  { id: "manager", label: "Lola · Manager" },
  { id: "inspector", label: "Tomas · Inspector" },
];

type ModuleId =
  | "hr"
  | "care-plans"
  | "recording"
  | "charts"
  | "reports"
  | "family"
  | "operations"
  | "compliance"
  | "wellbeing"
  | "insights";

const MODULES: { id: ModuleId; label: string; price: number; required?: boolean }[] = [
  { id: "hr", label: "HR · Required", price: 2.4, required: true },
  { id: "care-plans", label: "Care plans", price: 1.2 },
  { id: "recording", label: "Recording", price: 0.8 },
  { id: "charts", label: "Charts", price: 0.6 },
  { id: "reports", label: "Reports", price: 0.5 },
  { id: "family", label: "Family", price: 0.4 },
  { id: "operations", label: "Operations", price: 0.5 },
  { id: "compliance", label: "Compliance", price: 0.5 },
  { id: "wellbeing", label: "Wellbeing", price: 0.4 },
  { id: "insights", label: "Insights · AI", price: 0.8 },
];

export function Hero() {
  const [role, setRole] = React.useState<Role>("nurse");
  const [selected, setSelected] = React.useState<Set<ModuleId>>(
    new Set<ModuleId>(["hr", "care-plans", "recording", "charts"]),
  );

  function toggle(id: ModuleId, locked?: boolean) {
    if (locked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalPrice = MODULES.filter((m) => selected.has(m.id)).reduce((sum, m) => sum + m.price, 0);

  return (
    <section className="relative isolate -mt-16 overflow-hidden bg-kapture-black text-white">
      {/* Yellow glow accents */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-kapture-yellow/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-kapture-yellow/10 blur-3xl"
      />

      <div className="container-kapture relative grid grid-cols-1 items-center gap-12 pb-16 pt-32 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-40">
        {/* LEFT — Headline + sub + CTAs */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="chip-kapture border-white/20 bg-transparent text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-ok opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-ok" />
              </span>
              CQC SAF aligned
            </span>
            <span className="chip-kapture border-white/20 bg-transparent text-white">NHS DSPT certified</span>
            <span className="chip-kapture border-kapture-yellow bg-kapture-yellow text-kapture-black font-mono text-[0.6875rem] tracking-widest">
              v1 · Q3 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-hero-xl text-balance text-white"
          >
            Log in.{" "}
            <span className="relative inline-block pb-1">
              Care
              <span aria-hidden className="absolute -bottom-0 left-0 h-3 w-full -skew-x-6 bg-kapture-yellow" />
            </span>{" "}
            appears.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-kapture-fog md:text-lg"
          >
            Kapture Care is a modular care management system built around HR. Sign in once — the
            platform knows your role, your residents, your shift, your tools. Pick the modules your
            service actually needs. Skip the rest. Pay for what you use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/demo" className="btn-kapture bg-kapture-yellow text-kapture-black hover:bg-kapture-amber">
              Walk the live demo
              <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-kapture border border-white text-white hover:bg-white hover:text-kapture-black">
              Book a 20-minute call
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kapture-yellow opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-kapture-yellow" />
              </span>
              Saving carers <span className="font-mono">62 mins/day</span>
            </span>
            <span className="hidden md:inline">·</span>
            <span>
              <span className="font-mono">10</span> modules · use any combination
            </span>
            <span className="hidden md:inline">·</span>
            <span>
              From <span className="font-mono">£2.40</span> per resident / month
            </span>
          </motion.div>
        </div>

        {/* RIGHT — Login + module picker mini-demo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="overflow-hidden rounded-2xl border border-kapture-ash bg-kapture-coal shadow-2xl">
            <div className="flex items-center justify-between border-b border-kapture-ash px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-status-critical" />
                <div className="h-2.5 w-2.5 rounded-full bg-kapture-yellow" />
                <div className="h-2.5 w-2.5 rounded-full bg-status-ok" />
              </div>
              <span className="font-mono text-[0.6875rem] tracking-widest text-kapture-mist">
                DEMO · LOGIN SPINE
              </span>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <div className="mb-3 text-[0.6875rem] font-medium uppercase tracking-widest text-kapture-mist">
                  Step 1 · Sign in as
                </div>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-all",
                        role === r.id
                          ? "border-kapture-yellow bg-kapture-yellow text-kapture-black font-semibold"
                          : "border-white/20 bg-white/5 text-white hover:bg-white/10",
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-[0.6875rem] font-medium uppercase tracking-widest text-kapture-mist">
                  Step 2 · Pick your stack
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {MODULES.slice(0, 8).map((m) => {
                    const isOn = selected.has(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggle(m.id, m.required)}
                        className={cn(
                          "flex items-center justify-between rounded-[10px] border px-3.5 py-2.5 text-left text-[0.8125rem] transition-all",
                          m.required
                            ? "border-white bg-white text-kapture-black font-semibold cursor-not-allowed"
                            : isOn
                              ? "border-kapture-yellow bg-kapture-yellow text-kapture-black font-semibold"
                              : "border-white/15 bg-white/5 text-white hover:bg-white/10",
                        )}
                      >
                        <span>{m.label}</span>
                        {(isOn || m.required) && <Check size={13} strokeWidth={3} />}
                        {!isOn && !m.required && <span className="text-kapture-mist">+</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-kapture-mist">
                  <div>{selected.size} modules selected</div>
                  <div className="font-mono text-base text-white">£{totalPrice.toFixed(2)} / resident / month</div>
                </div>
                <Link href="/demo" className="btn-kapture !min-h-0 h-9 bg-kapture-yellow px-3 text-xs text-kapture-black hover:bg-kapture-amber">
                  Enter Kapture Care →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
