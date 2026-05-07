/**
 * Kapture Logistics — UK careers role library.
 *
 * Roles modelled on the standard UK 3PL / road-haulage / freight-forwarding
 * org chart. Each role is mapped to:
 *   - department (used to group on /careers)
 *   - role family (driver / warehouse / office / commercial / leadership)
 *   - the role-specific application fields the candidate is expected to
 *     answer in addition to the universal application schema.
 *
 * The role-specific fields are typed against `RoleField` so the application
 * form can render them dynamically without per-role components.
 */

export type RoleField = {
  /** Form input name (snake_case). Goes straight onto the API payload. */
  name: string;
  /** Human-readable label on the form. */
  label: string;
  /** Field type. `text-list` = comma separated multi-value. */
  type:
    | "text"
    | "textarea"
    | "email"
    | "tel"
    | "date"
    | "number"
    | "select"
    | "multiselect"
    | "checkbox";
  /** Required at submit time. */
  required?: boolean;
  /** Placeholder shown inside the input. */
  placeholder?: string;
  /** Helper line shown below the input. */
  help?: string;
  /** Options for select / multiselect. */
  options?: string[];
};

export type Role = {
  /** URL slug — used at /careers/[slug]. Stable. */
  slug: string;
  /** Public title on the role card and the role page. */
  title: string;
  /** Short job-board-style summary line. Sits under the title. */
  summary: string;
  /** Department grouping on the careers landing page. */
  department:
    | "Driving"
    | "Warehouse & Operations"
    | "Transport Office"
    | "Commercial"
    | "Corporate & Support"
    | "Leadership & Compliance";
  /** Role family — drives which extra application fields are added. */
  family:
    | "driver"
    | "warehouse"
    | "office"
    | "commercial"
    | "tech"
    | "compliance"
    | "leadership"
    | "support";
  /** UK city / hub. */
  location: string;
  /** Employment type. */
  type: "Full-time" | "Part-time" | "Contract" | "Agency" | "Apprenticeship";
  /** Working pattern. */
  shift: string;
  /** Salary band as a clean string for display. */
  salary: string;
  /** Whether the role is currently advertised. */
  status: "Hiring now" | "Always open" | "Talent pool";
  /** Top of the role page — the brief. */
  intro: string;
  /** Day-to-day duties — bullet list. */
  responsibilities: string[];
  /** Hard requirements — must-have. */
  requirements: string[];
  /** Nice-to-have. */
  desirable?: string[];
  /** What the company offers in return. */
  benefits: string[];
  /**
   * Additional fields appended to the universal application form
   * for this role. Empty array = universal fields only.
   */
  extraFields: RoleField[];
};

/* ────────────────────────────────────────────────────────────────────────
 * Reusable field building blocks — keeps role definitions short.
 * ─────────────────────────────────────────────────────────────────────── */

const DRIVER_LICENCE_FIELDS: RoleField[] = [
  {
    name: "licence_categories",
    label: "Driving licence categories held",
    type: "multiselect",
    required: true,
    options: ["B (car)", "C1 (3.5–7.5t)", "C (Class 2 / rigid)", "C+E (Class 1 / artic)", "D1 (minibus)"],
    help: "Tick every category currently on your DVLA licence.",
  },
  {
    name: "licence_issue_country",
    label: "Country that issued your licence",
    type: "select",
    required: true,
    options: ["United Kingdom", "Republic of Ireland", "EU member state", "Outside EU"],
  },
  {
    name: "licence_points",
    label: "Current penalty points",
    type: "select",
    required: true,
    options: ["0", "1–3", "4–6", "7–9", "10+"],
  },
  {
    name: "licence_endorsements",
    label: "Endorsements / convictions in the last 5 years",
    type: "textarea",
    placeholder: "List code, date, and reason — or write 'None'.",
    required: true,
  },
  {
    name: "driver_cpc_card",
    label: "Driver CPC card valid?",
    type: "select",
    required: true,
    options: ["Yes — valid for 12+ months", "Yes — expires within 12 months", "Currently studying", "No / lapsed"],
    help: "Required by law for all professional drivers of vehicles over 3.5t.",
  },
  {
    name: "tacho_card",
    label: "Digital tachograph card",
    type: "select",
    required: true,
    options: ["Yes — valid", "Expires within 6 months", "Applied for", "No"],
  },
  {
    name: "adr_held",
    label: "ADR (dangerous goods) certification",
    type: "select",
    options: ["Full ADR — all classes", "ADR — packaged only", "ADR — tankers only", "None"],
  },
  {
    name: "hiab_held",
    label: "HIAB / lorry-mounted crane",
    type: "select",
    options: ["Yes — certified", "Some experience", "No"],
  },
  {
    name: "vehicle_experience",
    label: "Vehicle types you've driven professionally",
    type: "multiselect",
    options: [
      "3.5t panel van",
      "7.5t curtainsider",
      "7.5t box / tail-lift",
      "18t rigid",
      "26t rigid",
      "Artic curtainsider",
      "Artic fridge",
      "Artic tipper",
      "Artic tanker",
      "Tramping (nights out)",
    ],
  },
  {
    name: "preferred_work_pattern",
    label: "Preferred work pattern",
    type: "select",
    required: true,
    options: ["Days only", "Nights only", "Days + occasional nights", "Tramping (Mon–Fri away)", "Weekend / agency"],
  },
];

const WAREHOUSE_FIELDS: RoleField[] = [
  {
    name: "flt_licences",
    label: "Forklift / MHE licences",
    type: "multiselect",
    options: [
      "Counterbalance (RTITB / ITSSAR)",
      "Reach truck",
      "VNA / very narrow aisle",
      "PPT / pallet truck",
      "Bendi / pivot-mast",
      "Order picker (LLOP)",
      "None",
    ],
    help: "Tick all categories you are currently certified on.",
  },
  {
    name: "flt_provider",
    label: "FLT certification provider & expiry",
    type: "text",
    placeholder: "e.g. RTITB — expires 11/2027",
  },
  {
    name: "warehouse_systems",
    label: "WMS / scanner systems used",
    type: "text",
    placeholder: "e.g. Manhattan, SAP EWM, Mintsoft, RF gun",
  },
  {
    name: "shift_pattern_pref",
    label: "Preferred shift",
    type: "select",
    required: true,
    options: ["Days (06:00–14:00)", "Late (14:00–22:00)", "Nights (22:00–06:00)", "4-on-4-off", "Twilight (16:00–22:00)", "Any"],
  },
];

const OFFICE_FIELDS: RoleField[] = [
  {
    name: "tms_systems",
    label: "TMS / planning systems used",
    type: "text",
    placeholder: "e.g. Mandata, Microlise, PODFather, Paragon",
  },
  {
    name: "fluent_languages",
    label: "Other languages spoken fluently",
    type: "text",
    placeholder: "e.g. Polish, Romanian, Shona, French",
  },
];

const COMMERCIAL_FIELDS: RoleField[] = [
  {
    name: "patch",
    label: "Sales territory you've previously covered",
    type: "text",
    placeholder: "e.g. South East UK, Midlands, EMEA",
  },
  {
    name: "ticket_size",
    label: "Average annual contract value you've closed",
    type: "select",
    options: ["Under £25k", "£25k – £100k", "£100k – £500k", "£500k – £2m", "£2m+"],
  },
  {
    name: "vertical_focus",
    label: "Verticals you've sold into",
    type: "multiselect",
    options: ["Retail / FMCG", "E-commerce", "Manufacturing", "Pharma & cold chain", "Automotive", "Construction", "Public sector", "Energy & mining"],
  },
];

const TECH_FIELDS: RoleField[] = [
  {
    name: "primary_stack",
    label: "Primary stack you ship in",
    type: "text",
    required: true,
    placeholder: "e.g. TypeScript / Next.js / Postgres / AWS",
  },
  {
    name: "github",
    label: "GitHub / portfolio link",
    type: "text",
    placeholder: "https://github.com/yourhandle",
  },
];

const COMPLIANCE_FIELDS: RoleField[] = [
  {
    name: "transport_manager_cpc",
    label: "Transport Manager CPC (national / international)",
    type: "select",
    required: true,
    options: ["National + International", "National only", "International only", "Studying", "None"],
  },
  {
    name: "operator_licence_experience",
    label: "Years on an O-licence as nominated TM",
    type: "select",
    options: ["0", "1–2", "3–5", "5–10", "10+"],
  },
  {
    name: "audit_history",
    label: "Recent DVSA / FORS / earned-recognition outcomes",
    type: "textarea",
    placeholder: "Most recent audit and outcome — green / yellow / red.",
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * Roles
 * ─────────────────────────────────────────────────────────────────────── */

export const ROLES: Role[] = [
  /* ─── Driving ──────────────────────────────────────────────────────── */
  {
    slug: "hgv-class-1-driver",
    title: "HGV Class 1 (C+E) Driver",
    summary: "Trunking and store deliveries on artic curtainsiders and fridges across the UK.",
    department: "Driving",
    family: "driver",
    location: "Daventry, Northampton, Manchester, Avonmouth",
    type: "Full-time",
    shift: "4-on-4-off · days, nights or tramping",
    salary: "£42,000 – £52,000 OTE + tramping money",
    status: "Hiring now",
    intro:
      "We move retail, FMCG and pharma loads across the UK and into Ireland on a fully managed Kapture fleet. Your trucks are EURO-6 DAF and Mercedes Actros, max 4 years old, with full live telematics and PODFather on the cab. We pay for waiting time, plan your week 7 days in advance, and run a strict no-shouting culture.",
    responsibilities: [
      "Daily walk-around checks and digital defect reporting before pull-out.",
      "Run trunks and multi-drops to RDCs, retail stores and 3PL hubs.",
      "Operate to drivers' hours and WTD with full digital tacho discipline.",
      "Capture electronic POD with photos, signatures and condition notes.",
      "Report incidents, near-misses and fleet defects through the driver app.",
    ],
    requirements: [
      "Full UK Class 1 (C+E) licence held for at least 12 months.",
      "Valid Driver CPC card and digital tachograph card.",
      "Maximum 6 penalty points — no DR, IN or DD endorsements.",
      "Right to work in the UK.",
      "Two verifiable work references covering the last 3 years.",
    ],
    desirable: ["ADR (any classes)", "HIAB ticket", "Fridge / temperature-controlled experience"],
    benefits: [
      "Modern Euro-6 fleet, max 4 years old",
      "Paid waiting time after 30 minutes",
      "Night-out and tramping money paid weekly",
      "Pension match up to 5%",
      "Death-in-service cover",
      "Free uniform, PPE and Costa card on tramping",
    ],
    extraFields: DRIVER_LICENCE_FIELDS,
  },
  {
    slug: "hgv-class-2-driver",
    title: "HGV Class 2 (C) Multi-drop Driver",
    summary: "26t rigid multi-drop work to retail stores and B2B sites — home every night.",
    department: "Driving",
    family: "driver",
    location: "London, Birmingham, Leeds, Glasgow",
    type: "Full-time",
    shift: "Days · 5-on-2-off · home daily",
    salary: "£34,000 – £40,000 OTE",
    status: "Hiring now",
    intro:
      "Class 2 multi-drop on 18t and 26t rigids running into city-centre retail and B2B sites. Average 8–14 drops per shift. You're home every night, paid weekly, and you'll have a planner sat next to dispatch — not in a different country.",
    responsibilities: [
      "Run a structured multi-drop route with 8–14 stops per shift.",
      "Tail-lift unloads and pump-truck handling at delivery sites.",
      "Capture electronic POD and report any refusals or shortages.",
      "Daily vehicle checks and defect reporting before keys-in.",
      "Build relationships with regular customer sites.",
    ],
    requirements: [
      "Full UK Category C licence.",
      "Driver CPC card and digital tacho.",
      "Maximum 6 penalty points.",
      "Tail-lift and pump-truck competence.",
      "Right to work in the UK.",
    ],
    desirable: ["Cat C+E", "FLT counterbalance ticket", "London city-centre experience"],
    benefits: [
      "Home every night",
      "Paid breaks after 4 hours",
      "Weekly pay",
      "Workplace pension",
      "28 days holiday",
      "Refer-a-driver bonus £750",
    ],
    extraFields: DRIVER_LICENCE_FIELDS,
  },
  {
    slug: "van-multidrop-driver",
    title: "7.5t / Van Multi-drop Driver",
    summary: "Last-mile delivery across the metro on 3.5t panel vans and 7.5t curtainsiders.",
    department: "Driving",
    family: "driver",
    location: "London, Manchester, Birmingham",
    type: "Full-time",
    shift: "Days · 5-on-2-off",
    salary: "£28,000 – £33,000 + bonus",
    status: "Hiring now",
    intro:
      "Last-mile metro work on Kapture branded 3.5t vans and 7.5t curtainsiders. Routes are pre-planned in PODFather with live drop optimisation. We pay a fuel-card-only flat scheme — no fuel cost guesswork.",
    responsibilities: [
      "30–60 metro drops per shift on a planned route.",
      "Photo-POD capture and customer notification handling.",
      "Vehicle daily checks and clean-cab presentation.",
      "Recovery of failed deliveries and returns.",
      "Polite, branded customer contact at the door.",
    ],
    requirements: [
      "Full UK Category B licence held 24+ months (Cat C1 for 7.5t).",
      "Maximum 6 penalty points.",
      "Right to work in the UK.",
      "Smartphone literate — comfortable with route apps.",
    ],
    desirable: ["Cat C1 / 7.5t", "Driver CPC", "Previous Amazon, DPD, Evri or Yodel experience"],
    benefits: [
      "Branded uniform and PPE provided",
      "Daily route plan ready by 06:00",
      "Performance bonus for >97% delivery success",
      "Holiday pay",
      "No weekend work — Mon–Fri only",
    ],
    extraFields: DRIVER_LICENCE_FIELDS,
  },

  /* ─── Warehouse & Operations ──────────────────────────────────────── */
  {
    slug: "warehouse-operative",
    title: "Warehouse Operative — Pick / Pack / Goods-in",
    summary: "Pick, pack and dispatch on a fast-moving 3PL operation. Full PPE and shift options.",
    department: "Warehouse & Operations",
    family: "warehouse",
    location: "Daventry, Magna Park, Tilbury, Trafford",
    type: "Full-time",
    shift: "Days, lates or nights · 4-on-4-off available",
    salary: "£12.21 – £14.50 / hour + shift premium",
    status: "Hiring now",
    intro:
      "Warehouse operative on a multi-client 3PL site running retail, e-commerce and manufacturing flows. We run on Manhattan WMS, RF scanners and a healthy pick-rate target — but we don't punish people for it. New starters are buddied for 2 weeks before going to standalone targets.",
    responsibilities: [
      "Pick from voice or RF scanner against a pick-list at agreed rates.",
      "Pack and label outbound parcels and pallets to spec.",
      "Goods-in receipts, put-away and stock count cycles.",
      "Maintain bay tidiness, segregation and 5S standards.",
      "Flag damages, shortages, and discrepancies to team lead.",
    ],
    requirements: [
      "Right to work in the UK (we sponsor for shortage roles only).",
      "Reliable timekeeping and willingness to work shifts.",
      "Comfortable on your feet for full shift.",
      "Basic English — ability to read pick lists and instructions.",
    ],
    desirable: ["Counterbalance / reach FLT", "Previous WMS experience (Manhattan, SAP, Mintsoft)", "PPT licence"],
    benefits: [
      "Free FLT training and progression to driver / team lead",
      "Subsidised on-site canteen",
      "Shift premium for nights",
      "Long-service holiday increases",
      "Cycle-to-work scheme",
    ],
    extraFields: WAREHOUSE_FIELDS,
  },
  {
    slug: "forklift-driver",
    title: "Forklift / MHE Operator",
    summary: "Counterbalance and reach truck operator across goods-in, replenishment and dispatch.",
    department: "Warehouse & Operations",
    family: "warehouse",
    location: "Daventry, Avonmouth, Tilbury",
    type: "Full-time",
    shift: "Days, lates or nights",
    salary: "£14.00 – £16.50 / hour",
    status: "Hiring now",
    intro:
      "MHE operator on a high-bay 3PL operation. You'll run counterbalance, reach and VNA depending on shift. Strict pre-use checks, banksman discipline, and we don't tolerate horseplay around the racking.",
    responsibilities: [
      "Pre-use checks and report any defects before operation.",
      "Goods-in receipt, put-away to designated locations.",
      "Replenishment from reserve to pick face.",
      "Dispatch loading / unloading to plan.",
      "Maintain location accuracy and report damages.",
    ],
    requirements: [
      "Valid in-date FLT licence (RTITB / ITSSAR / AITT).",
      "Right to work in the UK.",
      "Banksman / safe-systems-of-work awareness.",
      "Steel-toe footwear and willingness to wear full PPE.",
    ],
    desirable: ["Reach truck experience", "VNA / man-up training", "Internal bendi or pivot-mast"],
    benefits: [
      "Refresher training paid by Kapture",
      "Shift premium for nights",
      "Pension match",
      "Free PPE",
      "Site bonus quarterly",
    ],
    extraFields: WAREHOUSE_FIELDS,
  },
  {
    slug: "shift-team-lead",
    title: "Warehouse Team Leader / Shift Supervisor",
    summary: "Lead a 6–20 person shift and own daily KPIs on a 3PL operation.",
    department: "Warehouse & Operations",
    family: "warehouse",
    location: "Daventry, Tilbury, Trafford",
    type: "Full-time",
    shift: "4-on-4-off · days or nights",
    salary: "£32,000 – £38,000 + shift allowance",
    status: "Hiring now",
    intro:
      "You'll own a shift end-to-end — the briefing, the productivity numbers, the safety culture and the handover. We back our team leaders with proper authority and proper training. No shouty, no suit-and-tie politics.",
    responsibilities: [
      "Run a daily shift briefing and set the operational tempo.",
      "Own pick-rate, accuracy and dispatch KPIs.",
      "Manage absence, conduct and welfare across the shift.",
      "Investigate incidents and own corrective actions.",
      "Hand over a clean operation to the next shift lead.",
    ],
    requirements: [
      "2+ years leading a warehouse shift.",
      "Strong WMS literacy (Manhattan, SAP, Mintsoft etc.).",
      "Right to work in the UK.",
      "Proven track record on safety, quality and productivity.",
    ],
    desirable: ["IOSH Managing Safely", "Lean / Six Sigma exposure", "FLT licences"],
    benefits: [
      "Funded ILM Level 3 / 5 progression",
      "Shift allowance",
      "Bonus tied to shift KPIs",
      "Death-in-service cover",
      "25 days holiday",
    ],
    extraFields: WAREHOUSE_FIELDS,
  },

  /* ─── Transport Office ────────────────────────────────────────────── */
  {
    slug: "transport-planner",
    title: "Transport Planner / Traffic Planner",
    summary: "Plan and optimise daily fleet movements for a national multi-client operation.",
    department: "Transport Office",
    family: "office",
    location: "Daventry, Manchester, Avonmouth",
    type: "Full-time",
    shift: "Days · 5-on-2-off · early or late",
    salary: "£32,000 – £42,000",
    status: "Hiring now",
    intro:
      "You'll plan a 60-vehicle day — trunks, multi-drops and last-mile — across multiple customers and depots. We use Mandata for TMS, Microlise for telematics and a clean operating playbook. The desk is busy; the politics aren't.",
    responsibilities: [
      "Plan optimal routes across day's volume against driver availability and tachos.",
      "Allocate work, brief drivers and resolve mid-shift exceptions.",
      "Liaise with customers on ETA, delays and changes.",
      "Manage subcontract / agency uplift when in-house capacity is tight.",
      "Hand over a clean board to the next planning shift.",
    ],
    requirements: [
      "2+ years in a UK transport planning desk role.",
      "Working knowledge of drivers' hours and WTD.",
      "Comfortable on a TMS (Mandata, Microlise, Paragon or similar).",
      "Right to work in the UK.",
    ],
    desirable: ["Transport Manager CPC (national)", "Multi-temp / RDC experience", "Multi-language ability"],
    benefits: [
      "CPC funded if studying",
      "Early-finish Fridays once trained",
      "Pension match",
      "Hybrid 1 day / week after probation",
      "25 days holiday",
    ],
    extraFields: OFFICE_FIELDS,
  },
  {
    slug: "customer-service-coordinator",
    title: "Customer Service / Account Coordinator",
    summary: "Front-line customer contact for a portfolio of national accounts.",
    department: "Transport Office",
    family: "office",
    location: "London, Daventry, Manchester",
    type: "Full-time",
    shift: "Days · Mon–Fri · hybrid 2/3",
    salary: "£28,000 – £34,000",
    status: "Hiring now",
    intro:
      "You're the voice of Kapture for a small portfolio of named accounts. You'll know their stock movements better than they do by week three. We pay for the relationship, not the call volume.",
    responsibilities: [
      "Daily check-in calls and inbox management for named accounts.",
      "Booking-in deliveries with consignees and managing exceptions.",
      "Track-and-trace updates and proactive ETA management.",
      "Logging issues, root-causing them with ops, and closing the loop.",
      "Producing weekly customer service reviews.",
    ],
    requirements: [
      "1–3 years in a logistics / supply chain / 3PL service role.",
      "Confident written and verbal English.",
      "Comfortable in MS Excel and a TMS.",
      "Right to work in the UK.",
    ],
    desirable: ["European language", "FORS / FORS Practitioner", "Six Sigma yellow / green belt"],
    benefits: [
      "Hybrid 2 days WFH after probation",
      "Pension match",
      "Annual customer-experience bonus",
      "Health cash plan",
      "25 days holiday + birthday off",
    ],
    extraFields: OFFICE_FIELDS,
  },
  {
    slug: "customs-clearance-clerk",
    title: "Customs Clearance Clerk",
    summary: "Customs entries for road, sea and air freight — UK and EU.",
    department: "Transport Office",
    family: "office",
    location: "Felixstowe, London Heathrow, Dover",
    type: "Full-time",
    shift: "Days · Mon–Fri",
    salary: "£30,000 – £42,000",
    status: "Hiring now",
    intro:
      "You'll process customs entries on CDS / NCTS for road, sea and air freight. We move retail, manufacturing, pharma and project cargo. Clean, paperless, audited.",
    responsibilities: [
      "Submit and amend import / export declarations on CDS.",
      "Classify goods by HS code and apply correct duty / VAT treatment.",
      "Manage T1 / T2 transit and bonded movements.",
      "Liaise with shippers, hauliers and HMRC.",
      "Maintain entry audit files to inspection standard.",
    ],
    requirements: [
      "1+ year on CDS or CHIEF entries.",
      "Working knowledge of HS classification.",
      "Right to work in the UK.",
      "Detail-obsessed — the paperwork has to be perfect.",
    ],
    desirable: ["AEO experience", "CIES / IOEx qualification", "Customs broker exam"],
    benefits: [
      "Funded customs qualifications (CIES, IOEx)",
      "Hybrid 2 days / week",
      "Pension match",
      "Quarterly entry-quality bonus",
      "25 days holiday",
    ],
    extraFields: OFFICE_FIELDS,
  },

  /* ─── Commercial ──────────────────────────────────────────────────── */
  {
    slug: "business-development-manager",
    title: "Business Development Manager",
    summary: "New-logo sales for managed transport, multi-modal and last-mile contracts.",
    department: "Commercial",
    family: "commercial",
    location: "London, Manchester, Birmingham (field)",
    type: "Full-time",
    shift: "Days · field-based · UK travel",
    salary: "£55,000 – £75,000 base + £40,000 OTE + car allowance",
    status: "Hiring now",
    intro:
      "Hunt new logos. We give you a real product, a real platform, and a marketing engine that actually feeds the pipeline. You bring the discipline and the customer relationships. Activity is what we measure on the way in. Revenue on the way out.",
    responsibilities: [
      "Build a 3x pipeline against your individual annual quota.",
      "Lead bid responses with the solutions and pricing teams.",
      "Run RFI / RFP / tender processes through to commercial close.",
      "Onboard and hand off won business cleanly to operations.",
      "Maintain CRM hygiene — no deal exists if it's not in the system.",
    ],
    requirements: [
      "3+ years in a logistics / 3PL / freight new-business role.",
      "Track record of closing £500k+ contracts.",
      "Right to work in the UK and full driving licence.",
      "Hunter mindset — we are not paying for relationship management.",
    ],
    desirable: ["Existing book of UK shipper relationships", "MEDDPICC / Sandler / Challenger training", "Sector specialism (retail, pharma, manufacturing)"],
    benefits: [
      "Uncapped OTE",
      "Car allowance £6,000",
      "Private medical (BUPA)",
      "30 days holiday",
      "Quarterly President's Club for top performers",
    ],
    extraFields: COMMERCIAL_FIELDS,
  },
  {
    slug: "key-account-manager",
    title: "Key Account Manager",
    summary: "Own a portfolio of strategic UK shipper accounts. Grow, defend, expand.",
    department: "Commercial",
    family: "commercial",
    location: "Hybrid · UK",
    type: "Full-time",
    shift: "Days · hybrid 2/3",
    salary: "£48,000 – £62,000 + bonus",
    status: "Hiring now",
    intro:
      "Three to five strategic accounts. Quarterly QBRs. Real P&L responsibility. You'll work with operations, finance and the Kapture platform team to keep customers moving and to find the next pound of revenue inside each one.",
    responsibilities: [
      "Own customer P&L across a small named portfolio.",
      "Run formal quarterly business reviews with full SLA reporting.",
      "Identify upsell / cross-sell opportunities and close them.",
      "Manage renewals and contract amendments.",
      "Be the single throat to choke for the customer.",
    ],
    requirements: [
      "3+ years on UK 3PL / freight account management.",
      "Experience running a customer P&L.",
      "Right to work in the UK.",
      "Comfortable in front of board-level customers.",
    ],
    desirable: ["Six Sigma / continuous improvement", "Customer experience qualification", "Industry-specific (retail, e-commerce, pharma)"],
    benefits: [
      "Annual customer-retention bonus",
      "Private medical",
      "25 days holiday + birthday",
      "Pension match",
      "Personal development budget £1,500 / year",
    ],
    extraFields: COMMERCIAL_FIELDS,
  },

  /* ─── Corporate & Support ────────────────────────────────────────── */
  {
    slug: "credit-controller",
    title: "Credit Controller",
    summary: "Manage UK and EU receivables across our customer base.",
    department: "Corporate & Support",
    family: "support",
    location: "London / hybrid",
    type: "Full-time",
    shift: "Days · hybrid 2/3",
    salary: "£32,000 – £40,000",
    status: "Hiring now",
    intro:
      "Sit inside Finance and own the AR ledger end-to-end — from query resolution through to dunning and disputed-invoice recovery. We use Sage Intacct and Chaser. You'll keep DSO inside 45 days.",
    responsibilities: [
      "Own the daily AR aging and collection plan.",
      "Resolve invoice queries with operations and customers.",
      "Run dunning cycles and escalate to legal where required.",
      "Reconcile customer accounts and apply payments.",
      "Report DSO, ATB, and bad-debt provisions weekly.",
    ],
    requirements: [
      "2+ years in a UK credit control role.",
      "Comfortable on a major ERP (Sage, Xero, NetSuite, SAP).",
      "Excel competence — pivot tables, SUMIFS, Vlookup.",
      "Right to work in the UK.",
    ],
    desirable: ["AAT or CICM qualified", "Multi-currency exposure", "3PL / logistics sector"],
    benefits: [
      "Hybrid 2/3",
      "Funded CICM / AAT",
      "25 days holiday",
      "Pension match",
      "Annual bonus tied to AR targets",
    ],
    extraFields: OFFICE_FIELDS,
  },
  {
    slug: "people-coordinator",
    title: "People / HR Coordinator",
    summary: "Front-line People support across a 200-person operation.",
    department: "Corporate & Support",
    family: "support",
    location: "Daventry / hybrid",
    type: "Full-time",
    shift: "Days · hybrid 2/3",
    salary: "£28,000 – £34,000",
    status: "Hiring now",
    intro:
      "You'll be the operational engine room of People at Kapture — onboarding, ER cases, payroll prep, training records, and policy. CIPD-funded and a clear career path to People Partner.",
    responsibilities: [
      "Own the new-starter onboarding journey — offer to first day.",
      "Maintain BambooHR records and right-to-work files.",
      "Coordinate training records, FLT and CPC renewals.",
      "Run first-line ER conversations and escalate properly.",
      "Prepare monthly payroll inputs for sign-off.",
    ],
    requirements: [
      "1–3 years in a HR / People coordinator role.",
      "Strong attention to detail with sensitive data.",
      "Comfortable in HRIS (BambooHR, HiBob, Workday or similar).",
      "Right to work in the UK.",
    ],
    desirable: ["CIPD Level 3 working towards 5", "Logistics / blue-collar workforce experience", "Multi-site exposure"],
    benefits: [
      "Funded CIPD progression",
      "Hybrid 2/3",
      "Wellbeing budget £400 / year",
      "25 days holiday",
      "Pension match",
    ],
    extraFields: OFFICE_FIELDS,
  },
  {
    slug: "platform-engineer",
    title: "Platform / Software Engineer (Logistics tech)",
    summary: "Ship the Kapture operating layer — TMS, tracking, and customer portals.",
    department: "Corporate & Support",
    family: "tech",
    location: "London / remote-first",
    type: "Full-time",
    shift: "Days · remote-first",
    salary: "£60,000 – £85,000 + equity",
    status: "Hiring now",
    intro:
      "You'll work on the platform that runs Kapture. TypeScript, Next.js, Postgres, Supabase, AWS. Real customers depend on it. Real freight moves because of it. We ship daily, we don't do sprint theatre, and we don't run agile rituals for their own sake.",
    responsibilities: [
      "Ship features against customer-facing logistics workflows.",
      "Write tests for the things that move money.",
      "Own incidents end-to-end with the on-call rota.",
      "Pair with operations to remove human friction.",
      "Keep the platform deployable to a new customer in under 24 hours.",
    ],
    requirements: [
      "3+ years shipping production TypeScript.",
      "Strong with relational databases and event-driven systems.",
      "Comfortable with cloud infrastructure (AWS / GCP).",
      "Right to work in the UK or sponsorable on a Skilled Worker visa.",
    ],
    desirable: ["Logistics, transport or supply-chain product background", "Mapping / routing / OR experience", "Open-source contributions"],
    benefits: [
      "Equity in Kapture",
      "Remote-first with quarterly meet-ups",
      "Top-spec hardware",
      "Learning budget £2,000 / year",
      "Private medical",
    ],
    extraFields: TECH_FIELDS,
  },

  /* ─── Leadership & Compliance ────────────────────────────────────── */
  {
    slug: "transport-manager-cpc",
    title: "Transport Manager (CPC) — National & International",
    summary: "Nominated Transport Manager on the operator licence for the UK fleet.",
    department: "Leadership & Compliance",
    family: "compliance",
    location: "Daventry · UK travel",
    type: "Full-time",
    shift: "Days · Mon–Fri · 24/7 on-call rota",
    salary: "£60,000 – £80,000 + car",
    status: "Hiring now",
    intro:
      "You'll be the named TM on our standard national O-licence with international authorisation. You own compliance, audit, and the driver standard. We back you to do the job properly — including saying no.",
    responsibilities: [
      "Maintain compliance to the standard required by the Traffic Commissioner.",
      "Manage drivers' hours, WTD, tacho analysis and infringement procedure.",
      "Own MOT prep, PMI scheduling and roadworthiness.",
      "Lead DVSA / FORS / earned-recognition audits.",
      "Sit in monthly board reviews and own the compliance KPI pack.",
    ],
    requirements: [
      "Transport Manager CPC — National and International.",
      "5+ years as nominated TM on an O-licence.",
      "Demonstrable green / earned-recognition track record.",
      "Right to work in the UK.",
    ],
    desirable: ["FORS Practitioner", "Driver CPC instructor qualification", "Multi-site experience"],
    benefits: [
      "Company car or £8,000 allowance",
      "Annual bonus on compliance score",
      "Private medical",
      "30 days holiday",
      "Pension match 6%",
    ],
    extraFields: COMPLIANCE_FIELDS,
  },
  {
    slug: "operations-manager",
    title: "Operations Manager",
    summary: "Own the daily P&L of a 3PL or transport operation.",
    department: "Leadership & Compliance",
    family: "leadership",
    location: "Daventry, Manchester, Avonmouth",
    type: "Full-time",
    shift: "Days · 5/2 with weekend on-call",
    salary: "£60,000 – £75,000 + bonus",
    status: "Hiring now",
    intro:
      "Run a site. Own the P&L, the people, and the customer. We give you proper authority, a clear KPI pack, and a team that's already doing real work. The job is to make it sharper, safer and more profitable.",
    responsibilities: [
      "Own the site P&L and weekly operating reviews.",
      "Manage 30–80 colleagues across shifts.",
      "Lead customer business reviews and resolve escalations.",
      "Drive continuous improvement on safety, quality and productivity.",
      "Develop the next layer of leaders below you.",
    ],
    requirements: [
      "5+ years leading a UK 3PL / transport operation.",
      "P&L ownership of £5m+.",
      "IOSH Managing Safely or NEBOSH.",
      "Right to work in the UK.",
    ],
    desirable: ["Multi-site exposure", "Lean Six Sigma green / black belt", "Implementation of new customer go-lives"],
    benefits: [
      "Bonus tied to site EBITDA",
      "Car allowance £6,000",
      "Private medical (family plan)",
      "30 days holiday",
      "Pension match 6%",
    ],
    extraFields: COMPLIANCE_FIELDS,
  },
];

/** Department display order on /careers. */
export const DEPARTMENT_ORDER: Role["department"][] = [
  "Driving",
  "Warehouse & Operations",
  "Transport Office",
  "Commercial",
  "Corporate & Support",
  "Leadership & Compliance",
];

export function getRole(slug: string): Role | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return ROLES.map((r) => r.slug);
}

export function rolesByDepartment(): Record<string, Role[]> {
  const map: Record<string, Role[]> = {};
  for (const dept of DEPARTMENT_ORDER) map[dept] = [];
  for (const r of ROLES) (map[r.department] ||= []).push(r);
  return map;
}
