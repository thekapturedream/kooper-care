# Kapture Care

Modular care management software, built around HR. A production-ready Next.js 14 + Tailwind + Supabase product, ready to ship to Vercel.

> Log in once. The platform knows your role, your residents, your shift, your tools. Pick the modules your service needs. Skip the rest. Pay for what you use.

---

## What this repo is

Kapture Care is a pre-built modular care management system designed to replace the dated UK incumbents (Person Centred Software / mCare, Nourish, Log my Care, CareDocs).

**Architecture:** HR is the spine. Every login pulls user role, shift, residents in scope, training status, and access privileges. Nine opt-in modules layer on top — each works standalone, every combination integrates.

| # | Module | Required | Per-resident / month |
|---|---|---|---|
| 01 | **HR** (the spine) | Yes | £2.40 |
| 02 | Care Plans | No | £1.20 |
| 03 | Recording (voice-first) | No | £0.80 |
| 04 | Charts (22 clinical) | No | £0.60 |
| 05 | Reports | No | £0.50 |
| 06 | Family (PWA gateway) | No | £0.40 |
| 07 | Operations | No | £0.50 |
| 08 | Compliance | No | £0.50 |
| 09 | Wellbeing | No | £0.40 |
| 10 | Insights (AI) | No | £0.80 |

Volume discounts above 100 residents. NHS-block contracts on application.

---

## Stack

- **Framework:** Next.js 14 App Router, TypeScript strict
- **Styling:** Tailwind CSS, shadcn primitives, custom Kapture component library (`btn-kapture`, `chip-kapture`, etc.)
- **Auth:** Supabase Auth (PKCE OAuth, magic links, optional WebAuthn)
- **Database:** Supabase Postgres with row-level security
- **Storage:** Supabase Storage for photos, voice notes, exports
- **AI:** Claude Sonnet for note structuring + insights, Whisper for voice-to-text
- **Hosting:** Vercel (Edge functions for read-heavy paths)
- **Analytics:** PostHog
- **Errors:** Sentry

---

## Quickstart

```bash
# 1. Install
npm install

# 2. Wire up environment
cp .env.local.example .env.local
# Then edit .env.local with your Supabase + Vercel keys

# 3. Run dev
npm run dev

# 4. Build + ship
npm run build
vercel deploy --prod
```

---

## Brand chrome

- **Logomark:** `KaptureSun` component — 8 dots with the top-right intercardinal in `#FFD400` Kapture yellow. Imported as `<KaptureSun size={28} className="text-kapture-black" />`. Use `currentColor` for the body.
- **Wordmark:** `kapture · care` — lowercase, dot separator, Space Grotesk display font. Semibold "kapture" + medium "care" + muted dot. Never `Kapture Care` or `KaptureCare`.
- **Palette:** Black (`#0A0A0A`) + neutral scale + Yellow (`#FFD400`) accent + 4-state status layer (critical / warning / ok / neutral).
- **Fonts:** Inter (body), Space Grotesk (display), JetBrains Mono (numbers).

Brand DNA — never invent new tokens. Lift from `tailwind.config.ts` and `globals.css`.

---

## Structure

```
src/
  app/
    page.tsx                  # Homepage (Hero → ComplianceMarquee → ValueProp → BentoModules → Stats → OnTheGround → SolutionsGrid → HowItWorks → CTA)
    layout.tsx                # Root layout, metadata, fonts, schema
    api/                      # Server routes (lead capture, etc.)
    [marketing pages]
  components/
    KaptureSun.tsx            # Brand logomark
    Navbar.tsx                # Top nav (transparent on hero, solid elsewhere)
    Footer.tsx                # Site-wide footer
    Hero.tsx                  # Login + module-picker mini demo
    ComplianceMarquee.tsx     # Continuous-scroll standards strip
    ValueProp.tsx             # Three-pillar thesis
    BentoModules.tsx          # 10 modules — HR core + 9 opt-in
    Stats.tsx                 # Big-number market context
    OnTheGround.tsx           # Carer / manager / owner testimonials
    SolutionsGrid.tsx         # Five service-type tiles
    HowItWorks.tsx            # 4-step process
    CTA.tsx                   # Final CTA + founders pricing card
  lib/
    utils.ts                  # SITE config + cn() helper
    supabase.ts               # Supabase client
```

Logistics-template legacy files are still on disk (the parent project was forked from `kapture-logistics`). They're not referenced from the homepage. A future cleanup pass will remove them.

---

## Companion documents

- `../PCS-mCare-Audit-Findings.md` — 3,700-word forensic audit of Person Centred Software / mCare (the system this product replaces)
- `../Kapture-Care-Redesign-Brief.md` — 3,400-word redesign brief: IA, screen specs, component primitives, Supabase data model, build phases, compliance checklist
- `../kapture-care-landing.html` — single-file HTML landing page mockup
- `../kapture-care-index.html` — clickable 5-screen prototype (Home / Resident Overview / Care Plan / Voice Note / Reports)

---

## Status

**v0.1 — landing page, marketing surface, brand chrome.** App-side modules (HR, Care Plans, Recording, Charts) build out per the redesign brief Section 9 phase plan.

---

A Kapture Studio Ltd. product · `studio@thekapture.com`
