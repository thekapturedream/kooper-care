import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ImageStrip } from "@/components/ImageStrip";
import { CTA } from "@/components/CTA";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — Designed and engineered by Kapture",
  description:
    "Kapture Logistics is a deployable freight and supply-chain system designed and engineered by Kapture — the studio turning bold ideas into operating businesses.",
  alternates: { canonical: "/about" },

};

const PRINCIPLES = [
  {
    title: "Operate, don't observe.",
    body: "We run lanes, not slide decks. Our team sits inside the flow — pickup, border, drop — so the answer is always one call away.",
  },
  {
    title: "One thread, end-to-end.",
    body: "From first quote to final POD, one team owns the shipment. No handoffs. No finger-pointing. One number to call.",
  },
  {
    title: "Software that earns its keep.",
    body: "The Kapture platform exists to remove human friction, not add screens. If a feature does not move a load faster, it does not ship.",
  },
  {
    title: "Africa-native, world-fluent.",
    body: "We grew up on SADC corridors, but we move into and out of every major global gateway. Local muscle, global reach.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Designed for operators with bold cargo."
        lede="Kapture Logistics is a deployable system — designed and engineered by Kapture, the studio turning bold ideas into operating businesses across Africa and beyond. Not a company. A solution."
      >
        <div className="flex flex-wrap gap-x-3 gap-y-4">
          <Link href="/contact?topic=partner" className="btn-primary text-[18px]">
            Partner with us
            <ArrowUpRight size={18} />
          </Link>
          <Link href={SITE.parentUrl} target="_blank" rel="noreferrer" className="btn-secondary text-[18px]">
            Visit Kapture
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </PageHeader>

      <section className="container-kapture py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="chip">
              <span className="divider-dot" />
              The Kapture story
            </p>
            <h2 className="h-section mt-4 text-balance">
              We started where the freight market was loudest, and least listened to.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="lede">
              Kapture is a digital studio for ambitious operators — founders, governments,
              and enterprises with bold ideas and short timelines. Logistics was the first hard
              problem our clients kept hitting: lanes that broke, partners that ghosted, software
              that lied.
            </p>
            <p className="lede mt-4">
              Kapture Logistics is what we engineered in response. A deployable software system
              wrapped around managed transportation, multi-modal capacity, and last-mile delivery
              — designed for operators that need to move cargo today and own the digital layer
              tomorrow.
            </p>
            <p className="lede mt-4">
              Today, the Kapture Logistics system runs for retailers, manufacturers, miners, and
              healthcare brands across the continent — and for international shippers moving into
              Africa for the first time.
            </p>
          </div>
        </div>
      </section>

      <ImageStrip
        src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=80"
        alt="Container terminal in operation"
        eyebrow="Where we work"
        caption="Across every African corridor and every global gateway that matters."
        height="medium"
      />

      <section className="bg-kapture-paper dark:bg-kapture-ink">
        <div className="container-kapture py-24 md:py-32">
          <p className="chip">
            <span className="divider-dot" />
            How we operate
          </p>
          <h2 className="h-section mt-4 max-w-2xl text-balance">
            Four principles that decide every load.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border bg-white p-8 dark:border-kapture-ash dark:bg-kapture-coal"
              >
                <span className="font-mono text-xs text-kapture-mist">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-kapture-smoke dark:text-kapture-fog">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
