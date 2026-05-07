import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

/**
 * sitemap.xml — generated at build time from this manifest.
 *
 * Next.js exposes the sitemap at `/sitemap.xml` automatically. Submit to:
 *   - Google Search Console
 *   - Bing Webmaster Tools
 *
 * Priority is a relative signal (0.0–1.0) used by some crawlers to decide
 * which URLs to fetch first when crawl budget is tight. ChangeFreq is a
 * hint (Google ignores it, but Bing and others use it).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  /** Top-level marketing pages — high priority, change rarely. */
  const STATIC_PAGES: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/",            priority: 1.0,  changeFreq: "weekly" },
    { path: "/modules",     priority: 0.9,  changeFreq: "monthly" },
    { path: "/solutions",   priority: 0.9,  changeFreq: "monthly" },
    { path: "/pricing",     priority: 0.9,  changeFreq: "monthly" },
    { path: "/compliance",  priority: 0.8,  changeFreq: "monthly" },
    { path: "/demo",        priority: 0.9,  changeFreq: "weekly" },
    { path: "/about",       priority: 0.7,  changeFreq: "monthly" },
    { path: "/contact",     priority: 0.8,  changeFreq: "monthly" },
    { path: "/privacy",     priority: 0.3,  changeFreq: "yearly" },
    { path: "/terms",       priority: 0.3,  changeFreq: "yearly" },
    { path: "/cookies",     priority: 0.3,  changeFreq: "yearly" },
    { path: "/refunds",     priority: 0.3,  changeFreq: "yearly" },
  ];

  /** One entry per service-type solution page. */
  const SOLUTION_SLUGS = [
    "care-home",
    "domiciliary",
    "supported-living",
    "nursing",
    "forensic",
  ];

  /** One entry per module deep-dive page. */
  const MODULE_SLUGS = [
    "hr",
    "care-plans",
    "recording",
    "charts",
    "reports",
    "family",
    "operations",
    "compliance",
    "wellbeing",
    "insights",
  ];

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));

  const solutionEntries: MetadataRoute.Sitemap = SOLUTION_SLUGS.map((slug) => ({
    url: `${base}/solutions/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const moduleEntries: MetadataRoute.Sitemap = MODULE_SLUGS.map((slug) => ({
    url: `${base}/modules/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...solutionEntries, ...moduleEntries];
}
