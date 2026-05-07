"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { KaptureSun } from "./KaptureSun";
import { cn } from "@/lib/utils";

/**
 * Top navigation for Kapture Care.
 *
 * Visual contract:
 *   · The home `/` route uses a dark hero, so the navbar sits transparent over
 *     it and switches to white-on-dark links until the user scrolls past 8px.
 *   · Every other page (or once scrolled) → solid white-with-blur in light
 *     mode, solid black-with-blur in dark mode, with dark-on-light links.
 *
 * Brand chrome:
 *   · Logomark = KaptureSun (8 dots, top-right intercardinal in #FFD400).
 *   · Wordmark = `kapture · care` (lowercase, dot separator, Space Grotesk).
 */
const NAV = [
  { label: "Modules", href: "/modules" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Compliance", href: "/compliance" },
  { label: "Demo", href: "/demo" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const isHome = pathname === "/";
  const overHero = isHome && !scrolled;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerBg = overHero
    ? "border-transparent bg-transparent"
    : "border-kapture-fog/60 bg-white/85 backdrop-blur-md dark:border-kapture-ash dark:bg-kapture-black/85";

  const linkClass = overHero
    ? "text-white/85 hover:bg-white/10 hover:text-white"
    : "text-kapture-smoke hover:bg-kapture-paper hover:text-kapture-black dark:text-kapture-fog dark:hover:bg-kapture-ink dark:hover:text-kapture-white";

  const brandText = overHero ? "text-white" : "text-kapture-black dark:text-kapture-white";
  const sunBody = overHero ? "text-white" : "text-kapture-black dark:text-kapture-white";
  const dotColor = overHero ? "text-white/40" : "text-kapture-mist";

  const iconBtn = overHero
    ? "border-white/20 text-white hover:bg-white hover:text-kapture-black"
    : "border-kapture-fog text-kapture-black hover:bg-kapture-black hover:text-kapture-white dark:border-kapture-ash dark:text-kapture-white dark:hover:bg-kapture-white dark:hover:text-kapture-black";

  const cta = overHero
    ? "bg-kapture-yellow text-kapture-black hover:bg-kapture-amber"
    : "bg-kapture-black text-kapture-white hover:bg-transparent hover:text-kapture-black hover:ring-2 hover:ring-inset hover:ring-kapture-black dark:bg-kapture-yellow dark:text-kapture-black dark:hover:bg-kapture-amber";

  return (
    <header className={cn("fixed top-0 z-50 w-full border-b transition-all", headerBg)}>
      <div className="container-kapture flex h-16 items-center justify-between">
        <Link
          href="/"
          className={cn("flex items-center gap-3 font-display text-base lowercase tracking-wide transition-colors", brandText)}
          aria-label="Kapture Care — Home"
        >
          <KaptureSun size={26} className={cn("transition-colors", sunBody)} />
          <span className="flex items-center gap-2">
            <span className="font-semibold">kapture</span>
            <span className={cn("transition-colors", dotColor)}>·</span>
            <span className="font-medium">care</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("rounded-kapture px-3 py-2 text-sm font-medium transition-colors", linkClass)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/contact"
            className={cn(
              "hidden md:inline-flex btn-kapture !min-h-0 h-10 px-4 text-xs transition-colors",
              cta,
            )}
          >
            Book demo
            <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            className={cn("md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors", iconBtn)}
            onClick={() => setOpen((s) => !s)}
            aria-label="Open menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-kapture-fog/60 bg-white dark:border-kapture-ash dark:bg-kapture-black md:hidden">
          <div className="container-kapture flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-kapture px-3 py-3 text-sm font-medium text-kapture-smoke hover:bg-kapture-paper dark:text-kapture-fog dark:hover:bg-kapture-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-kapture mt-3 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber"
            >
              Book demo
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
