# Ship kooper · care — GitHub + Vercel

The path from this folder on your laptop to a live URL.

The repo bundles two things:

1. **Next.js 14 production app** — TSX components, Supabase HR schema, RBAC, sign-in flow, persona-aware /app dashboard hub, editorial primitives, Care Plans / Clinical / Recording / Resident / Family / Reports as TSX routes.
2. **HTML prototype suite** — twelve kooper · care surfaces shipped as static files in `public/` so they render immediately on Vercel without any build wiring. These are the canonical demo of the kooper · care experience.

Both deploy together.

---

## 0 — Prerequisites

```bash
node --version    # need v18.17 or higher
npm --version     # need v9 or higher
git --version     # any modern version
```

Optional: `gh` (GitHub CLI) and `vercel` CLI for one-line setup.

---

## 1 — Install + smoke-test locally

```bash
cd "/Users/macstore/Documents/Claude/Projects/Kaptire Website Templates/kapture-care"
npm install
npm run dev
```

Open `http://localhost:3000`. The home page redirects to the kooper landing automatically.

| Path | What you'll see |
|---|---|
| `/` | redirects → `/kooper-care-landing.html` |
| `/care-plans` | `/kooper-care-plans.html` (rewrite) |
| `/clinical` | `/kooper-clinical.html` |
| `/recording` | `/kooper-recording-demo.html` |
| `/reports` | `/kooper-reports.html` |
| `/resident` | `/kooper-resident.html` |
| `/family` | `/kooper-family.html` |
| `/hr` | `/kooper-hr.html` (rota + workers + payslips + accounts) |
| `/dashboards` | `/kooper-care-dashboards.html` (12 personas) |
| `/sign-in-demo` | `/kooper-sign-in.html` |
| `/apps` | `/kooper-apps.html` (full 20-app catalogue) |
| `/app-detail?app=clinical` | `/kooper-app.html` (per-app deep-dive) |
| `/app` | post-login Next.js dashboard (requires Supabase connect) |

Hit Ctrl-C to stop. If it ran clean, you're ready to push.

---

## 2 — Initialise + commit

```bash
cd "/Users/macstore/Documents/Claude/Projects/Kaptire Website Templates/kapture-care"
git init
git add .
git commit -m "feat: kooper · care v1 — Next.js + 12 HTML prototypes, Vercel-ready"
```

`.env.local`, `node_modules/`, `.next/`, and `SUPABASE_KEYS.md` are ignored by `.gitignore`.

---

## 3 — Push to GitHub

Two paths. Pick one.

**A. GitHub CLI (one command):**

```bash
gh repo create kooper-care --public --source=. --remote=origin --push
```

**B. Manual (via github.com):**

1. Open [github.com/new](https://github.com/new). Name the repo `kooper-care`. Don't tick "add README" or "add .gitignore" — they exist already.
2. Run:

   ```bash
   git remote add origin git@github.com:<your-handle>/kooper-care.git
   git branch -M main
   git push -u origin main
   ```

---

## 4 — Connect Vercel

The clean path is the dashboard:

1. Open [vercel.com/new](https://vercel.com/new).
2. **Import Git Repository** → pick `kooper-care`.
3. Framework: **Next.js** (auto-detected).
4. Root directory: leave as repo root.
5. Build & Output settings: leave defaults (`npm run build`, `.next`).
6. Environment variables — for the static prototype tour you don't need any. For the Next.js app surface (sign-in flow + /app dashboard) add the Supabase trio:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   NEXT_PUBLIC_SITE_URL=https://kooper-care.vercel.app
   ```

7. Click **Deploy**. First build takes ~90 seconds.

**CLI alternative** (after `vercel login`):

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel --prod
```

---

## 5 — Smoke test on the live URL

After Vercel finishes the deploy:

1. Open the deploy URL (`https://kooper-care.vercel.app` or whatever Vercel assigns).
2. You should land on the kooper · care marketing page.
3. Hit the URLs above (`/care-plans`, `/clinical`, `/hr`, `/recording`, `/reports`, `/resident`, `/family`, `/dashboards`, `/sign-in-demo`, `/apps`). Every one should render.
4. Try the HR rota (`/hr`) — drag a shift, the WTR check should fire. Try the worker view, click the live clock.

If those work, you've shipped kooper · care.

---

## 6 — Iterate live

Every change you push to `main` auto-deploys to production. Branch-based previews work out of the box.

```bash
git checkout -b feat/wire-supabase-care-plans
# make changes
git add .
git commit -m "feat: wire care plans to Supabase"
git push -u origin feat/wire-supabase-care-plans
```

Vercel posts a preview URL in the PR. Merge to `main` → production updates.

---

## 7 — Custom domain

In Vercel: **Project → Settings → Domains**. Point `kooper.care`, `care.thekapture.com`, or whatever else at the project. Vercel handles SSL automatically.

---

## 8 — Optional next steps

- **Stand up Supabase** — needed for the Next.js `/app` dashboard, sign-in, and the future production care plans / recording / reports surfaces. Migration `001_leads.sql` and the HR spine SQL (`002_hr_spine.sql`, `003_demo_seed.sql`) live in `supabase/migrations/`. Connect a Supabase project, run the migrations, paste the keys into Vercel env vars.
- **Wire AI narrative server action** — Anthropic API key into `ANTHROPIC_API_KEY` (server-only, never `NEXT_PUBLIC_*`). The recording flow calls a server action that streams the AI narrative.
- **GP Connect / FHIR R4** — for `kooper · gp-connect`, register an NHS Digital sandbox client. NHS Login flow is separate from Supabase Auth.

For now, `git push` ships changes. Ship a small change, watch it deploy, repeat.
