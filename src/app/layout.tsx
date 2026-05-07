import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import { SITE } from "@/lib/utils";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

/**
 * Site-wide metadata. Page-level metadata layered on top via per-route
 * `export const metadata`. The metadata object below resolves to the
 * complete `<head>` set on every page that doesn't override.
 *
 * SEO checklist covered here:
 *   · Title template + default
 *   · Meta description (≤160 chars)
 *   · Canonical URL (per-page can override)
 *   · Robots indexing rules + Googlebot extras (image preview, snippet)
 *   · Open Graph (Facebook, LinkedIn, WhatsApp, Slack)
 *   · Twitter Card (summary_large_image)
 *   · hreflang en-GB
 *   · App icons + theme color (PWA install prep)
 *   · Verification tokens (env-driven for GSC + Bing)
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  category: "Health & Care Software",
  keywords: [
    "care management software UK",
    "digital care planning",
    "modular care software",
    "CQC software",
    "NHS DSPT care system",
    "care home software",
    "domiciliary care app",
    "supported living platform",
    "electronic care record",
    "voice-first care notes",
    "Kapture Care",
    "Kapture Studio",
    "PCS alternative",
    "Nourish alternative",
    "Log my Care alternative",
  ],
  authors: [{ name: SITE.parent, url: SITE.parentUrl }],
  creator: SITE.parent,
  publisher: SITE.legalName,
  alternates: {
    canonical: SITE.url,
    languages: {
      "en-GB": SITE.url,
      "x-default": SITE.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.social.twitter,
    creator: SITE.social.twitter,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set NEXT_PUBLIC_GOOGLE_VERIFICATION + NEXT_PUBLIC_BING_VERIFICATION
  // in Vercel env once the GSC and Bing properties are added. These render
  // the corresponding <meta name="google-site-verification"> tags so the
  // verification step in GSC/Bing succeeds without DNS round trips.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={SITE.locale}
      suppressHydrationWarning
      // First paint is always dark — `dark` class is on the html element
      // before next-themes hydrates, so even slow/stored-preference loads
      // never flash light. ThemeProvider takes over after hydration.
      className={`dark ${sans.variable} ${display.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        {/* DNS-prefetch + preconnect for the third-party origins we KNOW
            we'll hit on every page. Saves the TLS handshake before the
            actual fetch fires. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
      </head>
      <body className="min-h-screen bg-white font-sans text-kapture-black antialiased dark:bg-kapture-black dark:text-kapture-white">
        {/* Site-wide JSON-LD — Organization + WebSite (with SearchAction)
            give Google the canonical brand entity and enable a sitelinks
            search box in SERP results. Per-page schemas (Article,
            JobPosting, BreadcrumbList) layer on top. */}
        <OrganizationSchema />
        <WebSiteSchema />

        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] pt-16">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* Analytics — fires only when the corresponding env var is set.
            Keeps preview deployments and local dev clean of tracking. */}
        <Analytics />
      </body>
    </html>
  );
}
