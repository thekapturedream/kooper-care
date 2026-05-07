import Link from "next/link";
import { Check } from "lucide-react";
import { KaptureSun } from "./KaptureSun";

/**
 * Final CTA. Yellow base with a black inset card carrying the founders-pricing
 * offer for the first 50 operators.
 */
export function CTA() {
  return (
    <section id="cta" className="bg-kapture-yellow py-20 lg:py-28">
      <div className="container-kapture">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-section-xl text-balance text-kapture-black">
              Ready to ship the incumbents?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-kapture-coal lg:text-lg">
              Book a 20-minute demo. We&apos;ll show you the system live, scope your stack, and give you
              a fixed migration timeline within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="btn-kapture bg-kapture-black text-white hover:bg-transparent hover:text-kapture-black hover:ring-2 hover:ring-inset hover:ring-kapture-black">
                Book a demo
              </Link>
              <Link href="/demo" className="btn-kapture border border-kapture-black text-kapture-black hover:bg-kapture-black hover:text-white">
                Walk the live demo first
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-kapture-black p-6 text-white lg:p-8">
              <div className="mb-4 flex items-center gap-3">
                <KaptureSun size={32} className="text-white" />
                <div>
                  <div className="font-display font-semibold">First 50 operators</div>
                  <div className="text-xs text-kapture-mist">Founders pricing — 30% off year one</div>
                </div>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-kapture-fog">
                {[
                  "Direct line to the founders during setup",
                  "Free migration from PCS, Nourish, Log my Care",
                  "Locked price for 24 months",
                  "Co-design rights on the next 3 modules",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-kapture-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
