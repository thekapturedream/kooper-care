/* ============================================================
   kooper · ai · sitewide AI assistant widget
   --------------------------------------------------------------
   - Injects a floating "Ask kooper · ai" button on every page
   - Opens a sliding chat panel with a search input + send button
   - Detects the current page and surfaces 3-6 context-aware
     suggested prompts. Each prompt actually performs the action
     so the demo feels live (toast → navigate → trigger DOM).
   - Single file, no dependencies. Drop it on any page via
     <script src="kooper-ai-widget.js" defer></script>
   ============================================================ */
(function () {
  'use strict';
  if (window.__kooperAI) return; // already injected
  window.__kooperAI = true;

  // ----------------------------------------------------------
  //  PAGE DETECTION + CONTEXT REGISTRY
  // ----------------------------------------------------------
  function pageKey() {
    var path = (window.location.pathname || '').split('/').pop() || '';
    var m = path.match(/^kooper-([\w-]+)\.html?$/);
    return m ? m[1] : 'home';
  }
  function asParam() {
    try { return new URLSearchParams(window.location.search).get('as') || ''; } catch (e) { return ''; }
  }
  function residentParam() {
    try {
      var p = new URLSearchParams(window.location.search);
      return p.get('resident') || p.get('patient') || '';
    } catch (e) { return ''; }
  }

  // Each prompt: label, optional emoji, action — action is a function
  // that runs when the user taps the suggestion or types it. Action can:
  //   - return a string (becomes the AI reply)
  //   - return { reply, then } where then is invoked after a brief delay
  //   - return { reply, navigate } to redirect after the reply
  function CTX() {
    var page = pageKey();
    var as = asParam();
    var res = residentParam();
    var role = roleForAs(as);
    var greet = greetingForPage(page, role);
    var prompts = (PAGE_PROMPTS[page] || PAGE_PROMPTS.default).slice();
    if (page === 'care-plans' && res) prompts = withResidentPrompts(res, prompts);
    if (page === 'rota'       && role === 'Manager')   prompts = withManagerRotaPrompts(prompts);
    if (page === 'hr')        prompts = withHrPrompts(prompts);
    return { page: page, as: as, role: role, resident: res, greet: greet, prompts: prompts };
  }

  function roleForAs(as) {
    return ({ sa:'Nurse', cm:'Carer', ra:'Senior Carer', dk:'Activities', mc:'Cook',
              tb:'Maintenance', jm:'Agency', bp:'Volunteer', lo:'Manager' })[as] || 'Carer';
  }
  function greetingForPage(page, role) {
    var pretty = { 'care-plans':'Care Plans', 'care-dashboards':'Dashboard', 'care-landing':'Home',
                   rota:'Rota', hr:'HR launcher', staff:'Your launcher', reports:'Reports',
                   'recording-demo':'Reporting', clinical:'Clinical', resident:'Resident view',
                   family:'Family view', ai:'AI', tool:'Tool', apps:'Apps', app:'App', 'sign-in':'Sign-in' };
    return 'I\'m kooper · ai on ' + (pretty[page] || page) + '. Tap a suggestion or ask me anything.';
  }

  // ----------------------------------------------------------
  //  PAGE PROMPT LIBRARIES
  //  Each entry: label, optional emoji, action()
  // ----------------------------------------------------------
  var PAGE_PROMPTS = {
    'care-plans': [
      { e:'➕', label:'Create a plan for a patient',          action: function () { return { reply:'Opening the Create Care Plan form…', then: function(){ if (typeof cpOpenCreateModal === 'function') cpOpenCreateModal(); } }; } },
      { e:'📋', label:'Show me all plans · review status',     action: function () { return { reply:'Opening the patient list filtered by review status…', navigate:'?view=list' }; } },
      { e:'⏳', label:'Approval queue · pending edits',        action: function () { return { reply:'Showing the approval queue at the top of landing.', navigate:'?' }; } },
      { e:'🩹', label:'Open Edward\'s plan',                   action: function () { return { reply:'Loading Mr Edward Banda\'s care plan…', navigate:'?resident=eb' }; } }
    ],
    rota: [
      { e:'📅', label:'Show this week\'s coverage gaps',       action: function () { return { reply:'Coverage gaps highlighted: Wed evening + Fri night need cover. Tap AI suggest cover on either card.', then: function(){ var b = document.querySelector('[data-view="manage"]'); if (b && b.click) b.click(); } }; } },
      { e:'⚠️', label:'Find WTR conflicts',                   action: function () { return { reply:'WTR conflicts: Craig + Rebecca both have only 9h rest after Fri 22:00. Highlighted in red on the grid.', then: function(){ if (typeof runWTRCheck === 'function') runWTRCheck(); } }; } },
      { e:'📤', label:'Publish this week',                     action: function () { return { reply:'Opening Publish week modal…', then: function(){ if (typeof openPublishModal === 'function') openPublishModal(); } }; } },
      { e:'🔁', label:'Find cover for Wed evening',            action: function () { return { reply:'Ranked 4 bank carers by fit · top match: Linda Okafor. Opening cover modal.', then: function(){ if (typeof openCoverModal === 'function') openCoverModal('wed-eve'); } }; } }
    ],
    hr: [
      { e:'📝', label:'Onboard a new nurse',                   action: function () { return { reply:'Opening the Onboarding form preset to permanent clinical · nurse pathway.', navigate:'?as=lo&view=onboarding' }; } },
      { e:'🎓', label:'Who has training expiring this month?', action: function () { return { reply:'1 staff member expiring soon: Joy · DBS in 28 days. Auto-reminder armed at 14d / 7d.', navigate:'?as=lo&view=training' }; } },
      { e:'💷', label:'Approve all timesheets',                action: function () { return { reply:'12 of 16 self-signed · 4 to chase · ready to approve in payroll view.', navigate:'?as=lo&view=payroll' }; } },
      { e:'📊', label:'Run CQC audit pack',                    action: function () { return { reply:'Audit pack: 100% CQC ready · last drill 14 Apr · pack ready to export.', navigate:'kooper-reports.html?as=lo' }; } }
    ],
    'recording-demo': [
      { e:'🎙', label:'Generate today\'s shift note',          action: function () { return { reply:'Drafting your CQC-ready note from today\'s taps…', then: function(){ if (typeof generateNote === 'function') generateNote(); } }; } },
      { e:'🔒', label:'Lock the current note',                 action: function () { return { reply:'Locking the note · audit log fired · Sister Anne notified.', then: function(){ var b = Array.from(document.querySelectorAll('button')).find(function(x){ return (x.textContent||'').trim() === 'Lock note'; }); if (b) b.click(); } }; } },
      { e:'🌙', label:'Switch to night shift recording',       action: function () { return { reply:'Recording domain switched to night-shift mode (mental state + behaviour). Pick the resident from the rail.', then: function(){ var n = document.querySelector('.domain-pill[data-domain="mental"]'); if (n && n.click) n.click(); } }; } },
      { e:'📄', label:'Print today\'s report for Edward',      action: function () { return { reply:'Building print-ready PDF…', then: function(){ if (typeof generateReport === 'function') generateReport('ev-1'); } }; } }
    ],
    clinical: [
      { e:'🩺', label:'NEWS2 alerts · last 24h',               action: function () { return { reply:'2 NEWS2 events: Mr H scored 3 at 14:30 (now 1), Mrs Cross scored 4 (resolved). Tapping into clinical detail.' }; } },
      { e:'💊', label:'Show MAR exceptions',                    action: function () { return { reply:'1 exception: Mr R refused 8am atorvastatin · re-offered 8:30, taken. Logged.' }; } },
      { e:'⚖️', label:'Open Edward\'s problem list',           action: function () { return { reply:'Opening Mr Edward Banda\'s active problems: vascular dementia, falls history, hypertension.' }; } }
    ],
    'care-dashboards': [
      { e:'☀️', label:'Summarise today across the home',       action: function () { return { reply:'Today: 4 staff on shift · 28/30 residents present · 142 notes captured · 0 incidents · 5 actions waiting on you.' }; } },
      { e:'🚨', label:'Show critical alerts',                   action: function () { return { reply:'2 critical: lift fault Marylebone (contractor en route), Mr H sundowning pattern day 4. Click into either to drill in.' }; } },
      { e:'📊', label:'Run audit pack',                         action: function () { return { reply:'Audit pack ready · last drill 14 Apr · CQC 100% green.', navigate:'kooper-reports.html' }; } }
    ],
    reports: [
      { e:'📊', label:'Generate this month\'s CQC pack',       action: function () { return { reply:'Compiling CQC pack from May data · 142 events · 0 incidents · auto-hashed.' }; } },
      { e:'👨‍👩‍👧', label:'Family digest · 22 residents',     action: function () { return { reply:'Family digest queued for 22 residents · privacy boundary applied · scheduled 18:00.' }; } },
      { e:'⚖️', label:'Board pack · 3 sites',                 action: function () { return { reply:'Quarterly board pack for Draycott + Marylebone + Camberwell · KPIs + cost + clinical highlights.' }; } }
    ],
    staff: [
      { e:'⏰', label:'Clock me in',                            action: function () { return { reply:'Clocked in · timesheet started · enjoy your shift.' }; } },
      { e:'📨', label:'Pick up a cover offer',                  action: function () { return { reply:'3 cover offers open: Wed eve · Fri night · Sun day. Opening Requests…', navigate:'kooper-tool.html?app=requests' }; } },
      { e:'🎓', label:'Book a refresher training',              action: function () { return { reply:'Opening training tool with all 8 mandatory courses…', navigate:'kooper-tool.html?app=training' }; } }
    ],
    resident: [
      { e:'🚻', label:'I need help with the toilet',            action: function () { return { reply:'Carer alerted · they\'ll be with you in 2 minutes. Hang tight.' }; } },
      { e:'🥤', label:'I\'m thirsty · ask for a drink',         action: function () { return { reply:'Drink request logged · carer notified.' }; } },
      { e:'📞', label:'Call my family',                         action: function () { return { reply:'Calling Sarah on FaceTime…' }; } }
    ],
    family: [
      { e:'☀️', label:'How was Dad today?',                    action: function () { return { reply:'Today: bright mood, ate 80% of breakfast, joined Music & Memory (sang along to Sinatra), short walk in the garden, settled at 21:30.' }; } },
      { e:'📷', label:'Show today\'s photos',                   action: function () { return { reply:'3 photos from Music & Memory + garden walk · captured by Daniel · privacy-checked.' }; } },
      { e:'📅', label:'When can I visit?',                      action: function () { return { reply:'Open visiting · today 14:00–19:00, tomorrow 10:00–19:00. Want me to book a quiet room?' }; } }
    ],
    'sign-in': [
      { e:'👤', label:'Sign in as Manager (Rae)',              action: function () { return { reply:'Signing you in as Rae · Registered Manager…', navigate:'kooper-hr.html?as=lo' }; } },
      { e:'🩺', label:'Sign in as Nurse (Sister Anne)',        action: function () { return { reply:'Signing you in as Sister Anne · Nurse…', navigate:'kooper-staff.html?as=sa' }; } },
      { e:'🤝', label:'Sign in as Carer (Craig)',              action: function () { return { reply:'Signing you in as Craig · Carer…', navigate:'kooper-staff.html?as=cm' }; } }
    ],
    'care-landing': [
      { e:'🎭', label:'Tour the product',                       action: function () { return { reply:'Starting the product tour from the persona table.' }; } },
      { e:'👤', label:'Sign in to the demo',                    action: function () { return { reply:'Opening sign-in…', navigate:'kooper-sign-in.html' }; } },
      { e:'📊', label:'Show me the architecture',               action: function () { return { reply:'Opening the apps page · 20 microapps grouped into 4 bundles.', navigate:'kooper-apps.html' }; } }
    ],
    apps: [
      { e:'🩹', label:'Open Care Plans Pro bundle',             action: function () { return { reply:'Opening Care Plans Pro bundle.', navigate:'kooper-care-plans.html' }; } },
      { e:'🧰', label:'Open the HR bundle',                     action: function () { return { reply:'Opening the HR launcher.', navigate:'kooper-hr.html' }; } }
    ],
    tool: [
      { e:'✓', label:'Mark this complete',                      action: function () { return { reply:'Marked complete · attribution captured.' }; } },
      { e:'↩︎', label:'Back to my launcher',                  action: function () { return { reply:'Back to your launcher…', navigate:'kooper-staff.html' }; } }
    ],
    ai: [
      { e:'💡', label:'Explain how kooper · ai works',          action: function () { return { reply:'I read your taps and the live data store, draft notes in your provider voice, suggest cover, flag risks, and write CQC-ready prose. Try one of the tasks below.' }; } }
    ],
    default: [
      { e:'🆘', label:'Help me find what I need',              action: function () { return { reply:'Tell me a task and I\'ll route you. e.g. "Find cover for Wed", "Open Edward\'s plan", "Onboard a new carer".' }; } },
      { e:'☀️', label:'Summarise my day',                      action: function () { return { reply:'You have 5 actions waiting on this shift, 3 unseen team activity items, 0 incidents.' }; } }
    ]
  };

  // Per-resident prompts injected when ?resident=ID is present on care-plans
  function withResidentPrompts(rid, base) {
    var nameById = { eb:'Edward', cc:'Catherine', mh:'Hubert', mr:'Reginald', jl:'Joyce', sn:'Sophia', av:'Anika', pc:'Paul' };
    var first = nameById[rid] || 'this resident';
    return [
      { e:'✏️', label:'Edit ' + first + '\'s plan',            action: function () { return { reply:'Opening the editor for ' + first + '…', navigate:'?view=edit&patient=' + rid }; } },
      { e:'🖨', label:'Print ' + first + '\'s plan',           action: function () { return { reply:'Print preview opening…', then: function(){ window.print(); } }; } },
      { e:'⏳', label:'Show pending edits for ' + first,       action: function () { return { reply:'Looking up pending edits for ' + first + ' in the approval queue…' }; } }
    ].concat(base.slice(0, 2));
  }
  function withManagerRotaPrompts(base) {
    return base; // already manager-tuned
  }
  function withHrPrompts(base) {
    return base;
  }

  // ----------------------------------------------------------
  //  WIDGET MARKUP + STYLES
  // ----------------------------------------------------------
  var STYLE_HTML = '\n' +
    '#kAi-fab { position: fixed; right: 1.125rem; bottom: 1.125rem; z-index: 80; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 0.875rem; border-radius: 999px; background: #FFD400; color: #0A0A0A; border: 1px solid #F5B400; font-family: Inter, system-ui, sans-serif; font-weight: 600; font-size: 0.8125rem; cursor: pointer; box-shadow: 0 12px 24px -10px rgba(0,0,0,0.35); transition: all 0.15s ease; }\n' +
    '#kAi-fab:hover { background: #F5B400; transform: translateY(-1px); }\n' +
    '#kAi-fab .kAi-dot { width: 8px; height: 8px; border-radius: 50%; background: #047857; box-shadow: 0 0 0 4px rgba(4,120,87,0.18); }\n' +
    '#kAi-fab.kAi-pulse::after { content: ""; position: absolute; inset: -3px; border-radius: 999px; box-shadow: 0 0 0 0 rgba(255,212,0,0.7); animation: kAiPulse 1.6s ease-out infinite; }\n' +
    '@keyframes kAiPulse { 0% { box-shadow: 0 0 0 0 rgba(255,212,0,0.45); } 100% { box-shadow: 0 0 0 14px rgba(255,212,0,0); } }\n' +
    '#kAi-scrim { position: fixed; inset: 0; background: rgba(10,10,10,0.45); backdrop-filter: blur(3px); z-index: 90; opacity: 0; pointer-events: none; transition: opacity 0.18s ease; }\n' +
    '#kAi-scrim.on { opacity: 1; pointer-events: auto; }\n' +
    '#kAi-panel { position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 100vw); background: #FFFFFF; border-left: 1px solid #ECEAE3; box-shadow: -20px 0 40px -16px rgba(0,0,0,0.25); z-index: 95; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.22s ease; font-family: Inter, system-ui, sans-serif; color: #0A0A0A; }\n' +
    '#kAi-panel.on { transform: translateX(0); }\n' +
    '@media (max-width: 480px) { #kAi-panel { width: 100vw; } }\n' +
    '#kAi-head { padding: 0.875rem 1rem; border-bottom: 1px solid #ECEAE3; background: #0A0A0A; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-shrink: 0; }\n' +
    '#kAi-head .kAi-title { display: flex; align-items: center; gap: 0.5rem; font-family: \'Space Grotesk\', sans-serif; font-weight: 600; font-size: 0.9375rem; }\n' +
    '#kAi-head .kAi-bolt { width: 24px; height: 24px; border-radius: 6px; background: #FFD400; color: #0A0A0A; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }\n' +
    '#kAi-head .kAi-close { background: transparent; color: rgba(255,255,255,0.7); border: 0; cursor: pointer; font-size: 1.25rem; line-height: 1; padding: 0.25rem 0.5rem; border-radius: 6px; }\n' +
    '#kAi-head .kAi-close:hover { background: rgba(255,255,255,0.1); color: #FFFFFF; }\n' +
    '#kAi-body { flex: 1; overflow-y: auto; padding: 0.875rem 1rem; display: flex; flex-direction: column; gap: 0.75rem; background: #FAFAF7; }\n' +
    '.kAi-bubble { max-width: 90%; padding: 0.625rem 0.75rem; border-radius: 12px; font-size: 0.875rem; line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }\n' +
    '.kAi-bubble.kAi-bot { background: #FFFFFF; border: 1px solid #ECEAE3; align-self: flex-start; border-top-left-radius: 4px; }\n' +
    '.kAi-bubble.kAi-user { background: #0A0A0A; color: #FFFFFF; align-self: flex-end; border-top-right-radius: 4px; }\n' +
    '.kAi-bubble strong { color: #876300; font-weight: 600; }\n' +
    '.kAi-bubble.kAi-user strong { color: #FFD400; }\n' +
    '.kAi-suggestions { display: flex; flex-wrap: wrap; gap: 0.375rem; padding: 0.25rem 0; }\n' +
    '.kAi-chip { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.4375rem 0.625rem; border-radius: 10px; background: #FFFFFF; border: 1px solid #ECEAE3; cursor: pointer; font-family: inherit; font-size: 0.75rem; color: #1A1A1A; line-height: 1.2; transition: all 0.12s ease; text-align: left; }\n' +
    '.kAi-chip:hover { border-color: #0A0A0A; background: #FAFAF7; }\n' +
    '.kAi-chip .kAi-emoji { font-size: 0.875rem; line-height: 1; }\n' +
    '#kAi-foot { padding: 0.625rem 0.75rem; border-top: 1px solid #ECEAE3; background: #FFFFFF; display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }\n' +
    '#kAi-input { flex: 1; min-width: 0; padding: 0.5rem 0.75rem; border: 1px solid #ECEAE3; border-radius: 10px; font-family: inherit; font-size: 0.875rem; outline: 0; transition: border-color 0.12s ease; background: #FAFAF7; color: #0A0A0A; }\n' +
    '#kAi-input:focus { border-color: #0A0A0A; background: #FFFFFF; }\n' +
    '#kAi-send { padding: 0.5rem 0.875rem; border-radius: 10px; background: #0A0A0A; color: #FFFFFF; border: 0; font-family: inherit; font-weight: 600; font-size: 0.8125rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.375rem; transition: background 0.12s ease; }\n' +
    '#kAi-send:hover { background: #1A1A1A; }\n' +
    '#kAi-send[disabled] { opacity: 0.4; cursor: not-allowed; }\n' +
    '.kAi-context-strip { padding: 0.625rem 0.75rem; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; font-size: 0.6875rem; color: #876300; font-family: \'JetBrains Mono\', monospace; text-transform: uppercase; letter-spacing: 0.06em; }\n' +
    '.kAi-section-label { font-family: \'JetBrains Mono\', monospace; font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280; font-weight: 600; padding: 0.25rem 0; }\n' +
    '\n';

  function injectStyles() {
    var s = document.createElement('style');
    s.id = 'kAi-styles';
    s.textContent = STYLE_HTML;
    document.head.appendChild(s);
  }
  function injectMarkup() {
    var fab = document.createElement('button');
    fab.id = 'kAi-fab';
    fab.className = 'kAi-pulse';
    fab.setAttribute('aria-label', 'Ask kooper · ai');
    fab.innerHTML = '<span class="kAi-dot" aria-hidden="true"></span><span>kooper · ai</span>';
    fab.addEventListener('click', open);
    document.body.appendChild(fab);

    var scrim = document.createElement('div');
    scrim.id = 'kAi-scrim';
    scrim.addEventListener('click', close);
    document.body.appendChild(scrim);

    var panel = document.createElement('div');
    panel.id = 'kAi-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'kooper · ai assistant');
    panel.innerHTML =
      '<div id="kAi-head">' +
        '<div class="kAi-title"><span class="kAi-bolt">✦</span><span>kooper · ai</span><span id="kAi-pageLabel" style="font-weight:400;opacity:0.6;font-size:0.75rem;font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:0.06em"></span></div>' +
        '<button class="kAi-close" aria-label="Close">×</button>' +
      '</div>' +
      '<div id="kAi-body"></div>' +
      '<div id="kAi-foot">' +
        '<input id="kAi-input" type="text" placeholder="Ask anything · or tap a suggestion above" autocomplete="off">' +
        '<button id="kAi-send" type="button">Send →</button>' +
      '</div>';
    document.body.appendChild(panel);

    panel.querySelector('.kAi-close').addEventListener('click', close);
    panel.querySelector('#kAi-send').addEventListener('click', sendInput);
    panel.querySelector('#kAi-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendInput(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('on')) close();
    });
  }
  function injectNavLink() {
    // Best-effort: try to add a discreet text link "kooper · ai" to the page nav.
    // If a nav contains the Hints button, append there. Otherwise skip silently.
    var anchor = document.getElementById('kooperHintsBtn');
    if (!anchor) return;
    if (document.getElementById('kAi-nav-link')) return;
    var link = document.createElement('button');
    link.id = 'kAi-nav-link';
    link.type = 'button';
    link.setAttribute('aria-label', 'Ask kooper · ai');
    var navIsDark = (anchor.closest('nav') || {}).className && /kapture-black|bg-black|text-white/.test(anchor.closest('nav').className);
    link.style.cssText = 'display:inline-flex;align-items:center;gap:0.375rem;padding:0.25rem 0.625rem;border-radius:999px;background:rgba(255,212,0,0.18);color:#FFD400;border:1px solid rgba(255,212,0,0.35);font-size:0.6875rem;font-weight:600;line-height:1;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap';
    if (!navIsDark) {
      link.style.background = '#FFFBEB'; link.style.color = '#876300'; link.style.borderColor = 'rgba(255,212,0,0.55)';
    }
    link.innerHTML = '<span aria-hidden="true">✦</span><span>ai</span>';
    link.addEventListener('click', open);
    anchor.parentNode.insertBefore(link, anchor);
  }

  // ----------------------------------------------------------
  //  PANEL OPEN / CLOSE + RENDER
  // ----------------------------------------------------------
  function open() {
    var ctx = CTX();
    var pl = document.getElementById('kAi-pageLabel'); if (pl) pl.textContent = '· ' + ctx.page;
    var body = document.getElementById('kAi-body');
    body.innerHTML = '';
    pushBot(ctx.greet);
    addSuggestionsBlock(ctx.prompts);
    document.getElementById('kAi-scrim').classList.add('on');
    document.getElementById('kAi-panel').classList.add('on');
    var fab = document.getElementById('kAi-fab'); if (fab) fab.classList.remove('kAi-pulse');
    setTimeout(function () { var i = document.getElementById('kAi-input'); if (i) i.focus(); }, 240);
  }
  function close() {
    document.getElementById('kAi-scrim').classList.remove('on');
    document.getElementById('kAi-panel').classList.remove('on');
  }

  function pushBot(html) {
    var b = document.getElementById('kAi-body');
    var bub = document.createElement('div');
    bub.className = 'kAi-bubble kAi-bot';
    bub.innerHTML = html;
    b.appendChild(bub);
    b.scrollTop = b.scrollHeight;
  }
  function pushUser(text) {
    var b = document.getElementById('kAi-body');
    var bub = document.createElement('div');
    bub.className = 'kAi-bubble kAi-user';
    bub.textContent = text;
    b.appendChild(bub);
    b.scrollTop = b.scrollHeight;
  }
  function addSuggestionsBlock(prompts) {
    var b = document.getElementById('kAi-body');
    var label = document.createElement('div');
    label.className = 'kAi-section-label';
    label.textContent = 'Suggested for this page';
    b.appendChild(label);
    var wrap = document.createElement('div');
    wrap.className = 'kAi-suggestions';
    prompts.forEach(function (p) {
      var c = document.createElement('button');
      c.className = 'kAi-chip';
      c.type = 'button';
      c.innerHTML = (p.e ? '<span class="kAi-emoji">' + p.e + '</span>' : '') + '<span>' + p.label + '</span>';
      c.addEventListener('click', function () { runPrompt(p); });
      wrap.appendChild(c);
    });
    b.appendChild(wrap);
    b.scrollTop = b.scrollHeight;
  }

  function runPrompt(p) {
    pushUser(p.label);
    var result = (typeof p.action === 'function') ? p.action() : { reply: 'Done.' };
    if (typeof result === 'string') result = { reply: result };
    pushBot(result.reply || 'Done.');
    if (typeof result.then === 'function') setTimeout(result.then, 320);
    if (result.navigate) setTimeout(function () { window.location.href = result.navigate; }, 480);
  }

  // Free-text input — pattern matches against known prompts; otherwise generic reply
  function sendInput() {
    var i = document.getElementById('kAi-input');
    var v = (i.value || '').trim();
    if (!v) return;
    pushUser(v);
    i.value = '';
    var match = matchToPrompt(v);
    if (match) {
      var result = (typeof match.action === 'function') ? match.action() : { reply:'Got it.' };
      if (typeof result === 'string') result = { reply: result };
      setTimeout(function () {
        pushBot(result.reply || 'Got it.');
        if (typeof result.then === 'function') setTimeout(result.then, 320);
        if (result.navigate) setTimeout(function () { window.location.href = result.navigate; }, 480);
      }, 280);
      return;
    }
    setTimeout(function () {
      pushBot('Got you. In the live build I\'d run that for you. For now, tap one of the suggestions above and I\'ll show you the demo flow.');
    }, 280);
  }
  function matchToPrompt(v) {
    var ctx = CTX();
    var lower = v.toLowerCase();
    return ctx.prompts.find(function (p) {
      var l = p.label.toLowerCase();
      // Loose contains check on either side
      return lower.indexOf(l) > -1 || l.indexOf(lower) > -1 || keywordsOverlap(lower, l);
    });
  }
  function keywordsOverlap(a, b) {
    var stop = ' the a an for me my of in on with this what who when how '.split(' ');
    var aw = a.split(/\W+/).filter(function (w) { return w.length > 2 && stop.indexOf(' ' + w + ' ') < 0; });
    var bw = b.split(/\W+/).filter(function (w) { return w.length > 2 && stop.indexOf(' ' + w + ' ') < 0; });
    var hits = aw.filter(function (w) { return bw.indexOf(w) > -1; }).length;
    return hits >= 2;
  }

  // ----------------------------------------------------------
  //  SURFACE DETECTION — marketing vs app
  //  The floating FAB only renders on app surfaces. Marketing
  //  pages (landing, apps catalogue, ai product deep-dive,
  //  app deep-dive, sign-in) get a regular nav link to the
  //  ai product page instead.
  // ----------------------------------------------------------
  function isMarketingSurface() {
    var name = pageKey();
    var marketing = ['care-landing','apps','app','ai','sign-in'];
    return marketing.indexOf(name) >= 0;
  }

  // ----------------------------------------------------------
  //  BOOT
  // ----------------------------------------------------------
  function boot() {
    if (!document.body || document.body.tagName !== 'BODY') return;
    if (isMarketingSurface()) return; // no FAB / no nav-pill on marketing pages
    injectStyles();
    injectMarkup();
    // injectNavLink() intentionally NOT called — the floating FAB is the
    // only AI entry point on app surfaces; the duplicate nav pill is
    // removed for navigation clarity.
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
