# Notion CRM — Kapture Logistics

> 30-minute setup. Replaces what would otherwise be a £80/mo HubSpot bill. Built for the audit-first sales motion.

---

## Why Notion (not HubSpot, not Airtable, not Pipedrive)

- **Free** for unlimited content + small teams
- **Same tool** Acie already uses — no context-switch tax
- **API-first** — every property scriptable via Make.com later
- **Public sharing** — pipeline view can be shared with investors / partners read-only

---

## Architecture

Three databases, linked together.

```
COMPANIES (Brands we audit + sell to)
   ↓ relation
CONTACTS (named decision-makers at those companies)
   ↓ relation  
DEALS (active sales opportunities)
```

A 4th database (`AUDITS`) links to Companies and tracks delivered Kurongeka scorecards.

---

## Database 1 — `Companies`

### Properties

| Property | Type | Options / notes |
|---|---|---|
| Name | Title | Company legal name |
| Website | URL | |
| Logo | Files | Drop their logo here |
| Companies House # | Text | |
| Sector | Multi-select | Freight forwarder, Road haulage, 3PL, Warehousing, Last-mile, Customs, Courier, Cold chain, Project cargo, Other |
| HQ city | Select | London, Manchester, Birmingham, Felixstowe, Hull, Liverpool, Glasgow, Belfast, Edinburgh, Cardiff, Bristol, Other |
| Country | Select | UK, EU, US, Africa, Asia, Other |
| Employees | Number | |
| Turnover band | Select | <£1M, £1-5M, £5-15M, £15-50M, £50M+ |
| Trade body | Multi-select | Logistics UK, BIFA, RHA, UKWA, CILT, none |
| Source | Select | Companies House, BIFA, LinkedIn Nav, GMB, Referral, Inbound, Trade event, Press |
| Audit score | Number | 0-100 — populated from latest Kurongeka audit |
| Audit URL | URL | Public dashboard |
| Status | Select | New · Audited · Contacted · Replied · Booked · Disqualified · Won · Lost · Nurture |
| Priority | Select | A (audit + outreach this week) · B (this month) · C (eventually) |
| Notes | Long text | Buying signals, context, competitor wins they've lost, etc. |
| Created | Created time | Auto |
| Last touch | Last edited time | Auto |
| Owner | Person | Assigned Kapture operator |

### Views

1. **All — Status Kanban** (default)
   - Group by Status
   - Card preview: Logo, Name, Audit score, City
   - Filter: hide *Disqualified* and *Lost*

2. **Hot — A priority** 
   - Filter: Priority = A
   - Sort: Audit score ascending (lowest scores = highest pain = warmest leads)

3. **By Sector** (for content angles)
   - Group by Sector
   - Filter: Status ≠ Disqualified

4. **By City** (for programmatic SEO content alignment)
   - Group by HQ city
   - For each city we have a programmatic page → match prospects to pages

5. **Pipeline value**
   - Filter: Status = Booked or Replied or Won
   - Show count + roll-up

---

## Database 2 — `Contacts`

### Properties

| Property | Type | Options / notes |
|---|---|---|
| Name | Title | Full name |
| Title | Text | MD, Director, Head of Marketing, Operations Manager, Founder |
| Company | Relation → Companies | |
| Email | Email | |
| Phone | Phone | |
| LinkedIn | URL | |
| Decision-maker level | Select | Founder/MD · Senior leader · Marketing/operations · Influencer · Unknown |
| Linkedin first touched | Date | |
| Email first touched | Date | |
| Reply received | Checkbox | |
| Channels tried | Multi-select | LinkedIn · Email · WhatsApp · Phone · In-person |
| Personality notes | Long text | "Direct", "Wants stats", "Talks football", etc. |
| Created | Created time | Auto |

### Views

1. **All contacts — by Company** (default)
   - Group by Company
   - Sort by Decision-maker level

2. **Today's outbound queue**
   - Filter: LinkedIn first touched is empty OR (Reply received = false AND last touch > 3 days ago)
   - Sort: random — so we don't always touch the same people first

3. **Replied** 
   - Filter: Reply received = true
   - This is the warm queue; daily check.

---

## Database 3 — `Deals`

### Properties

| Property | Type | Options / notes |
|---|---|---|
| Name | Title | "Company Name — Tier" |
| Company | Relation → Companies | |
| Primary contact | Relation → Contacts | |
| Tier | Select | Deploy £2,500 · Brand £5,000 · Studio £8,500 · Custom (specify) |
| Value (£) | Number | |
| Stage | Select | Discovery scheduled · Discovery held · Proposal sent · Verbal yes · Deposit paid · Onboarding · Live · Won · Lost |
| Expected close | Date | |
| Discovery call recording | URL | Loom / Calendly recording |
| Proposal | URL / Files | Notion doc or PDF |
| Stripe link sent | Checkbox | |
| Deposit paid | Checkbox | |
| Final paid | Checkbox | |
| Site live URL | URL | After T+24 |
| Lost reason | Select | Price · Timing · Competitor · No response · Other |
| Created | Created time | Auto |
| Last touch | Last edited time | Auto |
| Owner | Person | |

### Views

1. **Deals Kanban** (default)
   - Group by Stage
   - Filter: hide Won (older than 90 days) and Lost
   - Card preview: Name, Tier, Value

2. **Pipeline by value**
   - Group by Stage
   - Sum value per group
   - Sort by Expected close

3. **This week's revenue**
   - Filter: Deposit paid (this week) OR Final paid (this week)
   - Sum: Value
   - Used in Friday metrics review

---

## Database 4 — `Audits` (Kurongeka deliveries)

### Properties

| Property | Type | Options / notes |
|---|---|---|
| Name | Title | "Company Name — YYYY-MM-DD" |
| Company | Relation → Companies | |
| Score | Number | 0-100 |
| Grade | Formula | Based on score: A 85+, B 70-84, C 55-69, D 40-54, F <40 |
| Domain Health | Number | 0-100 |
| Digital Presence | Number | 0-100 |
| Visual Identity | Number | 0-100 |
| Brand Voice | Number | 0-100 |
| Messaging | Number | 0-100 |
| SEO & AEO | Number | 0-100 |
| Content Velocity | Number | 0-100 |
| Competitive Position | Number | 0-100 |
| Trust Signals | Number | 0-100 |
| Public dashboard URL | URL | |
| Delivered date | Date | |
| Delivered to | Relation → Contacts | |
| Reply received | Checkbox | |
| Converted to call | Checkbox | |
| Notes | Long text | |
| Created | Created time | Auto |

### Views

1. **All audits — by date**
   - Default — newest first

2. **Conversion analysis**
   - Group by Reply received → Converted to call
   - Reveals which scores convert best (hint: 40-69 range is the sweet spot)

3. **By score**
   - Sort: Score ascending
   - Lowest scores = most fixable = warmest leads

---

## Step-by-step setup (30 minutes)

### Minutes 0-5 — Workspace
1. Open Notion → Create a new page → name it `Kapture Sales`
2. Inside, create 4 sub-pages: `Companies`, `Contacts`, `Deals`, `Audits`

### Minutes 5-12 — Companies database
1. Open `Companies` page → / → Database — Table → New
2. Add the 18 properties above
3. Right-click table → Add view → Board → Status (this is your Kanban)
4. Add 3 more views (Hot, By Sector, Pipeline)

### Minutes 12-18 — Contacts + Deals + Audits
Same pattern. Use the property tables above as exact specs.

### Minutes 18-25 — Add the 5 Status options + relations
- In `Contacts`, the Company property must relate to `Companies`
- In `Deals`, both Company and Primary contact relations
- In `Audits`, Company + Delivered to relations

### Minutes 25-30 — Polish + import seed data
1. Import the 50 prospects from your Day-1 list-build
2. Tag everyone Status = `New`, Priority = `A`
3. Pick 5 — start audits today

---

## Daily ritual (10 minutes, every morning)

1. Open `Companies → Hot — A priority` view
2. Pick the top 5 with no audit yet → audit them today
3. Open `Contacts → Today's outbound queue` → take next 30
4. Open `Deals Kanban` → confirm every Discovery scheduled has a Calendly invite
5. Move yesterday's wins to Won; close stale deals after 30 days no-touch

---

## Weekly ritual (30 minutes, Friday afternoon)

1. Pipeline screenshot → paste into the Friday LinkedIn carousel ("This week in numbers")
2. Sum: total cash collected this week
3. Identify top 1 source of new audits → double down next week
4. Identify top 1 source of new replies → double down on outreach copy that worked
5. Identify any deal stuck in same Stage > 7 days → one-touch revival email

---

## Make.com automations to add by month 2

### Automation 1 — *Calendly booked → Notion Deal created*
- Trigger: New Calendly event
- Action: Create row in `Deals` table
  - Stage = Discovery scheduled
  - Primary contact = lookup or create in Contacts
  - Value = £5,000 default (most common tier)

### Automation 2 — *Stripe payment → Deal status update*
- Trigger: Stripe checkout.session.completed
- Action: Update Deal where Stripe link sent = true
  - Stage = Onboarding
  - Deposit paid = true
- Action: Send Slack ping to studio channel

### Automation 3 — *7 days no touch → Acie reminder*
- Trigger: Daily at 9am UK
- Filter: Deals where Stage = Discovery held AND last touch > 7 days
- Action: Email Acie with the list

### Automation 4 — *Audit delivered → Email enrichment*
- Trigger: New row in Audits where Reply received = false (after 5 days)
- Action: Email the contact follow-up #2 (script in 02_OUTBOUND_PLAYBOOK.md)

---

## What goes WHERE — quick reference

| Question | Database |
|---|---|
| "Did we audit this brand?" | Companies → search name |
| "What's our pipeline value this month?" | Deals → Pipeline by value view |
| "Who haven't I touched on LinkedIn yet?" | Contacts → Today's outbound queue |
| "What did we send last to {brand}?" | Companies → click in → look at Notes + linked Deal |
| "Who replied this week?" | Contacts → Replied view |
| "What's our audit-to-reply rate?" | Audits → Conversion analysis view |

---

## Naming conventions (so the team stays in lockstep)

- Company names: legal name as on Companies House — *"Walker Logistics Ltd"* not *"Walker Logistics"*
- Contact names: *"FirstName LastName"* — never first names alone
- Deal names: *"Walker Logistics — Brand"* — Company + Tier
- Audit names: *"Walker Logistics — 2026-05-13"* — Company + delivery date

This consistency lets you find anything in two clicks.

---

## Templates Notion supports natively

For each Deal, attach a Notion page with these sections (template):

```
# {Deal Name}

## The brief
- What they want
- What they have now
- What they don't want

## Audit summary
[link to the Kurongeka dashboard]
- Score: {X}/100
- Top 3 issues:

## Discovery call notes
- Date:
- Attendees:
- Decisions:
- Objections raised:
- Next step:

## Proposal
- Tier:
- Custom inclusions:
- Total: £
- Payment plan:
- Expected go-live:

## Brand brief
- Colours:
- Fonts:
- Photography direction:
- Sample sites they like:
- Domain:
- Hosting credentials:

## Build progress
- T+0: brief locked
- T+6: branded
- T+18: deployed
- T+24: handover

## Handover
- Repo URL:
- Vercel project URL:
- Supabase project ID:
- Loom training video:
- 30-day support window expires:
```

Save this as a *Deal template* in Notion. Every new deal gets the template auto-applied — every operator handles deals identically. Quality compounds.

---

*The CRM is the central nervous system. Everything Kapture knows about every prospect lives here. Build it once, maintain it daily, scale it forever.*
