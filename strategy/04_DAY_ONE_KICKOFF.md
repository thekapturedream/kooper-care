# Day-1 Kickoff — Kapture Logistics

> Print this. Tape it to the desk. Tomorrow morning, 8am UK, work top to bottom. By Friday afternoon you have your first paying client.

---

## Before 9am Monday — set up the rails (60 mins)

☐ **Buy domain** — `kapture-logistics.com` (or `.co.uk` — both ideally) at GoDaddy. £10/year.

☐ **Point domain at Vercel** — Vercel project → Settings → Domains → Add → paste DNS records into GoDaddy.

☐ **Verify thekapture.com in Resend** — login to resend.com → Domains → Add → grab 3 DNS records (SPF, DKIM, return-path) → paste into GoDaddy DNS. Wait 30 mins → click Verify.

☐ **Update env in Vercel** — change `RESEND_FROM_EMAIL` to `Kapture Studio <studio@thekapture.com>` once domain is verified.

☐ **Calendly** — sign in with the Google account that owns Kapture's Google Calendar → create *Discovery Call · 15 min* event → Google Meet location → copy URL → paste into Vercel as `NEXT_PUBLIC_CALENDLY_URL` → redeploy.

☐ **Stripe Payment Links** — create 3 products in Stripe dashboard:
1. *Kapture Logistics — Deploy* — £2,500 GBP, one-off, payment link
2. *Kapture Logistics — Brand* — £5,000 GBP, one-off
3. *Kapture Logistics — Studio* — £8,500 GBP, one-off
Save the 3 links somewhere accessible (Notion, Apple Notes).

☐ **Google Search Console** — add kapture-logistics.com → verify via DNS TXT → request indexing on /, /services, /quote, /case-study/kapture.

☐ **Google Analytics 4** — create property → paste measurement ID into the site (one-line addition to layout.tsx).

---

## 9am-10am — write Monday's LinkedIn post

☐ Hook line, 5 short paragraphs, 1 image (the Kapture Logistics demo screenshot), close with: *"DM me 'AUDIT' and we'll grade your logistics website free this week."*

**Template to start with:**

> Most UK logistics websites are losing tenders before the meeting even happens.
>
> We just shipped Kapture Logistics — a deployable software product, not a custom build. Branded for the buyer, live in 24 hours, repo handed over.
>
> 4-second mobile load time. Quote calculator wired to Supabase. Vercel hosted. Light + dark mode. Yours, not rented.
>
> Demo lives at kapture-logistics.com. Built it for ourselves, will build it for you for a fraction of agency rates.
>
> First 10 takers this week get a free brand audit too.
>
> DM me *AUDIT* if you want yours scored.

Post at 9:15am UK. Reply to every comment within 30 mins for the first 4 hours.

---

## 10am-12pm — list-build the first 50 prospects

☐ Open Companies House → search SIC 49410 → filter active → export 200 freight firms in UK
☐ Open BIFA member directory → copy 50 freight forwarders into Notion CRM
☐ Open LinkedIn → Sales Navigator free trial → search UK + Logistics & Supply Chain + 11-50 employees → save 100 named decision-makers
☐ De-duplicate, prioritise by city (London + Felixstowe + Hull + Manchester + Birmingham first)

**Goal by lunch:** 50 prospects in Notion CRM with company name, MD/founder name, LinkedIn, email (or domain to find email later).

---

## 12pm-1pm — the audit funnel goes live

☐ Pick the first 5 of those 50 prospects
☐ Run the Kurongeka audit on each (mock for now if Kurongeka isn't fully wired — score them by hand against the 9-dimension framework)
☐ Build the audit dashboard for each on a public URL (`/case-study/{client-slug}` pattern, copy from the existing Kapture audit)
☐ Email each: see [06_FIRST_10_AUDITS.md](06_FIRST_10_AUDITS.md) for the exact templates

---

## 1pm-3pm — the high-leverage move

☐ **Pitch Logistics UK partnership.** Their Head of Member Engagement — find on the about/team page. Email subject: *Free digital health check for Logistics UK members*. Use the script in `02_OUTBOUND_PLAYBOOK.md` § 6. Send by 2pm.

☐ **Pitch BIFA + RHA + UKWA** with the same script (one each, customised opening). Send by 3pm.

**One of these four lands** — that's the 50 audits / quarter free distribution channel.

---

## 3pm-5pm — outbound shift

☐ 30 LinkedIn connection requests sent (use the connect-no-pitch script)
☐ 10 cold emails sent (audit drop subject line)
☐ 5 audits delivered to inboxes (with public dashboard links)

---

## 5pm-6pm — content prep for tomorrow

☐ Record one 8-min Loom: *"What we look for when we audit a logistics website"* — walk through the Kurongeka 9 dimensions on the Schneider site or a real prospect. Post on YouTube + LinkedIn tomorrow at 9am.

☐ Draft Tuesday's LinkedIn post — pick a competitor brand, audit them, post the score with screenshots.

☐ Update Notion CRM — every status moved, every reply logged.

---

## End-of-day Day-1 metrics

| Action | Target |
|---|---|
| Prospects in CRM | 50 |
| Audits delivered | 5 |
| LinkedIn connection requests | 30 |
| Cold emails sent | 10 |
| Trade body pitches sent | 4 |
| Calls booked from outbound | 0-1 (yes really, don't expect more on day 1) |
| LinkedIn post live | 1 |
| Calendly tested + Resend verified | yes |
| Stripe links live | yes |

---

## Friday morning — first close

By Friday morning the typical conversion math says:

- Of 30 LinkedIn requests sent Monday, 10 accepted by mid-week
- Of those 10, 3 reply to follow-up
- Of those 3, 1 books a discovery call
- Of 5 audits delivered Monday, 1 replies "interested"
- Of trade body pitches, 0-1 reply by Friday (bigger orgs are slow)

**Realistic Friday outcome:** 1-2 discovery calls held, 1 verbal yes, deposit collected by following Tuesday.

By **end of week 2**, you've shipped the first paid deployment. By **end of month 1**, you've shipped 3.

---

## The mantra

Every outbound message has to do ONE of three things:
1. **Surprise them** with a gift (the audit)
2. **Show them up** with a number (their score, their loading time, their missing schema)
3. **Earn the call** with brevity (under 90 words)

Never sell the template in cold outbound. Sell the audit, hand over the dashboard, let the demo close itself.

---

## When you get stuck

| Situation | Response |
|---|---|
| Inbox empty by 11am | List-build harder. Add 50 more prospects. Volume fixes most things. |
| Audit replies are "no thanks" | Don't argue. Reply with: *"Cheers — leaving the dashboard live for 30 days at {url} in case it's useful later."* — then move on. |
| Trade body says "not the right fit" | Pivot to feature-pitch. *"Happy to sponsor your next webinar / conference / member event with this report."* |
| First call goes badly | Listen 80% of the time. Ask: *"What does a great website mean to you?"* Then echo their words back in the proposal. |
| First close objects on price | *"What's it costing you per month not to fix this?"* — not adversarial, genuinely curious. They tell you ROI, you confirm price is fair. |

---

## The full week

**Monday:** Setup + 5 audits + 1 post + 4 partnership pitches  
**Tuesday:** 5 audits + 1 post + 30 LinkedIn touches + first replies in  
**Wednesday:** First discovery call ideally held + 5 audits + 1 post  
**Thursday:** 5 audits + first proposal sent + 30 LinkedIn touches  
**Friday:** Close week: tally numbers, pay invoices, send weekly newsletter, prep weekend recovery

**By Sunday evening,** review the [02_OUTBOUND_PLAYBOOK.md](02_OUTBOUND_PLAYBOOK.md) numbers — what worked, what didn't, what to double down on next week.

Same loop, week 2, week 3, week 4. By end of month 1: **3 paying clients shipped. £15K cash collected. 50 audits delivered. Logistics UK partnership in motion. First case study live.**

That's how the inevitability compounds.
