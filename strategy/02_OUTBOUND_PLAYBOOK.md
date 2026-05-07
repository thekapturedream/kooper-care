# Kapture Logistics — Outbound Playbook

> Free-tier execution. Copy-paste scripts. Daily target: 30 LinkedIn touches + 10 cold emails + 1 partnership pitch + 1 LinkedIn post. Weekly target: 10 booked calls.

---

## 1. Where to find UK logistics buyers (free)

### A. Companies House — the gold mine
- URL: https://find-and-update.company-information.service.gov.uk/
- Search by SIC code:
  - **49410** Freight transport by road
  - **52290** Other transportation support activities (freight forwarders)
  - **53202** Unlicensed carrier
  - **52100** Warehousing and storage
  - **52240** Cargo handling
  - **52219** Other service activities incidental to land transportation
- Filter: Active companies, England + Wales + Scotland + NI
- Export to CSV (manual paging — automate via Apollo or scrape)
- **Result:** ~80,000 active UK logistics-coded companies. Filter to 5-50 employees → ~12,000 candidates

### B. Logistics UK member directory
- URL: https://logistics.org.uk/about/membership
- 18,000+ members, public list
- Use scraper or paste-to-Sheets workflow
- High-intent — they pay association dues, they're growth-minded

### C. BIFA member list
- URL: https://www.bifa.org/find-a-member
- 1,500 freight forwarders — pure-play ICP
- Each entry has phone, email, website, services. Goldmine.

### D. RHA member list
- URL: https://www.rha.uk.net/
- 8,000 hauliers
- Skews larger but still many SMEs

### E. UKWA — UK Warehousing Association
- 800+ warehousing operators
- More niche but pure ICP

### F. LinkedIn Sales Navigator (1-month free trial)
- Filters: UK + Logistics & Supply Chain + 11-50 employees + Decision Maker
- Yields ~3,000 named individuals
- Save searches; export via Phantombuster (free trial) or copy to Notion

### G. Google Maps + outscraper.com
- Search "freight forwarder [UK city]" → outscraper extracts the GMB pack into CSV
- Get email + phone + reviews + website status
- 500 free credits with signup

### H. Multimodal exhibitor directory
- https://www.multimodal.org.uk/exhibitor-list
- Annual list of 300+ exhibiting logistics brands
- Free; pre-show outreach is high-converting

### I. Trade publication staff lists
- Motor Transport, Logistics Manager, Freight Industry Times — their masthead pages list editors and contributors. The journalists are the gateway to PR + free features.

### J. Reverse-engineer competitors
- Schneider, DHL, Maersk, GXO publish customer testimonials publicly
- Each named customer is a logistics company with a budget for digital
- Scrape testimonial pages → contact the company → ask if they're happy with their site

---

## 2. List build template (Notion)

### Database schema: "UK Logistics Prospects"
| Field | Type | Notes |
|---|---|---|
| Company | Text | |
| Companies House # | Text | |
| Contact name | Text | First.Last |
| Title | Text | Director, MD, Marketing Lead, Operations |
| LinkedIn URL | URL | |
| Email | Email | |
| Phone | Phone | |
| Website | URL | |
| Site score (Kurongeka) | Number | 0-100 |
| Employees | Number | |
| Turnover band | Select | <£1M, £1-5M, £5-15M, £15M+ |
| Sector | Multi-select | Freight forwarder, road haulage, warehousing, courier, customs, last-mile |
| City / region | Select | Major UK hub |
| Trade body | Multi-select | Logistics UK, BIFA, RHA, UKWA, none |
| Source | Select | Companies House, BIFA, LinkedIn Nav, GMB, referral, inbound |
| Status | Select | New, Audited, Contacted, Replied, Booked, Disqualified, Won, Lost |
| Last touch | Date | |
| Next touch | Date | |
| Notes | Long text | Buying signals, context |
| Audit URL | URL | Public Kurongeka dashboard |

**Daily ritual:** add 20 prospects, audit 5, send 10 outreach messages.

---

## 3. LinkedIn outbound playbook

### Connection request (no pitch)
> Hi {first_name}, saw your post about {something specific they posted recently}. We've been doing a lot of work with UK logistics operators on the digital side — would be good to connect.

(One sentence reference to their content. Personal. Never lead with a pitch.)

### Touch 1 — after they accept (wait 24h)
> Cheers for the connect, {first_name}. Quick context: I run Kapture Studio. We just shipped a logistics website template that goes live in 24 hours — branded for the buyer, repo handed over.
>
> No pitch in this message. We're auditing 100 UK logistics websites this month for free — gives you a public scorecard you can use however. If you want yours done, just reply *AUDIT* and we'll fire one off for {company} this week.

### Touch 2 — after audit delivered (3 days after touch 1, only if audit done)
> {first_name} — your {company} audit is here: {dashboard URL}.
>
> Headline: site scored {X}/100. Three biggest leaks are {1}, {2}, {3}. The full breakdown is on the page.
>
> If you want the prescribed fix — same shape as kapture-logistics.com but branded for {company} — we ship in 24 hours. Reply *FIX* and I'll send a 15-min Calendly link.

### Touch 3 — soft close (7 days after touch 2)
> Last note from me: {first_name}, the audit page for {company} is getting ~30 visits/week from search. {Competitor name} just had theirs done too — happy to send their score so you can compare.
>
> Worth a 15 min call? {Calendly link}

### Cadence rules
- 30 connection requests/day max (LinkedIn caps at 100/week)
- Never more than 3 touches per prospect
- If they don't reply by touch 3 → mark as nurture, drop into newsletter
- Never DM on weekends
- Never DM after 5pm UK weekday
- Always personalise touch 1 with one specific reference

---

## 4. Cold email playbook

### Email 1 — *audit drop* (free value, no ask)

**Subject:** {company} digital audit — 58/100

```
Hi {first_name},

Quick one. We audited {company}'s digital presence this week as part of a 
2026 industry sweep we're doing. The dashboard is here:

{Kurongeka audit URL}

Top three findings:
1. Site loads in 4.2s on mobile (industry median: 2.1s) — losing ~38% of visitors before paint
2. Quote form requires 7 fields and lacks GDPR consent — likely sub-2% submission rate
3. No structured data for FAQ / business schema — invisible to AI search

We do these for free. No string attached. Hope it's useful.

If you want the prescribed fix — a new operator-grade site live in 24 hours, 
branded for {company} — reply with *YES* and I'll send the demo.

— Acie
Founder, Kapture Studio
kapture-logistics.com
```

**Why this works:** Subject line pre-qualifies (the score IS the hook). First sentence delivers value before asking. CTA is a one-word reply to lower friction.

### Email 2 — *follow-up* (3 days later if no reply)

**Subject:** Re: {company} digital audit — 58/100

```
{first_name},

Sent the audit on {date}. In case it dropped: {URL}

Quick stat from the audit: {company} appears for 0% of "freight forwarder 
{city}" searches on Google's first page. Two competitors do.

Want me to send the demo of what a fixed version would look like? It's the 
same template I built for kapture-logistics.com, just branded for {company}.

15-min Calendly: {url}

— Acie
```

### Email 3 — *the breakup* (7 days after email 2 if no reply)

**Subject:** Closing the {company} file

```
{first_name} — closing this thread on my end.

Will leave the audit dashboard live for 30 days at {URL} — useful as a 
benchmark when you do come back to the site.

If anything changes, my reply email goes straight to me.

— Acie
```

### Email volume + sender
- Volume: 10/day max from a single sender (Resend / Gmail)
- Use studio@thekapture.com (not noreply / not personal — looks legit)
- Always BCC notion@yourworkspace.so for auto-CRM logging
- SPF, DKIM, DMARC all set up at GoDaddy (Resend gives you exact records)
- Cold-email warmup: send 5/day for week 1, 10/day from week 2, never spike

---

## 5. WhatsApp + phone (UK convention)

### WhatsApp first touch
> Hi {first_name}, came across {company} when we were running a sweep of UK freight forwarders. Sent your audit dashboard to {email} — let me know if it landed. — Acie at Kapture

### Phone call script (when they answer)
> "Hi, is that {first_name}? My name's {your name} from Kapture Studio in London. We're a digital agency — we just shipped a logistics website that goes live in 24 hours, branded for the buyer. We audited {company}'s site this week as part of an industry sweep. Score came back at {X}/100. The audit's free — would it help if I sent it across? Brilliant — what's the best email?"

(15-second pitch. Audit is the hook, not the sale.)

### Voicemail script
> "Hi {first_name}, this is Acie from Kapture in London. We did a free digital audit on {company} this week and I wanted to make sure it landed — score came back at {X}/100. Email's studio@thekapture.com if you want to grab it. No pressure — just thought it might be useful. Cheers."

---

## 6. Trade body partnership outreach

### Logistics UK (formerly FTA)

**Target:** Their Head of Member Engagement (find on their staff page)

**Pitch email (subject: "Free digital health check for Logistics UK members"):**

```
Hi {name},

Quick proposal. I run Kapture Studio in London. We've built a free digital 
audit tool for logistics operators — scores their website across nine 
dimensions and hands them a public dashboard.

Proposal: we audit 100 random Logistics UK members for free, anonymise the 
data, and produce a "State of UK Logistics Websites 2026" report — co-branded 
with Logistics UK. Members get individual scorecards. The aggregated report 
goes in the next member newsletter.

Why for you: high-value content, no cost, your members get genuinely useful 
data on a problem most of them know they have.

Why for us: branding alongside Logistics UK and goodwill with operators we 
hope to serve.

10-min call to scope it? {Calendly}

— Acie Lumumba
Founder, Kapture Studio
kapture-logistics.com
```

### BIFA, RHA, UKWA — same structure
Lead with the gift (the report), specify the trade-off (newsletter feature), keep it short. Ask for 10 minutes, not 30.

---

## 7. Industry events (UK calendar)

| Event | Date | Strategy |
|---|---|---|
| **Multimodal** | 11-13 June 2026, NEC Birmingham | Pre-show: audit all 300 exhibitors, email each their dashboard. On-show: visit booths, hand out QR cards to scorecard. Post-show: outreach campaign. |
| **IMHX** | March 2026, NEC | Materials handling — adjacent. Worth attending year 2. |
| **Last Mile Conference** | June 2026 | Direct ICP. Pitch a speaking slot in 2027 once we have 5 case studies. |
| **CILT International Convention** | Annual | Apply for member rates; useful network. |
| **Freight in the City Expo** | November 2026, ExCeL | Free for trade. Walk the floor, audit every exhibiting brand. |

**Pre-event playbook (4 weeks before):**
1. Scrape exhibitor list
2. Audit every exhibitor's website
3. Email each their dashboard with subject "Pre-{Event} digital audit — {company} — {score}/100"
4. Mention you'll be at the event, would love a coffee
5. Book 10-15 in-person meetings

This single play yields 30-50 warm conversations per event for zero ad spend.

---

## 8. Referral programme (activate month 3)

### Mechanic
- 15% of every paid deployment introduced by an external party
- 5% bonus to internal Kapture team members for client introductions
- Paid in cash within 14 days of client deposit clearing

### Tracked via
- Notion CRM "Referrer" field
- Each referral gets a unique link with `?ref=XXX` UTM (auto-attributed)
- Auto-email to referrer when their referee books a call, signs, pays

### Promotion
- Mention on every call: *"Btw, if you know another logistics co struggling with their site, we pay 15% commission. Casual referrals welcome."*
- Quarterly "thank you" email to all referrers with their YTD earnings
- Annual public leaderboard in the Slack community (no names if they prefer)

---

## 9. Daily / weekly cadence

### Founder/operator daily (8am-6pm UK)
| Time | Activity |
|---|---|
| 8:00-9:00 | LinkedIn — write + post 1 piece, engage with 10 ICP comments |
| 9:00-10:00 | Outbound batch — 30 connection requests + 10 cold emails |
| 10:00-12:00 | Discovery calls (target: 2/day) |
| 12:00-13:00 | Lunch + audit delivery (5 audits/day to inbox) |
| 13:00-15:00 | Project delivery (active client builds) |
| 15:00-16:00 | Inbound triage — reply to all DMs, emails, calendar invites |
| 16:00-17:00 | Content prep — record loom, edit clip, draft newsletter |
| 17:00-18:00 | CRM hygiene + tomorrow's plan |

### Weekly milestones
- Mon: 3 calls booked for the week, 5 audits prepped, 1 LinkedIn post live
- Tue: 5 outbound emails, 2 calls held, audit dashboard published
- Wed: Discovery calls + project work, weekly metrics review at 5pm
- Thu: 5 outbound emails, 2 calls held, content recording
- Fri: 1 newsletter sent, retainer client check-ins, KPI update

---

## 10. The "first 100 days" outbound goal

| Week | Audits delivered | Outbound emails | LinkedIn touches | Calls booked | Cash closed |
|---|---|---|---|---|---|
| 1-2 | 25 | 100 | 200 | 3 | £2.5K (1 client) |
| 3-4 | 50 | 200 | 400 | 5 | £7.5K (2-3 clients) |
| 5-8 | 100 | 400 | 800 | 12 | £25K (5-6 clients) |
| 9-12 | 150 | 600 | 1,200 | 20 | £45K (8-10 clients) |
| 13-14 | 200 | 700 | 1,400 | 25 | £60K (12+ clients) |

**Cumulative end of 100 days:** 200 brands audited. 25+ paying clients. £100K+ collected. Full pipeline of warm-to-hot leads. Three case studies live. First trade-body partnership active.

---

*The audit is the wedge. The 24-hour clock is the close. Repeat 200 times.*
