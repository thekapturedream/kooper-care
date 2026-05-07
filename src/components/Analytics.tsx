import Script from "next/script";

/**
 * Conditional analytics loader.
 *
 * Each tracker fires only when its env var is set, so:
 *   - local dev never sends data
 *   - preview deployments stay clean
 *   - the production deployment is configured by adding the env var in
 *     Vercel without touching any code
 *
 * Trackers wired (all free):
 *   · Google Tag Manager — NEXT_PUBLIC_GTM_ID  ("GTM-XXXXXXX")
 *   · Google Analytics 4 — NEXT_PUBLIC_GA_ID   ("G-XXXXXXXXXX")
 *   · Microsoft Clarity  — NEXT_PUBLIC_CLARITY_ID ("xxxxxxxxxx")
 *   · Plausible (optional) — NEXT_PUBLIC_PLAUSIBLE_DOMAIN (host)
 *
 * GTM is recommended as the first tracker — it lets you add GA4, Meta
 * Pixel, LinkedIn Insight, and conversion pixels later without code
 * changes. If GTM is set, GA4 should typically be configured INSIDE GTM
 * rather than via gtag here, to avoid double-counting.
 */

export function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <>
      {/* ─── Google Tag Manager ────────────────────────────────────── */}
      {gtmId && (
        <>
          <Script id="kapture-gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          {/* Noscript fallback — required by GTM. Renders an iframe even
              when JS is disabled so server-side tagging still works. */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {/* ─── Google Analytics 4 (only if GTM not configured) ──────── */}
      {!gtmId && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="kapture-ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true, send_page_view: true });`}
          </Script>
        </>
      )}

      {/* ─── Microsoft Clarity — heatmaps + session recordings ──── */}
      {clarityId && (
        <Script id="kapture-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      )}

      {/* ─── Plausible (privacy-first, optional) ──────────────────── */}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
