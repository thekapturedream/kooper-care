# Kapture Logistics — SEO + free tools setup

Production domain: **https://logistics.thekapture.com**
Google Workspace: **studio@thekapture.com**

This is the operating manual for ranking Kapture Logistics on Google. Every step is free and every tool listed has a generous free tier or no paid plan. Work through it in order — each section assumes the previous step is done.

---

## 1. Vercel domain + DNS

The site is on Vercel. Map the production domain:

1. Vercel → Project `kapture-logistics` → Settings → Domains.
2. Add `logistics.thekapture.com`.
3. Vercel shows DNS records to add. Add them at GoDaddy (Kapture's registrar):
   - `CNAME` for `logistics` → `cname.vercel-dns.com`
4. Wait for green checkmark in Vercel (usually under 5 minutes).
5. In Vercel, set this domain as the **production** domain (button next to it).
6. Once live, set `NEXT_PUBLIC_SITE_URL=https://logistics.thekapture.com` in Vercel env vars and redeploy. The `SITE.url` value in `src/lib/utils.ts` already defaults to this if the env var is missing.

---

## 2. Google Search Console

This is the single most important SEO step.

1. Sign in to https://search.google.com/search-console with `studio@thekapture.com`.
2. Add a property → Domain property → enter `thekapture.com`.
3. Verify via DNS TXT record (covers all subdomains including `logistics.thekapture.com`).
4. Once verified:
   - Go to Sitemaps → submit `https://logistics.thekapture.com/sitemap.xml`.
   - Go to URL Inspection → paste the homepage URL → click "Request indexing".
   - Repeat URL inspection for `/services`, `/careers`, `/state-of-uk-logistics-2026`, `/quote`.

**Optional shortcut for verification on the subdomain only:** copy the verification token from GSC's HTML-tag verification method, and set:

```
NEXT_PUBLIC_GOOGLE_VERIFICATION=<your token here>
```

in Vercel env vars. The `<meta name="google-site-verification">` tag is rendered by `src/app/layout.tsx`. Redeploy and click Verify.

---

## 3. Bing Webmaster Tools

Bing is ~7% of UK search and feeds DuckDuckGo, Yahoo, and ChatGPT browse mode.

1. Sign in to https://www.bing.com/webmasters with `studio@thekapture.com`.
2. Add site → enter `https://logistics.thekapture.com`.
3. Verify via meta tag — set `NEXT_PUBLIC_BING_VERIFICATION=<token>` in Vercel and redeploy.
4. Submit sitemap: `https://logistics.thekapture.com/sitemap.xml`.

---

## 4. Google Analytics 4 (free, unlimited)

Use only when GTM (Section 5) is not configured. If GTM is configured, set up GA4 inside GTM instead — saves duplicate hits.

1. https://analytics.google.com → Admin → Create property.
2. Property name: `Kapture Logistics`. Industry: Transportation & Logistics. Country: United Kingdom.
3. Data stream → Web → enter `https://logistics.thekapture.com`.
4. Copy the Measurement ID (format `G-XXXXXXXXXX`).
5. In Vercel env vars, set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`. Redeploy.

The `Analytics` component in `src/components/Analytics.tsx` only fires GA4 when `NEXT_PUBLIC_GA_ID` is set AND `NEXT_PUBLIC_GTM_ID` is not — so flipping to GTM later doesn't cause double-counting.

---

## 5. Google Tag Manager (recommended over raw GA4)

GTM is the long-term right answer because it lets you add LinkedIn Insight, Meta Pixel, conversion events, and A/B testing without code changes.

1. https://tagmanager.google.com → Create account → Container name `Kapture Logistics`. Target platform: Web.
2. Copy the Container ID (format `GTM-XXXXXXX`).
3. In Vercel env vars, set `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`. Redeploy.
4. Inside GTM:
   - Add a Google Analytics 4 Configuration tag → use your GA4 Measurement ID.
   - Trigger: All Pages.
   - Publish the workspace.
5. Verify in GA4 Realtime that hits arrive.

---

## 6. Microsoft Clarity (free heatmaps + session recordings)

Heatmaps + scroll maps + actual session recordings. Free, unlimited. Single best free tool for understanding what users actually do on the site.

1. https://clarity.microsoft.com → Sign in with `studio@thekapture.com` → New project.
2. Name: `Kapture Logistics`. Website: `https://logistics.thekapture.com`. Category: B2B / SaaS.
3. Skip the manual install — copy the project ID (last segment of the Clarity dashboard URL).
4. In Vercel env vars, set `NEXT_PUBLIC_CLARITY_ID=<project id>`. Redeploy.
5. Open the live site, navigate around. Within 2 hours, recordings appear in the Clarity dashboard.

---

## 7. HubSpot CRM (free forever, contact storage + lifecycle)

The free CRM tier accepts unlimited contacts, unlimited form submissions, and gives you a clean interface to manage every lead from the Kapture Logistics site.

1. https://www.hubspot.com → Get HubSpot CRM free → sign up with `studio@thekapture.com`.
2. Skip onboarding — go straight to Settings → Account Setup → Account Defaults. Note the **Hub ID / Portal ID** (numeric, top right).
3. Marketing → Forms → Create form → Embedded form → Blank.
4. Form name: `Kapture Logistics — Default lead`. Add fields: Email, First name, Last name, Phone, Company, Website, Industry, City, Zip, Message. Save → Publish.
5. After publish, click `<>` Embed code to find the form GUID (the long UUID string in the embed code).
6. Repeat steps 3–5 to create separate forms for `Quote`, `Newsletter`, `Careers`, `Contact` if you want department-level routing.
7. In Vercel env vars:

   ```
   HUBSPOT_PORTAL_ID=<numeric portal id>
   HUBSPOT_FORM_ID_DEFAULT=<default form GUID>
   HUBSPOT_FORM_ID_QUOTE=<quote form GUID, optional>
   HUBSPOT_FORM_ID_CONTACT=<contact form GUID, optional>
   HUBSPOT_FORM_ID_NEWSLETTER=<newsletter form GUID, optional>
   HUBSPOT_FORM_ID_CAREERS=<careers form GUID, optional>
   ```

8. Redeploy. Submit a test contact form on the live site. Within 30 seconds the contact appears in HubSpot Contacts. The `pushToHubSpot()` function in `src/app/api/lead/route.ts` handles the push.

---

## 8. Resend transactional email (already wired)

The studio inbox notification path is already running through Resend. Just confirm:

```
RESEND_API_KEY=<your live key>
RESEND_FROM_EMAIL=Kapture Logistics <onboarding@resend.dev>   # or your verified domain
KAPTURE_LEAD_NOTIFY_EMAIL=studio@thekapture.com
```

Once `thekapture.com` is verified inside Resend, switch `RESEND_FROM_EMAIL` to `Kapture Logistics <studio@thekapture.com>` so emails come from your branded address rather than the sandbox sender.

---

## 9. Open Graph image

Replace the placeholder `/public/og-image.png` (1200×630) with a real Kapture-branded social card. Tools that auto-generate this for free:

- https://og-playground.vercel.app — generate from JSX, download the PNG.
- https://www.bannerbear.com/free-online-tool/og-image-generator/ — quick template.

Drop the file at `public/og-image.png`. The reference is already wired in `src/app/layout.tsx` (`SITE.ogImage`).

For the State of UK Logistics report, also drop `public/og-state-of-uk.png` (1200×630).

---

## 10. Robots & sitemap — already shipped

Live URLs once deployed:

- `https://logistics.thekapture.com/sitemap.xml`
- `https://logistics.thekapture.com/robots.txt`
- `https://logistics.thekapture.com/manifest.webmanifest`

The sitemap is regenerated at every build from `src/app/sitemap.ts` — adding a new role to `src/lib/roles.ts` automatically inserts both `/careers/<slug>` and `/careers/apply/<slug>` into the sitemap on next deploy.

The `robots.txt` explicitly allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended` — Kapture wants to be cited in AI answers for queries like "best UK logistics website templates" because that's the discovery channel for the next 18 months.

---

## 11. Structured data — already shipped

The site renders the following JSON-LD schemas (via `src/components/StructuredData.tsx`):

- **Organization** + **WebSite** — every page (sitewide). Drives the brand knowledge panel and sitelinks search box in SERP.
- **JobPosting** — every `/careers/<slug>` page. Surfaces the role inside the dedicated Google Jobs panel above traditional results. The single biggest SEO win for the careers system.
- **Article** — `/state-of-uk-logistics-2026`. Drives the Article rich result with publish date and author.
- **Service** — `/services`. Drives service offering listings.
- **LocalBusiness** — `/contact`. Drives local-pack visibility for UK searches like "logistics partner London".
- **BreadcrumbList** — every nested page. Replaces the URL with breadcrumbs in SERP.

Validate everything in Google's Rich Results Test:
https://search.google.com/test/rich-results

Paste any production URL and confirm the schema is detected and valid.

---

## 12. Free SEO audit tools (run weekly)

Once the site is live, sign up for these (all free):

- **Ahrefs Webmaster Tools (free)** — https://ahrefs.com/webmaster-tools — crawl errors, broken links, full backlink graph.
- **PageSpeed Insights** — https://pagespeed.web.dev — Core Web Vitals.
- **Lighthouse CI** — built into Chrome DevTools, runs LCP/FID/CLS locally.
- **Schema Markup Validator** — https://validator.schema.org — validates the JSON-LD you ship.
- **Google Rich Results Test** — https://search.google.com/test/rich-results — confirms job postings, articles, etc. appear in rich results.
- **Mobile-Friendly Test** — https://search.google.com/test/mobile-friendly — should pass automatically given the mobile-first layout.

---

## 13. Off-site SEO — the part that actually drives rank

Structured data and a clean site are the floor. The ceiling is backlinks. Quickest free wins:

1. **Crunchbase** — claim/create the Kapture Studio profile, link to logistics.thekapture.com.
2. **LinkedIn company page** — already exists; add the website URL.
3. **G2 / Capterra / TrustRadius** — list Kapture Logistics under "Logistics Software" and "Transportation Management". Free listings give a do-follow link.
4. **GitHub README** — add a `Live Demo` badge that links to logistics.thekapture.com from the public template repo.
5. **ProductHunt** — launch the Kapture Logistics template. One day of attention + a permanent backlink.
6. **Reddit, IndieHackers, HN Show** — share the State of UK Logistics report. Each one is a high-authority backlink + traffic.
7. **Guest posts on logistics blogs** — Logistics UK, FreightWaves, The Loadstar — pitch a 1500-word piece on the AI thesis from the report. Each accepted post = one or two do-follow links.

---

## 14. Content cadence — what keeps you ranking

Google rewards freshness. Plan:

- **Monthly**: Add one new role to `/careers` (one new JobPosting schema per month is a strong signal).
- **Monthly**: Update the State of UK Logistics report with one new data point + bump `dateModified`.
- **Weekly**: Publish one article on `/insights/<slug>` (route not built yet — add it as a future task).
- **Bi-weekly**: Repost the State of UK Logistics findings on LinkedIn from the studio account, linking back.

---

## 15. Env vars — the master list

Set these in Vercel → Project → Settings → Environment Variables. Production scope.

```
# Site
NEXT_PUBLIC_SITE_URL=https://logistics.thekapture.com
NEXT_PUBLIC_PARENT_BRAND_URL=https://thekapture.com

# Search engines
NEXT_PUBLIC_GOOGLE_VERIFICATION=<from GSC>
NEXT_PUBLIC_BING_VERIFICATION=<from Bing Webmaster>

# Analytics (set GTM_ID OR GA_ID, not both)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=<clarity project id>

# Optional — privacy-first analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=logistics.thekapture.com

# CRM
HUBSPOT_PORTAL_ID=<numeric>
HUBSPOT_FORM_ID_DEFAULT=<UUID>
HUBSPOT_FORM_ID_QUOTE=<UUID>     # optional
HUBSPOT_FORM_ID_CONTACT=<UUID>   # optional
HUBSPOT_FORM_ID_NEWSLETTER=<UUID> # optional
HUBSPOT_FORM_ID_CAREERS=<UUID>   # optional

# Email (already configured)
RESEND_API_KEY=<resend key>
RESEND_FROM_EMAIL=Kapture Logistics <onboarding@resend.dev>
KAPTURE_LEAD_NOTIFY_EMAIL=studio@thekapture.com

# Lead webhook (optional fan-out — Make.com etc.)
KAPTURE_LEAD_WEBHOOK_URL=<optional URL>

# Booking
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/kapture/discovery
```

---

## 16. Day-1 verification checklist

After the first deploy on the live domain, verify:

- [ ] `https://logistics.thekapture.com` returns HTTP 200 with full HTML.
- [ ] `https://logistics.thekapture.com/sitemap.xml` returns valid XML and lists every page.
- [ ] `https://logistics.thekapture.com/robots.txt` references the sitemap.
- [ ] View source on the homepage → confirm `<meta property="og:image">`, `<meta name="twitter:card">`, `<link rel="canonical">`, and the Organization + WebSite JSON-LD blocks are present.
- [ ] Run https://search.google.com/test/rich-results on `/careers/hgv-class-1-driver` → confirm `JobPosting` is detected.
- [ ] Run the same test on `/state-of-uk-logistics-2026` → confirm `Article` is detected.
- [ ] Submit a test lead from `/contact` → email lands in `studio@thekapture.com` AND contact appears in HubSpot.
- [ ] Open Microsoft Clarity → confirm at least one session is recorded.
- [ ] Submit `sitemap.xml` in Google Search Console → return 24 hours later and confirm pages are being crawled.

When all 8 are green, the SEO foundation is live. Backlinks (Section 13) are the next lever.
