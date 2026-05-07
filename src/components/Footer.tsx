import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { KaptureSun } from "./KaptureSun";
import { SITE } from "@/lib/utils";

/**
 * Site-wide footer for Kapture Care. Mirrors the Logistics column structure
 * but every label and route is care-specific.
 */
const COLS = [
  {
    title: "Product",
    links: [
      { label: "Modules", href: "/modules" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Live demo", href: "/demo" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Care home", href: "/solutions#care-home" },
      { label: "Domiciliary", href: "/solutions#domiciliary" },
      { label: "Supported living", href: "/solutions#supported-living" },
      { label: "Nursing home", href: "/solutions#nursing" },
      { label: "Forensic / MH", href: "/solutions#forensic" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { label: "CQC alignment", href: "/compliance#cqc" },
      { label: "NHS DSPT", href: "/compliance#dspt" },
      { label: "DSCR standards", href: "/compliance#dscr" },
      { label: "GDPR & data", href: "/compliance#gdpr" },
      { label: "Security", href: "/compliance#security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Kapture", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 border-t border-kapture-fog/60 bg-kapture-paper dark:border-kapture-ash dark:bg-kapture-ink">
      <div className="container-kapture py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 font-display text-lg lowercase tracking-wide">
              <KaptureSun size={28} className="text-kapture-black dark:text-kapture-white" />
              <span className="flex items-center gap-2">
                <span className="font-semibold">kapture</span>
                <span className="text-kapture-mist">·</span>
                <span className="font-medium">care</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-kapture-smoke dark:text-kapture-fog">
              Modular care management software, built around HR. Pre-built. Opt-in.
              Pay for what you use. Designed and engineered by Kapture for UK care providers.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-kapture-smoke hover:text-kapture-black dark:text-kapture-fog dark:hover:text-kapture-white"
              >
                <Mail size={14} />
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-kapture-smoke hover:text-kapture-black dark:text-kapture-fog dark:hover:text-kapture-white"
              >
                <Phone size={14} />
                {SITE.phone}
              </a>
              <div className="flex items-center gap-3 text-kapture-smoke dark:text-kapture-fog">
                <MapPin size={14} />
                {SITE.address.locality} · {SITE.address.country}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/contact" className="btn-kapture bg-kapture-black text-kapture-white hover:bg-transparent hover:text-kapture-black hover:ring-2 hover:ring-inset hover:ring-kapture-black dark:bg-kapture-yellow dark:text-kapture-black dark:hover:bg-kapture-amber">
                Book a demo
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-8 md:grid-cols-4">
            {COLS.map((col) => (
              <div key={col.title}>
                <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-kapture-black dark:text-kapture-white">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-kapture-smoke transition-colors hover:text-kapture-black dark:text-kapture-fog dark:hover:text-kapture-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-kapture-fog pt-8 dark:border-kapture-ash md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-kapture-smoke dark:text-kapture-fog">
            © {year} {SITE.legalName} · Kapture Care is a {SITE.parent} product
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-kapture-smoke dark:text-kapture-fog">
            <span>CQC SAF aligned</span>
            <span aria-hidden>·</span>
            <span>NHS DSPT certified</span>
            <span aria-hidden>·</span>
            <span>UK GDPR compliant</span>
            <span aria-hidden>·</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
