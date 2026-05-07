import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

/**
 * Web App Manifest — exposed at /manifest.webmanifest.
 *
 * Makes the site installable on mobile (Add to Home Screen on iOS,
 * Install App on Android Chrome). PWA install is a positive signal in
 * Lighthouse and a small ranking nudge in Google's mobile-first index.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Kapture",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#FFD400",
    lang: SITE.locale,
    orientation: "portrait",
    // Next 14's TS types restrict `purpose` to a single enum value rather
    // than the space-separated form the Web App Manifest spec allows
    // ("any maskable"). Split into one entry per purpose to satisfy the
    // type checker — install handlers merge the two by src+sizes anyway.
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["business", "productivity", "logistics", "transportation"],
  };
}
