/* ============================================================
   kooper · session — shared session module
   --------------------------------------------------------------
   Captures ?as=<staffId> from URL into localStorage on first
   visit, makes the active staff member known to every kooper
   app page that includes this script, and rewrites in-app links
   to carry session context.

   Usage on any page:
     <script src="kooper-session.js" defer></script>

   The script:
   1) On load, reads ?as=<id> from URL. If found, persists it.
      If not, falls back to whatever was previously persisted.
   2) Decorates the page with:
        - a "← My dashboard" pill in the nav (between logo and
          first nav action) that links back to kooper-staff.html
          for staff, or kooper-hr.html for managers
        - rewrites every <a href="kooper-*.html"> on the page
          to carry ?as=<id> so context survives navigation
   3) Exposes window.kooperSession with .get(), .clear(), .linkFor()
      so individual apps can personalize further.
   ============================================================ */
(function () {
  'use strict';

  // -- Staff roster — kept compact, mirrors kooper-staff.html / HR.
  var STAFF = {
    sa: { id:'sa', name:'Sister Anne Whitfield', first:'Sister Anne', role:'Nurse',         init:'SA', dashRoute:'kooper-staff.html?as=sa', avatarBg:'#1A1A1A', avatarFg:'#FFD400' },
    cm: { id:'cm', name:'Craig Musara',          first:'Craig',       role:'Carer',         init:'CM', dashRoute:'kooper-staff.html?as=cm', avatarBg:'#FCD34D', avatarFg:'#0A0A0A' },
    ra: { id:'ra', name:'Rebecca Adesina',       first:'Rebecca',     role:'Senior Carer',  init:'RA', dashRoute:'kooper-staff.html?as=ra', avatarBg:'#0A0A0A', avatarFg:'#FFD400' },
    dk: { id:'dk', name:'Daniel Kowalski',       first:'Daniel',      role:'Activities',    init:'DK', dashRoute:'kooper-staff.html?as=dk', avatarBg:'#A5B4FC', avatarFg:'#0A0A0A' },
    mc: { id:'mc', name:'Mary Chen',             first:'Mary',        role:'Cook',          init:'MC', dashRoute:'kooper-staff.html?as=mc', avatarBg:'#FDA4AF', avatarFg:'#0A0A0A' },
    tb: { id:'tb', name:'Tomas Bauer',           first:'Tomas',       role:'Maintenance',   init:'TB', dashRoute:'kooper-staff.html?as=tb', avatarBg:'#FCD34D', avatarFg:'#0A0A0A' },
    jm: { id:'jm', name:'Joy Munemo',            first:'Joy',         role:'Carer · Agency',init:'JM', dashRoute:'kooper-staff.html?as=jm', avatarBg:'#FFE39A', avatarFg:'#0A0A0A' },
    bp: { id:'bp', name:'Ben Pearce',            first:'Ben',         role:'Volunteer',     init:'BP', dashRoute:'kooper-staff.html?as=bp', avatarBg:'#86EFAC', avatarFg:'#064E3B' },
    lo: { id:'lo', name:'Rae Okonkwo',          first:'Rae',        role:'Manager',       init:'RO', dashRoute:'kooper-hr.html?as=lo',    avatarBg:'#0A0A0A', avatarFg:'#FFD400' }
  };

  var LS_KEY = 'kooper:session:as';

  function readQueryAs() {
    try {
      var p = new URLSearchParams(window.location.search);
      return p.get('as');
    } catch (e) { return null; }
  }
  function persist(id) {
    if (id && STAFF[id]) {
      try { localStorage.setItem(LS_KEY, id); } catch (e) {}
    }
  }
  function readPersisted() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }
  function clear() { try { localStorage.removeItem(LS_KEY); } catch (e) {} }

  function currentId() {
    var fromQuery = readQueryAs();
    if (fromQuery && STAFF[fromQuery]) {
      persist(fromQuery);
      return fromQuery;
    }
    var fromStorage = readPersisted();
    if (fromStorage && STAFF[fromStorage]) return fromStorage;
    return null;
  }

  function get() {
    var id = currentId();
    return id ? STAFF[id] : null;
  }

  // Build a kooper-* link with session context preserved
  function linkFor(href) {
    if (!href) return href;
    var id = currentId();
    if (!id) return href;
    // Only rewrite kooper-*.html links that aren't already carrying ?as=
    if (!/^kooper-[\w-]+\.html/.test(href)) return href;
    if (/[?&]as=/.test(href)) return href;
    var sep = href.indexOf('?') >= 0 ? '&' : '?';
    return href + sep + 'as=' + id;
  }

  // Inject a "← My dashboard" pill into the nav.
  // Looks for #kooperHintsBtn first (every page has one), inserts before it.
  function injectBackPill(staff) {
    if (document.getElementById('kooperBackToDash')) return; // already there
    // Skip pages that already have their own persona switcher (kooper-care-dashboards
    // has #roleSwitcher; future pages can opt out via [data-persona-switcher]). The
    // two UIs would visually collide otherwise.
    if (document.getElementById('roleSwitcher')) return;
    if (document.querySelector('[data-persona-switcher]')) return;
    var anchor = document.getElementById('kooperHintsBtn');
    if (!anchor) {
      // Fallback — try to find the first nav action area
      anchor = document.querySelector('nav .flex.items-center.gap-2');
      if (!anchor) return;
    }
    var pill = document.createElement('a');
    pill.id = 'kooperBackToDash';
    pill.href = staff.dashRoute;
    pill.title = 'Back to ' + staff.first + '\'s dashboard';
    pill.setAttribute('aria-label', 'My dashboard');
    pill.style.cssText = 'display:inline-flex;align-items:center;gap:0.4375rem;padding:0.25rem 0.5rem 0.25rem 0.3125rem;border-radius:999px;background:rgba(255,212,0,0.18);color:#FFD400;border:1px solid rgba(255,212,0,0.35);text-decoration:none;font-size:0.6875rem;font-weight:600;line-height:1;white-space:nowrap;transition:all 0.15s ease;font-family:Inter,sans-serif';
    pill.innerHTML =
      '<span style="width:20px;height:20px;border-radius:50%;background:' + staff.avatarBg + ';color:' + staff.avatarFg + ';display:inline-flex;align-items:center;justify-content:center;font-family:Space Grotesk,sans-serif;font-weight:700;font-size:0.5625rem;flex-shrink:0">' + staff.init + '</span>' +
      '<span><span style="opacity:0.65">←</span> ' + staff.first + '</span>';
    pill.addEventListener('mouseenter', function () { pill.style.background = '#FFD400'; pill.style.color = '#0A0A0A'; });
    pill.addEventListener('mouseleave', function () { pill.style.background = 'rgba(255,212,0,0.18)'; pill.style.color = '#FFD400'; });
    // Light-mode contexts (sign-in, resident) — adapt colours
    var navContext = anchor.closest('nav');
    if (navContext && !navContext.className.includes('kapture-black') && !navContext.className.includes('bg-black')) {
      pill.style.background = '#FFFBEB';
      pill.style.color = '#876300';
      pill.style.borderColor = 'rgba(255,212,0,0.5)';
      pill.addEventListener('mouseenter', function () { pill.style.background = '#FFD400'; pill.style.color = '#0A0A0A'; });
      pill.addEventListener('mouseleave', function () { pill.style.background = '#FFFBEB'; pill.style.color = '#876300'; });
    }
    anchor.parentNode.insertBefore(pill, anchor);
  }

  // Rewrite every <a href="kooper-*.html"> on the page to carry ?as=<id>.
  // Idempotent — re-running won't double-stamp.
  function rewriteLinks() {
    var id = currentId(); if (!id) return;
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href');
      if (!href) continue;
      if (!/^kooper-[\w-]+\.html/.test(href)) continue;
      if (/[?&]as=/.test(href)) continue;
      // Don't touch the sign-out link or the launcher's own back link
      if (a.id === 'kooperBackToDash') continue;
      if (/kooper-sign-in\.html/.test(href)) continue;
      var sep = href.indexOf('?') >= 0 ? '&' : '?';
      a.setAttribute('href', href + sep + 'as=' + id);
    }
  }

  function decorate() {
    var staff = get();
    if (!staff) return;
    injectBackPill(staff);
    rewriteLinks();
    // Re-rewrite on dynamic mutations (e.g. modals open with new links)
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { rewriteLinks(); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  function init() {
    // Persist as= from URL on first sight
    var fromQuery = readQueryAs();
    if (fromQuery && STAFF[fromQuery]) persist(fromQuery);
    decorate();
  }

  // -- Public API --
  window.kooperSession = {
    get: get,
    getId: currentId,
    clear: function () { clear(); var p = document.getElementById('kooperBackToDash'); if (p) p.remove(); },
    linkFor: linkFor,
    rewriteLinks: rewriteLinks
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // ============================================================
  // Auto-load shared nav tidier — responsive cleanup, marketing
  // vs app pattern, mobile drawer, kooper · ai marketing link.
  // Loads BEFORE the AI widget so the nav is normalised first.
  // ============================================================
  if (!document.querySelector('script[src$="kooper-nav.js"]')) {
    var nv = document.createElement('script');
    nv.src = 'kooper-nav.js';
    nv.defer = true;
    document.head.appendChild(nv);
  }

  // ============================================================
  // Auto-load the kooper · ai widget so every page that includes
  // kooper-session.js gets the persistent AI assistant for free.
  // No-op if the widget is already loaded.
  // ============================================================
  if (!window.__kooperAI && !document.querySelector('script[src$="kooper-ai-widget.js"]')) {
    var s = document.createElement('script');
    s.src = 'kooper-ai-widget.js';
    s.defer = true;
    document.head.appendChild(s);
  }
})();
