/* ============================================================
   kooper · report template — editorial PDF engine
   --------------------------------------------------------------
   Single source of truth for all reports across kooper · care.
   Four entity types share one editorial layout that mirrors the
   kooper · clinical workspace (Mr Edward Banda canonical view):

     - openCarePlan(planId)      — full care plan v.N export
     - openIncident(event)       — incident / event report
     - openClinical(patientId)   — patient clinical summary
     - openShift(shiftMeta, evs) — compiled shift report

   Each call opens a print-ready A4 document in a new tab with:
     · Branded masthead + identity banner
     · Three-column editorial layout (collapses on print)
     · Kicker / H1 / italic deck / meta strip / prose body
     · Active medications + allergies + interventions sidebar
     · Escalation panel + audit hash + signoff
     · Toolbar with Print/PDF + Send to all staff + Close

   "Send to all staff" pushes a notification to every staff
   persona in the kooper-session roster and stores the report
   blob under kooper:reports:shared so it can surface on each
   staff member's launcher under "Reports shared with me".
   ============================================================ */
(function () {
  'use strict';

  // ----- localStorage helpers (mirror care plans) -------------
  function load(key, fallback) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function nowISO() { return new Date().toISOString(); }
  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtDateTime(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function uid(prefix) { return (prefix || 'r') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // ----- Patient lookup (care plans roster) -------------------
  var SAMPLE_PATIENTS = [
    { id:'eb', name:'Mr Edward Banda',     pref:'Eddie',   age:78, room:'12', nhs:'485 777 3456', condition:'Mixed anxiety & depressive disorder', funding:'NHS CHC' },
    { id:'cc', name:'Mrs Catherine Cross', pref:'Cathy',   age:84, room:'07', nhs:'485 222 1180', condition:'End-of-life · diabetic + soft diet',  funding:'Self-fund' },
    { id:'mh', name:'Mr Hubert Robinson',  pref:'Mr H',    age:81, room:'15', nhs:'485 909 4422', condition:'MUAC <22 · high-protein · frailty',   funding:'LA' },
    { id:'mr', name:'Mr Reginald Asare',   pref:'Mr R',    age:73, room:'04', nhs:'485 113 9087', condition:'Post-stroke · rehab phase',           funding:'NHS CHC' },
    { id:'jl', name:'Mrs Joyce Lambert',   pref:'Joyce',   age:88, room:'19', nhs:'485 660 2244', condition:'Late-stage dementia · BPSD',          funding:'LA' },
    { id:'sn', name:'Ms Sophia Nakamura',  pref:'Sophia',  age:69, room:'21', nhs:'485 401 5588', condition:'Respite · 2 week stay · MS',          funding:'Self-fund' },
    { id:'pc', name:'Mr Paul Cosgrove',    pref:'Paul',    age:76, room:'09', nhs:'485 818 7711', condition:'New admission · awaiting plan',       funding:'LA' },
    { id:'av', name:'Mrs Anika Verma',     pref:'Anika',   age:91, room:'02', nhs:'485 232 0006', condition:'Frailty · falls · arrhythmia',        funding:'Mixed' }
  ];

  function patientById(id) {
    var roster = load('kooper:carePlans:patients', SAMPLE_PATIENTS);
    return roster.find(function (p) { return p.id === id; }) || null;
  }
  function planFor(id) {
    var plans = load('kooper:carePlans:plans', {});
    return plans[id] || null;
  }

  // Demo seed for clinical (Edward Banda canonical) — also used by patient profile
  var CLINICAL_SEED = {
    eb: {
      problems: [
        { code:'F41.2', label:'Mixed anxiety & depressive disorder', flag:'#FCD34D', status:'Active · monitor', since:'Jul 2019', lead:'Dr S. Whitfield (GP)' },
        { code:'F90.0', label:'ADHD',                                 flag:'#10B981', status:'Stable',           since:'2008',     lead:'Dr S. Whitfield (GP)' },
        { code:'6B41',  label:'Complex PTSD',                         flag:'#F59E0B', status:'Active · therapy', since:'Mar 2018', lead:'CMHT · D. Patel' },
        { code:'G31.84',label:'Mild cognitive impairment',            flag:'#10B981', status:'Annual review',    since:'Nov 2024', lead:'Memory Clinic' },
        { code:'M16.5', label:'Osteoarthritis · L hip',                flag:'#10B981', status:'Stable',           since:'2015',     lead:'GP' }
      ],
      mha: [{ label:'S117 aftercare', state:'Active' }, { label:'CTO history', state:'2 prior' }],
      dols: [{ label:'DoLS authorisation', state:'Renew 5d' }],
      meds: [
        { name:'Sertraline 100mg',       sched:'OD'  },
        { name:'Mirtazapine 15mg',       sched:'ON'  },
        { name:'Methylphenidate XR 36mg',sched:'OD'  },
        { name:'Co-codamol 8/500mg',     sched:'PRN' },
        { name:'Lansoprazole 30mg',      sched:'OD'  },
        { name:'Vitamin D3 800IU',       sched:'OD'  }
      ],
      allergies: [
        { name:'Penicillin', note:'rash' },
        { name:'No food allergies', note:null }
      ],
      interventions: [
        { time:'08:00', label:'Morning meds + breakfast obs', state:'done' },
        { time:'10:30', label:'Music therapy session',         state:'done' },
        { time:'14:00', label:'Walking group · garden loop',   state:'next' },
        { time:'17:00', label:'Mood scale · GAD-7',            state:'next' },
        { time:'21:00', label:'Night meds + sleep hygiene',    state:'pending' }
      ],
      escalation: [
        'GAD-7 ≥ 15 → notify Dr Whitfield same shift',
        'Persistent low mood 7+ days → CMHT review pack',
        'Falls × 2 in week → physio review + room layout audit'
      ]
    }
  };

  // ----- Sender / audit ---------------------------------------
  function getSender() {
    try {
      if (window.kooperSession && window.kooperSession.get) {
        var s = window.kooperSession.get();
        if (s) return { name: s.name, role: s.role };
      }
    } catch(e){}
    var asId = (new URLSearchParams(window.location.search)).get('as');
    return { name: asId ? asId.toUpperCase() : 'kooper · staff', role: 'Care team' };
  }

  function pushSharedReport(meta) {
    var shared = load('kooper:reports:shared', []);
    shared.unshift(meta);
    save('kooper:reports:shared', shared.slice(0, 80));
    // Also push a notification each staff persona will see
    var notif = load('kooper:carePlans:notif', []);
    notif.unshift({
      id: uid('rep'),
      type: 'review',
      patientId: meta.patientId || null,
      section: 'Report shared · ' + meta.title,
      by: meta.sender,
      at: meta.sentAt,
      seen: false,
      reportId: meta.id
    });
    save('kooper:carePlans:notif', notif.slice(0, 60));
  }

  // ============================================================
  // SHARED DOCUMENT SHELL
  // ============================================================
  // All four report types use this skeleton. The body is built
  // by per-type sectionHTML() functions below.
  // ============================================================
  function buildShell(opts) {
    // opts: { kicker, scope, title, deck, doc, meta, identity,
    //         leftHTML, rightHTML, bodyHTML, footerNote, reportId,
    //         sender, patientId, sendable, brandTitle }
    var sentAtISO = nowISO();
    var docId = opts.reportId || ('KR-' + (opts.scope || 'DOC').toUpperCase().slice(0,4) + '-' + new Date().getFullYear() + '-' + Date.now().toString(36).toUpperCase());
    var title = (opts.brandTitle || 'kooper · ' + (opts.scope || 'report')) + ' — ' + opts.title;

    return '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="UTF-8" />\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
'<title>' + esc(title) + '</title>\n' +
'<link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
'<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet" />\n' +
'<style>\n' +
STYLES +
'</style>\n' +
'</head>\n' +
'<body>\n' +
toolbarHTML(opts.sendable !== false, docId, opts) +
mastheadHTML(opts) +
identityHTML(opts.identity) +
'<main class="report-grid">\n' +
'  <aside class="rep-left">' + (opts.leftHTML || '') + '</aside>\n' +
'  <section class="rep-centre">' +
'    <article class="editorial-doc">' +
'      <header class="ed-masthead">' +
'        <span class="vol">kooper · ' + esc(opts.scope || 'report') + '</span>' +
'        <span class="vol">' + esc(opts.docVol || 'Vol. 1') + '</span>' +
'      </header>' +
'      <div class="ed-kicker">' + esc(opts.kicker || 'Active · current') + '</div>' +
'      <h1 class="ed-h1">' + esc(opts.title) + '</h1>' +
(opts.deck ? '      <p class="ed-deck">' + esc(opts.deck) + '</p>' : '') +
'      <div class="ed-byline">' + (opts.meta || []).map(function(m){ return '<span><strong>' + esc(m.label) + '</strong> · ' + esc(m.value) + '</span>'; }).join('') + '</div>' +
'      <div class="ed-prose">' + (opts.bodyHTML || '') + '</div>' +
(opts.footerNote ? '      <div class="ed-divider"><span class="glyph">· · ·</span></div><p class="ed-footnote">' + esc(opts.footerNote) + '</p>' : '') +
'    </article>' +
'  </section>\n' +
'  <aside class="rep-right">' + (opts.rightHTML || '') + '</aside>\n' +
'</main>\n' +
auditHTML(docId, opts.sender || getSender(), sentAtISO) +
signoffHTML(opts.sender || getSender()) +
footerHTML() +
'<script>(function(){\n' +
'  var REPORT = ' + JSON.stringify({
    id: docId,
    scope: opts.scope || 'report',
    title: opts.title,
    patientId: opts.patientId || null,
    sender: opts.sender || getSender(),
    sentAt: sentAtISO
  }) + ';\n' +
'  window.__rep_print = function(){ window.print(); };\n' +
'  window.__rep_close = function(){ window.close(); };\n' +
'  window.__rep_send = function(){\n' +
'    try {\n' +
'      var key = "kooper:reports:shared";\n' +
'      var shared = JSON.parse(localStorage.getItem(key) || "[]");\n' +
'      shared.unshift({\n' +
'        id: REPORT.id, scope: REPORT.scope, title: REPORT.title,\n' +
'        patientId: REPORT.patientId, sender: REPORT.sender, sentAt: REPORT.sentAt,\n' +
'        url: window.location.href, recipients: "all-staff"\n' +
'      });\n' +
'      localStorage.setItem(key, JSON.stringify(shared.slice(0,80)));\n' +
'      var nkey = "kooper:carePlans:notif";\n' +
'      var notif = JSON.parse(localStorage.getItem(nkey) || "[]");\n' +
'      notif.unshift({\n' +
'        id: "rep_" + Date.now().toString(36),\n' +
'        type: "review", patientId: REPORT.patientId,\n' +
'        section: "Report shared · " + REPORT.title,\n' +
'        by: REPORT.sender.name, at: REPORT.sentAt, seen: false,\n' +
'        reportId: REPORT.id\n' +
'      });\n' +
'      localStorage.setItem(nkey, JSON.stringify(notif.slice(0,60)));\n' +
'      var btn = document.getElementById("repSendBtn");\n' +
'      if (btn) { btn.textContent = "✓ Sent to all staff"; btn.disabled = true; btn.classList.add("sent"); }\n' +
'      var t = document.getElementById("repToast");\n' +
'      if (t) { t.textContent = "Report shared with all staff · they will see it on their dashboard"; t.classList.add("on"); setTimeout(function(){ t.classList.remove("on"); }, 3000); }\n' +
'    } catch(e){ alert("Could not share — storage error: " + e.message); }\n' +
'  };\n' +
'})();<' + '/script>\n' +
'<div id="repToast" class="rep-toast"></div>\n' +
'</body>\n' +
'</html>';
  }

  // ============================================================
  // SHELL FRAGMENTS
  // ============================================================
  var STYLES = [
    '@page { size: A4; margin: 14mm 12mm; }',
    '* { box-sizing: border-box; }',
    'html { scroll-behavior: smooth; }',
    'body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #F5F5F5; color: #0A0A0A; -webkit-font-smoothing: antialiased; }',
    '.report-grid { max-width: 1280px; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; display: grid; grid-template-columns: 18rem 1fr 18rem; gap: 1.25rem; align-items: start; }',
    '@media (max-width: 1100px) { .report-grid { grid-template-columns: 1fr; } .rep-left, .rep-right { order: 2; } .rep-centre { order: 1; } }',
    '.surface { background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:1rem 1.125rem; }',
    '.surface + .surface { margin-top:1rem; }',
    '.surface h3 { margin:0 0 0.625rem; font-family: Space Grotesk, sans-serif; font-size:0.6875rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#6B7280; }',
    '.surface h3 .count { float:right; font-family:JetBrains Mono,monospace; font-size:0.625rem; color:#9A9A9A; background:#F5F5F5; padding:0.125rem 0.4rem; border-radius:999px; }',
    '.list-row { display:flex; align-items:flex-start; gap:0.625rem; padding:0.5rem 0; border-bottom:1px solid #F3F4F6; font-size:0.8125rem; }',
    '.list-row:last-child { border-bottom:0; }',
    '.list-row .flag { width:6px; height:18px; border-radius:3px; margin-top:2px; flex-shrink:0; }',
    '.list-row .ttl { flex:1; line-height:1.35; }',
    '.list-row .meta { font-family:JetBrains Mono, monospace; font-size:0.625rem; color:#9A9A9A; }',
    '.med-row { display:flex; align-items:center; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid #F3F4F6; font-size:0.8125rem; }',
    '.med-row:last-child { border-bottom:0; }',
    '.med-row .nm { font-weight:500; color:#0A0A0A; }',
    '.med-row .sch { font-family:JetBrains Mono, monospace; font-size:0.6875rem; padding:0.125rem 0.5rem; border-radius:999px; background:#0A0A0A; color:#FFD400; font-weight:700; letter-spacing:0.04em; }',
    '.med-row .sch.prn { background:#FFFBEB; color:#876300; border:1px solid #FCD34D; }',
    '.dot { display:inline-block; width:6px; height:6px; border-radius:50%; flex-shrink:0; }',
    '.dot.ok { background:#10B981; } .dot.next { background:#FFD400; } .dot.pending { background:#D4D4D4; }',
    '.intv-row { display:flex; align-items:center; gap:0.5rem; padding:0.4rem 0; border-bottom:1px solid #F3F4F6; font-size:0.8125rem; }',
    '.intv-row:last-child { border-bottom:0; }',
    '.intv-row .tm { font-family:JetBrains Mono, monospace; font-size:0.6875rem; color:#6B7280; min-width:2.6rem; }',
    '.intv-row .lbl { flex:1; }',
    '.escalation { background:linear-gradient(180deg,#FFFBEB 0%,#FFF6CC 100%); border:1px solid #FCD34D; border-radius:14px; padding:1rem 1.125rem; }',
    '.escalation h3 { margin:0 0 0.625rem; font-family:Space Grotesk, sans-serif; font-size:0.6875rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#876300; }',
    '.escalation ul { margin:0; padding-left:1.1rem; font-family:Source Serif 4, Georgia, serif; font-size:0.875rem; color:#1A1A1A; line-height:1.55; }',
    '.escalation ul li { margin-bottom:0.375rem; }',

    /* MASTHEAD + IDENTITY */
    '.rep-masthead { background: linear-gradient(180deg,#0A0A0A 0%,#1A1A1A 100%); color:#fff; }',
    '.rep-masthead .inner { max-width:1280px; margin:0 auto; padding:0.875rem 1.25rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }',
    '.rep-brand { display:flex; align-items:center; gap:0.625rem; font-family:Space Grotesk, sans-serif; }',
    '.rep-brand svg { width:24px; height:24px; flex-shrink:0; }',
    '.rep-brand .b1 { font-weight:600; font-size:1rem; letter-spacing:-0.01em; }',
    '.rep-brand .b2 { color:#FFD400; font-weight:500; font-size:0.875rem; }',
    '.rep-doc-meta { text-align:right; font-family:JetBrains Mono, monospace; font-size:0.6875rem; color:#9A9A9A; line-height:1.55; }',
    '.rep-doc-meta strong { color:#FFD400; font-weight:600; }',
    '.rep-id-banner { background: linear-gradient(180deg,#1A1A1A 0%,#0A0A0A 100%); color:#fff; }',
    '.rep-id-banner .inner { max-width:1280px; margin:0 auto; padding:0.875rem 1.25rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }',
    '.rep-id-banner .id-left { display:flex; align-items:center; gap:0.875rem; flex-wrap:wrap; }',
    '.rep-id-banner .avatar { width:2.5rem; height:2.5rem; border-radius:0.625rem; background:#FFD400; color:#0A0A0A; display:flex; align-items:center; justify-content:center; font-family:Space Grotesk, sans-serif; font-weight:700; font-size:0.875rem; }',
    '.rep-id-banner h2 { margin:0; font-family:Space Grotesk, sans-serif; font-size:1.0625rem; font-weight:600; }',
    '.rep-id-banner .id-meta { color:rgba(255,255,255,0.65); font-size:0.75rem; margin-top:0.125rem; }',
    '.id-pill { padding:0.25rem 0.625rem; border-radius:999px; font-size:0.6875rem; font-weight:600; background:#fff; color:#0A0A0A; }',
    '.id-chip { padding:0.25rem 0.625rem; border-radius:999px; font-size:0.6875rem; font-weight:500; background:transparent; color:#fff; border:1px solid rgba(255,255,255,0.25); }',
    '.id-chip.warn { background:rgba(255,212,0,0.2); color:#FFD400; border-color:rgba(255,212,0,0.5); }',
    '.id-chip.ok { background:rgba(16,185,129,0.15); color:#86EFAC; border-color:rgba(16,185,129,0.35); }',

    /* EDITORIAL CENTRE */
    '.editorial-doc { background:#FAFAF7; padding:2.25rem 2.5rem 2.5rem; border-radius:18px; border:1px solid #ECEAE3; }',
    '@media (max-width:720px) { .editorial-doc { padding:1.5rem 1.25rem 1.75rem; } }',
    '.ed-masthead { display:flex; align-items:center; justify-content:space-between; padding-bottom:0.875rem; border-bottom:2px solid #0A0A0A; margin-bottom:1.5rem; }',
    '.ed-masthead .vol { font-family:JetBrains Mono, monospace; font-size:0.6875rem; letter-spacing:0.14em; text-transform:uppercase; color:#6B7280; }',
    '.ed-kicker { font-family:JetBrains Mono, monospace; font-size:0.6875rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#876300; margin-bottom:0.5rem; display:inline-flex; align-items:center; gap:0.5rem; }',
    '.ed-kicker::before { content:""; width:24px; height:2px; background:#FFD400; display:inline-block; }',
    '.ed-h1 { font-family:Space Grotesk, sans-serif; font-weight:600; font-size:clamp(2rem,3.4vw,2.75rem); line-height:1.06; letter-spacing:-0.02em; color:#0A0A0A; margin:0 0 0.5rem; }',
    '.ed-deck { font-family:Source Serif 4, Georgia, serif; font-weight:400; font-style:italic; font-size:clamp(1.0625rem,1.3vw,1.1875rem); line-height:1.5; color:#3A3A3A; max-width:42ch; margin:0; }',
    '.ed-byline { font-family:JetBrains Mono, monospace; font-size:0.7rem; color:#6B7280; padding:0.75rem 0; border-top:1px solid #ECEAE3; border-bottom:1px solid #ECEAE3; margin:1.25rem 0 1.5rem; display:flex; flex-wrap:wrap; gap:0.5rem 1.25rem; }',
    '.ed-byline strong { color:#0A0A0A; font-weight:600; }',
    '.ed-prose { font-family:Source Serif 4, Georgia, serif; font-size:1.0625rem; line-height:1.7; color:#1A1A1A; }',
    '.ed-prose p { margin:0 0 1em; }',
    '.ed-prose p + p { text-indent:1.2em; }',
    '.ed-prose p.no-indent + p, .ed-prose p:first-of-type + p { text-indent:0; }',
    '.ed-h2 { font-family:Space Grotesk, sans-serif; font-weight:600; font-size:clamp(1.4rem,2vw,1.625rem); line-height:1.15; letter-spacing:-0.012em; color:#0A0A0A; margin:1.75rem 0 0.5rem; }',
    '.ed-label { font-family:JetBrains Mono, monospace; font-size:0.6875rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6B7280; margin:1.25rem 0 0.375rem; padding-left:0.75rem; border-left:2px solid #FFD400; }',
    '.ed-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem 1.5rem; margin:1.25rem 0 1.5rem; padding:1rem 0; border-top:1px solid #ECEAE3; border-bottom:1px solid #ECEAE3; }',
    '.ed-stat .stat-label { font-family:JetBrains Mono, monospace; font-size:0.6875rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6B7280; margin-bottom:0.25rem; }',
    '.ed-stat .stat-value { font-family:Space Grotesk, sans-serif; font-weight:600; font-size:1.25rem; color:#0A0A0A; line-height:1.1; }',
    '.ed-stat .stat-foot { font-family:Source Serif 4, Georgia, serif; font-size:0.8125rem; color:#6B7280; margin-top:0.125rem; font-style:italic; }',
    '.ed-divider { display:flex; align-items:center; justify-content:center; gap:0.875rem; margin:2rem 0; color:#D4D4D4; }',
    '.ed-divider::before, .ed-divider::after { content:""; flex:1; height:1px; background:#ECEAE3; }',
    '.ed-divider .glyph { font-family:JetBrains Mono, monospace; font-size:0.875rem; letter-spacing:0.4em; color:#6B7280; }',
    '.ed-footnote { font-family:JetBrains Mono, monospace; font-size:0.6875rem; color:#6B7280; line-height:1.55; }',
    '.ed-pull { background:#FFFBEB; border-left:3px solid #FFD400; padding:1rem 1.125rem; border-radius:0 10px 10px 0; font-family:Source Serif 4, Georgia, serif; font-size:1rem; line-height:1.55; color:#1A1A1A; margin:1.25rem 0; }',
    '.ed-pull strong { font-family:Space Grotesk, sans-serif; font-weight:600; }',

    /* AUDIT + SIGNOFF + FOOTER */
    '.audit { max-width:1280px; margin:1.25rem auto 0; padding:0 1.25rem; }',
    '.audit-card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:1rem 1.125rem; display:grid; grid-template-columns:repeat(4,1fr); gap:0.875rem; }',
    '@media (max-width:720px) { .audit-card { grid-template-columns:repeat(2,1fr); } }',
    '.audit-cell .lbl { font-family:JetBrains Mono, monospace; font-size:0.625rem; letter-spacing:0.08em; text-transform:uppercase; color:#6B7280; }',
    '.audit-cell .val { font-family:JetBrains Mono, monospace; font-size:0.8125rem; color:#0A0A0A; margin-top:0.125rem; word-break:break-all; }',
    '.signoff { max-width:1280px; margin:1.25rem auto 0; padding:0 1.25rem; }',
    '.signoff-card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; padding:1.25rem 1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:2rem; }',
    '@media (max-width:600px) { .signoff-card { grid-template-columns:1fr; } }',
    '.sig-block .lbl { font-family:JetBrains Mono, monospace; font-size:0.6875rem; letter-spacing:0.08em; text-transform:uppercase; color:#6B7280; margin-bottom:0.75rem; }',
    '.sig-block .line { border-bottom:1px solid #0A0A0A; height:2.75rem; margin-bottom:0.375rem; }',
    '.sig-block .nm { font-size:0.8125rem; color:#6B7280; font-family:JetBrains Mono, monospace; }',
    '.rep-foot { max-width:1280px; margin:1.25rem auto 0; padding:0.875rem 1.25rem 2rem; font-family:JetBrains Mono, monospace; font-size:0.625rem; color:#9A9A9A; text-align:center; }',

    /* TOOLBAR */
    '.rep-toolbar { position:sticky; top:0; z-index:60; background:#0A0A0A; color:#fff; padding:0.625rem 1rem; display:flex; align-items:center; justify-content:space-between; gap:0.625rem; flex-wrap:wrap; }',
    '.rep-toolbar .left { font-family:JetBrains Mono, monospace; font-size:0.6875rem; color:rgba(255,255,255,0.7); }',
    '.rep-toolbar .left strong { color:#FFD400; font-weight:600; }',
    '.rep-toolbar .right { display:flex; gap:0.5rem; flex-wrap:wrap; }',
    '.rep-btn { padding:0.5rem 0.875rem; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:#fff; font-size:0.8125rem; font-weight:500; cursor:pointer; font-family:Inter, system-ui, sans-serif; transition:all 0.15s ease; }',
    '.rep-btn:hover { background:#1A1A1A; }',
    '.rep-btn.primary { background:#FFD400; color:#0A0A0A; border-color:#FFD400; font-weight:600; }',
    '.rep-btn.primary:hover { background:#F5B400; }',
    '.rep-btn.send { background:transparent; color:#FFD400; border-color:rgba(255,212,0,0.5); }',
    '.rep-btn.send:hover { background:#FFD400; color:#0A0A0A; }',
    '.rep-btn.send.sent { background:rgba(16,185,129,0.15); color:#86EFAC; border-color:rgba(16,185,129,0.35); cursor:default; }',
    '.rep-btn[disabled] { opacity:0.6; cursor:default; }',

    /* TOAST */
    '.rep-toast { position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%); background:#0A0A0A; color:#FFD400; padding:0.75rem 1.25rem; border-radius:10px; font-size:0.875rem; font-weight:500; box-shadow:0 12px 30px -8px rgba(0,0,0,0.3); z-index:100; opacity:0; transition:opacity 0.2s ease; pointer-events:none; }',
    '.rep-toast.on { opacity:1; }',

    /* PRINT */
    '@media print {',
    '  .rep-toolbar, .rep-toast { display:none !important; }',
    '  body { background:#fff; }',
    '  .report-grid { grid-template-columns:1fr; padding:0; max-width:100%; }',
    '  .surface, .escalation { box-shadow:none; }',
    '  .editorial-doc { background:#fff; border:0; padding:0; }',
    '  .audit, .signoff, .rep-foot { padding-left:0; padding-right:0; }',
    '  .rep-masthead, .rep-id-banner { background:#0A0A0A !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }',
    '  .ed-pull { -webkit-print-color-adjust:exact; print-color-adjust:exact; }',
    '}'
  ].join('\n');

  function toolbarHTML(sendable, docId, opts) {
    return '<div class="rep-toolbar">' +
      '<div class="left"><strong>Doc</strong> ' + esc(docId) + ' · scope ' + esc(opts.scope || 'report') + ' · sender ' + esc((opts.sender || getSender()).name) + '</div>' +
      '<div class="right">' +
        '<button class="rep-btn primary" onclick="window.__rep_print()">Print / Save as PDF</button>' +
        (sendable ? '<button id="repSendBtn" class="rep-btn send" onclick="window.__rep_send()">Send to all staff</button>' : '') +
        '<button class="rep-btn" onclick="window.__rep_close()">Close</button>' +
      '</div>' +
    '</div>';
  }

  function mastheadHTML(opts) {
    return '<div class="rep-masthead">' +
      '<div class="inner">' +
        '<div class="rep-brand">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" aria-hidden="true">' +
            '<path fill="currentColor" d="M255.75 133.125c67.679 0 122.625 54.946 122.625 122.625S323.429 378.375 255.75 378.375 133.125 323.429 133.125 255.75s54.946-122.625 122.625-122.625m0-132.75c18.832 0 34.121 15.289 34.121 34.121s-15.289 34.121-34.121 34.121-34.121-15.289-34.121-34.121S236.918.375 255.75.375M75.173 75.173c13.316-13.316 34.938-13.316 48.254 0s13.316 34.938 0 48.254-34.938 13.316-48.254 0-13.316-34.938 0-48.254M511.125 255.75c0 18.832-15.289 34.121-34.121 34.121s-34.121-15.289-34.121-34.121 15.289-34.121 34.121-34.121 34.121 15.289 34.121 34.121M255.75 442.883c18.832 0 34.121 15.289 34.121 34.121s-15.289 34.121-34.121 34.121-34.121-15.289-34.121-34.121 15.289-34.121 34.121-34.121m132.323-54.81c13.316-13.316 34.938-13.316 48.254 0s13.316 34.938 0 48.254-34.938 13.316-48.254 0-13.316-34.938 0-48.254M68.617 255.75c0 18.832-15.289 34.121-34.121 34.121S.375 274.582.375 255.75s15.289-34.121 34.121-34.121 34.121 15.289 34.121 34.121m54.81 132.323c13.316 13.316 13.316 34.938 0 48.254s-34.938 13.316-48.254 0-13.316-34.938 0-48.254 34.938-13.316 48.254 0"/>' +
            '<path fill="#FFD400" d="M436.327 75.173c13.316 13.316 13.316 34.938 0 48.254s-34.938 13.316-48.254 0-13.316-34.938 0-48.254 34.938-13.316 48.254 0"/>' +
          '</svg>' +
          '<span class="b1">kooper</span>' +
          '<span class="b2">· ' + esc(opts.scope || 'report') + '</span>' +
        '</div>' +
        '<div class="rep-doc-meta">' +
          '<strong>' + esc(opts.docVol || 'Vol. 1') + '</strong> · ' + esc(opts.kicker || '') + '<br>' +
          'Generated ' + esc(fmtDateTime(nowISO())) + '<br>' +
          'Workspace · Draycott House · 001' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function identityHTML(id) {
    if (!id) return '';
    var initials = id.initials || (id.name ? id.name.split(' ').slice(-2).map(function(s){return s[0]||'';}).join('').toUpperCase() : 'KP');
    return '<div class="rep-id-banner">' +
      '<div class="inner">' +
        '<div class="id-left">' +
          '<div class="avatar">' + esc(initials.slice(0,2)) + '</div>' +
          '<div>' +
            '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">' +
              '<h2>' + esc(id.name || '—') + '</h2>' +
              (id.pref ? '<span class="id-pill">' + esc(id.pref) + (id.pronouns ? ' · ' + esc(id.pronouns) : '') + '</span>' : '') +
              (id.age ? '<span class="id-chip">Age ' + esc(id.age) + (id.room ? ' · Room ' + esc(id.room) : '') + '</span>' : '') +
              (id.nhs ? '<span class="id-chip">NHS ' + esc(id.nhs) + '</span>' : '') +
            '</div>' +
            (id.metaLine ? '<div class="id-meta">' + esc(id.metaLine) + '</div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="id-left" style="gap:0.5rem">' +
          (id.statusChips || []).map(function(c){ return '<span class="id-chip ' + (c.tone || '') + '">' + esc(c.label) + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function auditHTML(docId, sender, sentAtISO) {
    var hash = 'a' + Math.abs((docId || '').split('').reduce(function(a,c){return ((a<<5)-a + c.charCodeAt(0))|0;}, 0)).toString(36);
    return '<section class="audit"><div class="audit-card">' +
      '<div class="audit-cell"><div class="lbl">Doc ID</div><div class="val">' + esc(docId) + '</div></div>' +
      '<div class="audit-cell"><div class="lbl">Generated</div><div class="val">' + esc(fmtDateTime(sentAtISO)) + '</div></div>' +
      '<div class="audit-cell"><div class="lbl">Captured by</div><div class="val">' + esc(sender.name) + ' · ' + esc(sender.role) + '</div></div>' +
      '<div class="audit-cell"><div class="lbl">Audit hash</div><div class="val">' + esc(hash) + '</div></div>' +
    '</div></section>';
  }

  function signoffHTML(sender) {
    return '<section class="signoff"><div class="signoff-card">' +
      '<div class="sig-block"><div class="lbl">Signed (author)</div><div class="line"></div><div class="nm">' + esc(sender.name) + ' · ' + esc(sender.role) + '</div></div>' +
      '<div class="sig-block"><div class="lbl">Counter-signed</div><div class="line"></div><div class="nm">Manager / Clinical Lead</div></div>' +
    '</div></section>';
  }

  function footerHTML() {
    return '<footer class="rep-foot">kooper · care · v0.4 · Draycott House · No real PII · Mock data for compliance demo · Page 1 of 1</footer>';
  }

  // ============================================================
  // PER-TYPE BUILDERS
  // ============================================================

  // ---- Care Plan -------------------------------------------------
  function buildCarePlanHTML(planId) {
    var p = patientById(planId); var plan = planFor(planId);
    if (!p) return null;

    var sender = getSender();
    var sectionsArr = [];
    if (plan && plan.sections) {
      Object.keys(plan.sections).forEach(function (k) {
        var s = plan.sections[k];
        sectionsArr.push({ key: k, title: s.title || k, content: s.content || '', editedAt: s.lastEditedAt, editedBy: s.lastEditedBy });
      });
    }

    var deck = plan
      ? 'Plan version ' + ((plan.history || []).length + 1) + '. ' + (plan.template ? 'Template · ' + plan.template + '. ' : '') + 'Last edited ' + fmtDate(plan.lastEditedAt) + ' by ' + esc(plan.lastEditedBy || 'unknown') + '.'
      : 'Care plan not yet drafted. This document captures the current intent for ' + p.pref + '.';

    var meta = [
      { label:'Patient',      value: p.name },
      { label:'NHS',          value: p.nhs },
      { label:'Room',         value: p.room },
      { label:'Funding',      value: p.funding },
      { label:'Last edited',  value: plan ? fmtDate(plan.lastEditedAt) + ' · ' + (plan.lastEditedBy || '—') : '—' },
      { label:'Lead clinician',value: 'Sister Anne Whitfield · Nurse' }
    ];

    var statsHTML = '<div class="ed-stats">' +
      '<div class="ed-stat"><div class="stat-label">Plan progress</div><div class="stat-value">' + (plan ? (plan.progress || 0) + '%' : '—') + '</div><div class="stat-foot">' + (plan && plan.status ? plan.status : 'draft') + '</div></div>' +
      '<div class="ed-stat"><div class="stat-label">Sections</div><div class="stat-value">' + sectionsArr.length + '</div><div class="stat-foot">live · authored by team</div></div>' +
      '<div class="ed-stat"><div class="stat-label">Created</div><div class="stat-value">' + (plan ? fmtDate(plan.createdAt) : '—') + '</div><div class="stat-foot">' + (plan ? 'by ' + (plan.createdBy || '—') : '') + '</div></div>' +
      '<div class="ed-stat"><div class="stat-label">Last review</div><div class="stat-value">' + (plan ? fmtDate(plan.lastEditedAt) : '—') + '</div><div class="stat-foot">' + (plan ? 'by ' + (plan.lastEditedBy || '—') : '') + '</div></div>' +
    '</div>';

    var sectionsHTML = sectionsArr.map(function (s) {
      return '<div class="ed-label">' + esc(s.title) + '</div>' +
        '<p class="no-indent">' + esc(s.content || '—').replace(/\n+/g,'</p><p>') + '</p>' +
        '<div style="font-family:JetBrains Mono, monospace; font-size:0.6875rem; color:#6B7280; margin:-0.25rem 0 1rem">last edited ' + esc(fmtDateTime(s.editedAt)) + (s.editedBy ? ' · by ' + esc(s.editedBy) : '') + '</div>';
    }).join('');

    var historyHTML = (plan && plan.history && plan.history.length)
      ? '<div class="ed-label">Recent changes</div><ul style="font-family:Source Serif 4, Georgia, serif; padding-left:1.1rem; margin:0.25rem 0 1.25rem; line-height:1.65; color:#1A1A1A">' +
          plan.history.slice(0,8).map(function(h){ return '<li><strong>' + esc(fmtDate(h.at)) + '</strong> · ' + esc(h.by) + ' — ' + esc(h.msg) + '</li>'; }).join('') +
        '</ul>'
      : '';

    var bodyHTML =
      '<p class="no-indent">' + esc(p.pref) + ' is ' + esc(p.condition.toLowerCase()) + '. The plan below is the team\'s current understanding of ' + (p.pref ? esc(p.pref) + '\'s' : 'their') + ' needs and the routines that work. It is reviewed continuously and any team member can flag a section that no longer reflects reality.</p>' +
      statsHTML +
      sectionsHTML +
      historyHTML +
      '<div class="ed-pull"><strong>Two-master test.</strong> This plan must defend itself to a CQC inspector AND to a relative reading it for the first time. Anything that fails either test gets rewritten in the next review.</div>';

    var leftHTML = '<div class="surface">' +
      '<h3>Plan summary <span class="count">v' + ((plan && plan.history) ? plan.history.length + 1 : 1) + '</span></h3>' +
      '<div class="list-row"><span class="flag" style="background:#FFD400"></span><div class="ttl"><strong>' + esc(p.condition) + '</strong><br><span class="meta">primary diagnosis</span></div></div>' +
      '<div class="list-row"><span class="flag" style="background:#10B981"></span><div class="ttl">Funding · ' + esc(p.funding) + '<br><span class="meta">' + esc(p.funding) + ' route</span></div></div>' +
      '<div class="list-row"><span class="flag" style="background:#A5B4FC"></span><div class="ttl">Plan status<br><span class="meta">' + (plan ? plan.status : 'draft') + ' · ' + (plan ? plan.progress + '%' : '0%') + '</span></div></div>' +
    '</div>' +
    '<div class="surface"><h3>Sections <span class="count">' + sectionsArr.length + '</span></h3>' +
      sectionsArr.map(function(s){ return '<div class="list-row"><span class="flag" style="background:#FCD34D"></span><div class="ttl">' + esc(s.title) + '<br><span class="meta">' + esc(fmtDate(s.editedAt)) + ' · ' + esc(s.editedBy || '—') + '</span></div></div>'; }).join('') +
    '</div>';

    // Use Edward's clinical seed when his ID matches; otherwise reuse generic
    var seed = CLINICAL_SEED[planId];
    var rightHTML = '';
    if (seed) {
      rightHTML +=
        '<div class="surface"><h3>Active medications <span class="count">' + seed.meds.length + '</span></h3>' +
          seed.meds.map(function(m){ return '<div class="med-row"><span class="nm">' + esc(m.name) + '</span><span class="sch ' + (m.sched === 'PRN' ? 'prn' : '') + '">' + esc(m.sched) + '</span></div>'; }).join('') +
        '</div>' +
        '<div class="surface"><h3>Allergies</h3>' +
          seed.allergies.map(function(a){ return '<div class="list-row"><span class="flag" style="background:#E5484D"></span><div class="ttl">' + esc(a.name) + (a.note ? ' · <span class="meta">' + esc(a.note) + '</span>' : '') + '</div></div>'; }).join('') +
        '</div>' +
        '<div class="escalation"><h3>Escalation</h3><ul>' + seed.escalation.map(function(e){ return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
    } else {
      rightHTML +=
        '<div class="surface"><h3>Plan rhythm</h3>' +
          '<div class="intv-row"><span class="tm">DAILY</span><span class="lbl">Routine handover · 07:30 + 19:30</span></div>' +
          '<div class="intv-row"><span class="tm">WEEKLY</span><span class="lbl">MDT review · Wednesdays</span></div>' +
          '<div class="intv-row"><span class="tm">MONTHLY</span><span class="lbl">GP visit · first Monday</span></div>' +
          '<div class="intv-row"><span class="tm">QTLY</span><span class="lbl">Full plan review</span></div>' +
        '</div>' +
        '<div class="escalation"><h3>Escalation</h3><ul>' +
          '<li>Two NEWS2 ≥ 5 in 24h → Manager + GP</li>' +
          '<li>Falls × 2 in week → physio review</li>' +
          '<li>Family concern unresolved 48h → Manager</li>' +
        '</ul></div>';
    }

    return buildShell({
      scope: 'care plan',
      docVol: 'Plan v' + ((plan && plan.history) ? plan.history.length + 1 : 1),
      reportId: 'KR-CPL-' + (p.id || 'X').toUpperCase() + '-' + new Date().toISOString().slice(0,10),
      kicker: plan ? 'Active · ' + (plan.status || 'live') : 'Draft',
      title: p.pref ? p.pref + '\'s care plan' : p.name + '\'s care plan',
      deck: deck,
      meta: meta,
      identity: {
        name: p.name, pref: p.pref, age: p.age, room: p.room, nhs: p.nhs,
        metaLine: p.condition + ' · funded by ' + p.funding,
        statusChips: [
          { label: plan ? 'Plan v' + ((plan.history || []).length + 1) + ' · current' : 'No plan yet', tone: plan ? '' : 'warn' },
          { label: plan ? (plan.progress || 0) + '% complete' : '0%' }
        ],
        initials: (p.name || '').split(' ').slice(-2).map(function(s){return s[0]||'';}).join('')
      },
      bodyHTML: bodyHTML,
      leftHTML: leftHTML,
      rightHTML: rightHTML,
      patientId: p.id,
      sender: sender,
      sendable: true,
      footerNote: 'Care plans are living documents. The version, the section authorship, and every edit is logged. Anyone who reads this and spots something that no longer reflects reality should flag it on the plan page — the team will see it within the hour.'
    });
  }

  // ---- Incident report -----------------------------------------
  function buildIncidentHTML(event) {
    if (!event) return null;
    var sender = getSender();
    var p = event.residentId ? patientById(event.residentId) : null;
    if (!p && event.resident) {
      // synthesise a minimal patient from the embedded string
      p = { name: event.resident, pref: event.resident.split(' ').slice(-1)[0], age: '—', room: '—', nhs: '—', condition: event.domain || '—', funding: '—' };
    }

    var deck = event.prose ? event.prose.split('. ').slice(0,1).join('. ') + '.' : 'A captured care event with structured taps and an AI-drafted narrative, locked by the carer before this document was issued.';

    var meta = [
      { label:'Subject',      value: event.resident || (p ? p.name : '—') },
      { label:'Captured by',  value: event.by || sender.name },
      { label:'Time window',  value: (event.startedAt || '—') + ' → ' + (event.endedAt || '—') + (event.durationMin ? ' · ' + event.durationMin + ' min' : '') },
      { label:'Date',         value: fmtDate(event.dateISO || nowISO()) },
      { label:'Consent',      value: event.consent || '—' },
      { label:'Dignity',      value: event.dignity || '—' },
      { label:'Support',      value: event.support || '—' },
      { label:'Outcome',      value: event.outcome || '—' }
    ];

    var bodyHTML =
      '<p class="no-indent">' + esc(event.prose || 'No narrative captured for this event.') + '</p>' +
      '<div class="ed-pull"><strong>SAF mapping.</strong> ' + esc(event.saf || 'Safe · Effective · Caring · Responsive · Well-led') + ' — this event maps to the listed CQC quality statements automatically.</div>' +
      '<div class="ed-stats">' +
        '<div class="ed-stat"><div class="stat-label">Level of support</div><div class="stat-value">' + esc(event.support || '—') + '</div><div class="stat-foot">tap 1</div></div>' +
        '<div class="ed-stat"><div class="stat-label">Consent + dignity</div><div class="stat-value">' + esc(event.consent || '—') + '</div><div class="stat-foot">tap 2</div></div>' +
        '<div class="ed-stat"><div class="stat-label">Outcome</div><div class="stat-value">' + esc(event.outcome || '—') + '</div><div class="stat-foot">tap 3</div></div>' +
        '<div class="ed-stat"><div class="stat-label">Domain</div><div class="stat-value">' + esc(event.domain || '—') + '</div><div class="stat-foot">' + esc(event.saf || '—') + '</div></div>' +
      '</div>' +
      '<div class="ed-label">Audit &amp; provenance</div>' +
      '<p class="no-indent">Captured live in kooper · reporting using the 3-tap flow (level of support · consent + dignity · outcome). AI narrative drafted from structured taps, verified by ' + esc(event.by || sender.name) + ' before lock. Every change is audit-logged and immutable.</p>';

    var leftHTML = '<div class="surface"><h3>Event summary</h3>' +
      '<div class="list-row"><span class="flag" style="background:#FFD400"></span><div class="ttl"><strong>' + esc(event.title || 'Care event') + '</strong><br><span class="meta">' + esc(event.domain || '—') + '</span></div></div>' +
      '<div class="list-row"><span class="flag" style="background:#10B981"></span><div class="ttl">Outcome · <span class="meta">' + esc(event.outcome || '—') + '</span></div></div>' +
      '<div class="list-row"><span class="flag" style="background:#A5B4FC"></span><div class="ttl">Captured · <span class="meta">' + esc(event.startedAt || '—') + '</span></div></div>' +
    '</div>' +
    '<div class="surface"><h3>SAF</h3>' +
      '<div class="list-row"><span class="flag" style="background:#0A0A0A"></span><div class="ttl">' + esc(event.saf || 'Safe · Effective · Caring · Responsive · Well-led') + '<br><span class="meta">CQC quality statements</span></div></div>' +
    '</div>';

    var rightHTML = '<div class="surface"><h3>Three-tap flow</h3>' +
      '<div class="intv-row"><span class="dot ok"></span><span class="lbl">Level of support · ' + esc(event.support || '—') + '</span></div>' +
      '<div class="intv-row"><span class="dot ok"></span><span class="lbl">Consent + dignity · ' + esc(event.consent || '—') + '</span></div>' +
      '<div class="intv-row"><span class="dot ok"></span><span class="lbl">Outcome · ' + esc(event.outcome || '—') + '</span></div>' +
    '</div>' +
    '<div class="escalation"><h3>If something changes</h3><ul>' +
      '<li>Adverse event escalation → manager + clinical lead within shift</li>' +
      '<li>Family concern → call within 24h, log in family timeline</li>' +
      '<li>Pattern detected (3+ similar events) → MDT review trigger</li>' +
    '</ul></div>';

    return buildShell({
      scope: 'incident',
      docVol: 'Event ' + (event.id || '').toString().toUpperCase(),
      reportId: 'KR-INC-' + (event.id || 'X').toString().toUpperCase() + '-' + new Date().toISOString().slice(0,10),
      kicker: 'Locked · audit-ready',
      title: event.title || 'Care event report',
      deck: deck,
      meta: meta,
      identity: p ? {
        name: p.name, pref: p.pref, age: p.age, room: p.room, nhs: p.nhs,
        metaLine: p.condition + ' · funded by ' + p.funding,
        statusChips: [
          { label: event.saf ? 'SAF · ' + event.saf.slice(0,40) : 'Quality statement mapped', tone: 'ok' },
          { label: 'Locked' }
        ],
        initials: (p.name || '').split(' ').slice(-2).map(function(s){return s[0]||'';}).join('')
      } : null,
      bodyHTML: bodyHTML,
      leftHTML: leftHTML,
      rightHTML: rightHTML,
      patientId: p ? p.id : null,
      sender: sender,
      sendable: true,
      footerNote: 'Locked at capture. Re-opening this report does not change the underlying event. Any clarification request from CQC or the family will be appended below as an addendum, signed by the requester.'
    });
  }

  // ---- Clinical patient profile (Mr Edward Banda canonical) ----
  function buildClinicalHTML(patientId) {
    var p = patientById(patientId);
    if (!p) return null;
    var sender = getSender();
    var seed = CLINICAL_SEED[patientId] || CLINICAL_SEED.eb; // fallback shape

    var primary = (seed.problems || [])[0] || { code:'—', label: p.condition, status:'monitor', since:'—', lead:'—' };

    var deck = primary.label === p.condition || !primary.label
      ? 'A clinical summary built from active SNOMED CT problems, current medications, and today\'s interventions. The team\'s job is to keep ' + esc(p.pref) + ' steady.'
      : 'A long bereavement disorder, well held by medication, music, and the steady hand of Sister Anne. The team\'s job is to keep ' + esc(p.pref) + ' steady.';

    var meta = [
      { label:'SNOMED CT', value: primary.code },
      { label:'Status',    value: primary.status },
      { label:'Since',     value: primary.since },
      { label:'Lead',      value: primary.lead },
      { label:'Patient',   value: p.name },
      { label:'Funding',   value: p.funding }
    ];

    var bodyHTML =
      '<p class="no-indent">' + esc(p.pref) + ' presents with a long-running clinical picture that has been steadied by a careful balance of medication, routine, and relational care. The plan is not aggressive — it is patient. Every interaction with ' + esc(p.pref) + ' is also a quiet observation, and the team feeds those observations back into the plan in real time.</p>' +
      '<p>The lead diagnosis is <strong>' + esc(primary.label) + '</strong> (' + esc(primary.code) + '). It is held under the care of ' + esc(primary.lead) + ' and reviewed quarterly. The current treatment line — see medications panel — is producing stable ratings on routine mood scales, and the team has agreed a clear escalation path if ' + esc(p.pref) + ' deteriorates.</p>' +
      '<div class="ed-label">Major active problems</div>' +
      '<ul style="font-family:Source Serif 4, Georgia, serif; padding-left:1.1rem; line-height:1.65; color:#1A1A1A">' +
        (seed.problems || []).map(function(pr){ return '<li><strong>' + esc(pr.label) + '</strong> · <span style="font-family:JetBrains Mono, monospace; font-size:0.8125rem; color:#6B7280">' + esc(pr.code) + '</span> — ' + esc(pr.status) + ' (since ' + esc(pr.since) + ')</li>'; }).join('') +
      '</ul>' +
      '<div class="ed-label">Mental Health Act &amp; DoLS</div>' +
      '<ul style="font-family:Source Serif 4, Georgia, serif; padding-left:1.1rem; line-height:1.65; color:#1A1A1A">' +
        (seed.mha || []).map(function(m){ return '<li>' + esc(m.label) + ' — ' + esc(m.state) + '</li>'; }).join('') +
        (seed.dols || []).map(function(d){ return '<li>' + esc(d.label) + ' — ' + esc(d.state) + '</li>'; }).join('') +
      '</ul>' +
      '<div class="ed-pull"><strong>Plan in one line.</strong> Keep ' + esc(p.pref) + ' steady. Notice the small things first. Escalate fast when a pattern starts to show up.</div>';

    var leftHTML = '<div class="surface"><h3>Major active problems <span class="count">' + (seed.problems || []).length + '</span></h3>' +
      (seed.problems || []).map(function(pr){
        return '<div class="list-row"><span class="flag" style="background:' + pr.flag + '"></span><div class="ttl"><strong>' + esc(pr.label) + '</strong><br><span class="meta">' + esc(pr.code) + ' · ' + esc(pr.status) + '</span></div></div>';
      }).join('') +
    '</div>' +
    '<div class="surface"><h3>Mental Health Act</h3>' +
      (seed.mha || []).map(function(m){ return '<div class="list-row"><span class="dot ' + (m.state === 'Active' ? 'ok' : 'pending') + '"></span><div class="ttl">' + esc(m.label) + ' · <span class="meta">' + esc(m.state) + '</span></div></div>'; }).join('') +
    '</div>' +
    '<div class="surface"><h3>DoLS</h3>' +
      (seed.dols || []).map(function(d){ return '<div class="list-row"><span class="dot next"></span><div class="ttl">' + esc(d.label) + ' · <span class="meta">' + esc(d.state) + '</span></div></div>'; }).join('') +
    '</div>';

    var rightHTML = '<div class="surface"><h3>Active medications <span class="count">' + (seed.meds || []).length + '</span></h3>' +
      (seed.meds || []).map(function(m){ return '<div class="med-row"><span class="nm">' + esc(m.name) + '</span><span class="sch ' + (m.sched === 'PRN' ? 'prn' : '') + '">' + esc(m.sched) + '</span></div>'; }).join('') +
    '</div>' +
    '<div class="surface"><h3>Allergies</h3>' +
      (seed.allergies || []).map(function(a){ return '<div class="list-row"><span class="flag" style="background:#E5484D"></span><div class="ttl">' + esc(a.name) + (a.note ? ' · <span class="meta">' + esc(a.note) + '</span>' : '') + '</div></div>'; }).join('') +
    '</div>' +
    '<div class="surface"><h3>Today\'s interventions</h3>' +
      (seed.interventions || []).map(function(i){ return '<div class="intv-row"><span class="dot ' + (i.state || 'pending') + '"></span><span class="tm">' + esc(i.time) + '</span><span class="lbl">' + esc(i.label) + '</span></div>'; }).join('') +
    '</div>' +
    '<div class="escalation"><h3>Escalation</h3><ul>' +
      (seed.escalation || []).map(function(e){ return '<li>' + esc(e) + '</li>'; }).join('') +
    '</ul></div>';

    return buildShell({
      scope: 'clinical',
      docVol: 'Clinical · Vol. 4',
      reportId: 'KR-CLN-' + (p.id || 'X').toUpperCase() + '-' + new Date().toISOString().slice(0,10),
      kicker: 'Active · monitor',
      title: primary.label || (p.pref + '\'s clinical summary'),
      deck: deck,
      meta: meta,
      identity: {
        name: p.name, pref: p.pref, age: p.age, room: p.room, nhs: p.nhs,
        metaLine: 'English first language · large-print preferred · hearing aid (R) · MCA assessed · capacity fluctuating',
        statusChips: [
          { label: 'NEWS2 = 2 (low risk)', tone: 'warn' },
          { label: 'Plan v4 · current' }
        ],
        initials: (p.name || '').split(' ').slice(-2).map(function(s){return s[0]||'';}).join('')
      },
      bodyHTML: bodyHTML,
      leftHTML: leftHTML,
      rightHTML: rightHTML,
      patientId: p.id,
      sender: sender,
      sendable: true,
      footerNote: 'A clinical summary is a snapshot. The live workspace at kooper · clinical is always the source of truth — open it for the latest medications, vitals, and notes.'
    });
  }

  // ---- Shift report ----------------------------------------------
  function buildShiftHTML(shift, events) {
    var sender = getSender();
    var startISO = shift.start || nowISO();
    var endISO   = shift.end   || nowISO();
    var staffOn  = shift.staff || [{ name: sender.name, role: sender.role }];

    events = events || [];

    var deck = 'Shift report compiled at ' + esc(fmtDateTime(endISO)) + '. ' + events.length + ' events captured across ' + (shift.unitsCovered || 1) + ' unit' + ((shift.unitsCovered || 1) === 1 ? '' : 's') + '. The next shift inherits this brief.';

    var meta = [
      { label:'Shift',         value: shift.label || 'Day shift' },
      { label:'Started',       value: fmtDateTime(startISO) },
      { label:'Ended',         value: fmtDateTime(endISO) },
      { label:'Lead',          value: shift.lead || sender.name },
      { label:'Events captured',value: events.length },
      { label:'Workspace',     value: 'Draycott House' }
    ];

    var statsHTML = '<div class="ed-stats">' +
      '<div class="ed-stat"><div class="stat-label">Events captured</div><div class="stat-value">' + events.length + '</div><div class="stat-foot">all locked</div></div>' +
      '<div class="ed-stat"><div class="stat-label">Residents touched</div><div class="stat-value">' + new Set(events.map(function(e){return e.resident;})).size + '</div><div class="stat-foot">unique subjects</div></div>' +
      '<div class="ed-stat"><div class="stat-label">Flags raised</div><div class="stat-value">' + (events.filter(function(e){ return /flag|escalat|adverse/i.test(e.outcome || ''); }).length) + '</div><div class="stat-foot">none = good</div></div>' +
      '<div class="ed-stat"><div class="stat-label">Staff on</div><div class="stat-value">' + staffOn.length + '</div><div class="stat-foot">' + staffOn.map(function(s){return s.role;}).join(' · ') + '</div></div>' +
    '</div>';

    var eventsHTML = events.length
      ? events.map(function(e){
          return '<div class="ed-label">' + esc(e.startedAt || '') + ' · ' + esc(e.resident || '—') + '</div>' +
            '<p class="no-indent"><strong>' + esc(e.title || 'Event') + '.</strong> ' + esc(e.prose || '—') + '</p>' +
            '<div style="font-family:JetBrains Mono, monospace; font-size:0.6875rem; color:#6B7280; margin:-0.25rem 0 0.875rem">SAF · ' + esc(e.saf || '—') + ' · captured by ' + esc(e.by || '—') + '</div>';
        }).join('')
      : '<p class="no-indent">No events captured this shift. The team patrolled, observed, and held the routine. That is itself a result and is logged here as a calm shift.</p>';

    var bodyHTML =
      '<p class="no-indent">This is the audit-ready record of the shift. Every captured event below was tapped live in kooper · reporting and locked by the carer who captured it. The next shift opens this brief at handover.</p>' +
      statsHTML +
      eventsHTML +
      '<div class="ed-pull"><strong>Handover.</strong> Anything in this report that is unfinished or needs follow-up is flagged below in escalation. The next shift acknowledges receipt by signing in.</div>';

    var leftHTML = '<div class="surface"><h3>Staff on shift <span class="count">' + staffOn.length + '</span></h3>' +
      staffOn.map(function(s){ return '<div class="list-row"><span class="flag" style="background:#FFD400"></span><div class="ttl"><strong>' + esc(s.name) + '</strong><br><span class="meta">' + esc(s.role) + '</span></div></div>'; }).join('') +
    '</div>' +
    '<div class="surface"><h3>Coverage</h3>' +
      '<div class="list-row"><span class="dot ok"></span><div class="ttl">Routine handover · 07:30 + 19:30</div></div>' +
      '<div class="list-row"><span class="dot ok"></span><div class="ttl">All units patrolled</div></div>' +
      '<div class="list-row"><span class="dot ok"></span><div class="ttl">Meds rounds completed</div></div>' +
    '</div>';

    var rightHTML = '<div class="surface"><h3>Events feed <span class="count">' + events.length + '</span></h3>' +
      (events.slice(0,8).map(function(e){
        return '<div class="intv-row"><span class="dot ok"></span><span class="tm">' + esc((e.startedAt || '—').slice(-5)) + '</span><span class="lbl">' + esc(e.resident || '—') + ' · ' + esc(e.title || 'event') + '</span></div>';
      }).join('') || '<div class="intv-row"><span class="dot pending"></span><span class="lbl">No events captured</span></div>') +
    '</div>' +
    '<div class="escalation"><h3>To next shift</h3><ul>' +
      (shift.handoverNotes && shift.handoverNotes.length
        ? shift.handoverNotes.map(function(n){ return '<li>' + esc(n) + '</li>'; }).join('')
        : '<li>Continue routines as planned</li><li>Watch evening BPSD trigger window for Mrs Lambert</li><li>Confirm GP visit booked for first Monday</li>') +
    '</ul></div>';

    return buildShell({
      scope: 'shift',
      docVol: 'Shift · ' + new Date(startISO).toISOString().slice(0,10),
      reportId: 'KR-SHF-' + new Date(startISO).toISOString().slice(0,10).replace(/-/g,'') + '-' + (shift.label || 'shift').toUpperCase().replace(/\s+/g,'') ,
      kicker: 'Locked · handover-ready',
      title: (shift.label || 'Shift') + ' report · ' + fmtDate(startISO),
      deck: deck,
      meta: meta,
      identity: {
        name: 'Draycott House · ' + (shift.label || 'shift'),
        pref: 'Kooper care home',
        age: events.length,
        room: 'Units ' + (shift.unitsCovered || 1),
        nhs: 'Workspace 001',
        metaLine: 'Compiled by ' + sender.name + ' · ' + sender.role,
        statusChips: [
          { label: events.length + ' events locked', tone: 'ok' },
          { label: staffOn.length + ' staff on shift' }
        ],
        initials: 'DH'
      },
      bodyHTML: bodyHTML,
      leftHTML: leftHTML,
      rightHTML: rightHTML,
      patientId: null,
      sender: sender,
      sendable: true,
      footerNote: 'Shift reports are immutable once locked. Anything that arrives after lock — a late lab, a family call — is appended as an addendum on the next shift\'s report.'
    });
  }

  // ============================================================
  // PUBLIC OPENERS — open a print-ready tab via blob URL
  // ============================================================
  function openInTab(html, fallbackTitle) {
    if (!html) {
      try { window.alert('Report could not be built — missing data.'); } catch(e){}
      return null;
    }
    var blob = new Blob([html], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var win = window.open(url, '_blank');
    if (!win) {
      // Pop-up blocked — fallback to inline render in new same-window doc
      try {
        var fallback = window.open('', '_blank');
        if (fallback) { fallback.document.write(html); fallback.document.close(); }
      } catch (e) {}
    }
    return win;
  }

  window.KooperReport = {
    openCarePlan: function (patientId) {
      var html = buildCarePlanHTML(patientId);
      return openInTab(html, 'Care plan');
    },
    openIncident: function (event) {
      var html = buildIncidentHTML(event);
      return openInTab(html, 'Incident report');
    },
    openClinical: function (patientId) {
      var html = buildClinicalHTML(patientId);
      return openInTab(html, 'Clinical summary');
    },
    openShift: function (shiftMeta, events) {
      var html = buildShiftHTML(shiftMeta || {}, events || []);
      return openInTab(html, 'Shift report');
    },
    // Imperative share helper for surfaces that want to send WITHOUT first opening
    shareReport: function (meta) {
      pushSharedReport({
        id: meta.id || uid('rep'),
        scope: meta.scope || 'report',
        title: meta.title || 'Report',
        patientId: meta.patientId || null,
        sender: meta.sender || getSender(),
        sentAt: nowISO()
      });
    },
    listShared: function () { return load('kooper:reports:shared', []); },
    getSender: getSender
  };

})();
