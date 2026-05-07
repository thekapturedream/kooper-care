import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

/**
 * robots.txt — generated at /robots.txt automatically by Next.js.
 *
 * Google + Bing + DuckDuckGo + Yandex will all read this and follow the
 * rules. The sitemap reference is the single most important line — every
 * crawler uses it as the seed for discovery.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");

  return {
    rules: [
      {
        // Default — every well-behaved bot can crawl every public page.
        userAgent: "*",
        allow: "/",
        // Block server-only and admin-style routes from indexing. Note
        // these never had backing pages, but the disallow keeps crawlers
        // from wasting budget probing them and surfaces a clean robots
        // policy in third-party SEO audits.
        disallow: ["/api/", "/_next/", "/admin/"],
      },
      {
        // Allow Googlebot-Image to fetch every public image — important
        // for hero video poster, OG image, and Unsplash background hits.
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        // GPTBot, ClaudeBot, etc. — opt in. We WANT to be cited in AI
        // answers for queries like "best UK logistics website templates"
        // because that's the discovery channel for the next 18 months.
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
