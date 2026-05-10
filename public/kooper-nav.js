/* ============================================================
   kooper · nav — central navigation tidier
   --------------------------------------------------------------
   Two nav patterns. One module. Auto-loaded on every page that
   includes kooper-session.js.

     · MARKETING surfaces (landing, apps catalogue, app deep-dive,
       ai product page, sign-in): the nav must surface the brand,
       product navigation, sign-in and book demo. The kooper · ai
       link points to the product page.

     · APP surfaces (every logged-in tool — care plans, clinical,
       reporting, chat, rota, hr, staff, dashboards, reports,
       family, resident, recording, tool, care-dashboards): the
       nav stays focused. Logo, contextual app links, hints icon,
       persona pill, sign-out icon. NO duplicate ai pill (the
       floating widget covers it). NO Book demo button.

   Mobile rules — both patterns:
     · Center nav links collapse behind a hamburger ≤900px.
     · Right cluster wraps tightly: persona pill keeps avatar,
       Hints becomes icon-only, Book demo / Sign in stay inline.
     · Force `flex-wrap` so nothing overlaps the back-pill that
       kooper-session.js injects.

   This module is a TIDIER, not a renderer. Existing inline nav
   markup stays. We just hide the noise, fix the spacing, and
   add the missing AI product link where appropriate.
   ============================================================ */
(function () {
  'use strict';

  // ---- Page surface detection ---------------------------------
  function pageKey() {
    var path = (location.pathname || '').toLowerCase();
    var m = path.match(/kooper-([\w-]+)\.html/);
    return m ? m[1] : 'index';
  }
  var MARKETING = ['care-landing','apps','app','ai','sign-in'];
  function isMarketing() { return MARKETING.indexOf(pageKey()) >= 0; }

  // ---- Inject responsive CSS (idempotent) ---------------------
  function injectStyles() {
    if (document.getElementById('kooper-nav-css')) return;
    var s = document.createElement('style');
    s.id = 'kooper-nav-css';
    s.textContent = [
      /* shared tidier rules across every kooper nav */
      'nav .kt-hint-dot-mini { width:0.4rem; height:0.4rem; border-radius:50%; background:#FFD400; box-shadow:0 0 0 3px rgba(255,212,0,0.18); display:inline-block; flex-shrink:0; }',

      /* responsive — every nav must wrap on narrow screens     */
      '@media (max-width: 900px) {',
      '  nav .nav-link { padding: 0.4rem 0.5rem; font-size: 0.8125rem; }',
      '  nav [data-kooper-hide-mobile] { display: none !important; }',
      '  nav [data-kooper-icon-mobile] [data-kt-label] { display: none !important; }',
      '  nav [data-kooper-icon-mobile] { padding: 0.375rem 0.5rem !important; }',
      '  /* ensure flex containers wrap so back-pill never overlaps */',
      '  nav .flex.items-center { flex-wrap: wrap; row-gap: 0.375rem; }',
      '}',
      /* persona pill (injected by kooper-session.js) — never let it
         force horizontal overflow on mobile */
      '@media (max-width: 480px) {',
      '  #kooperBackToDash { font-size: 0.625rem !important; padding: 0.1875rem 0.4rem 0.1875rem 0.25rem !important; }',
      '  #kooperBackToDash > span:last-child { display: none !important; }',
      '  /* keep just the avatar visible on tiny screens */',
      '  nav .hidden.md\\:flex { display: none !important; }',
      '}',

      /* HAMBURGER for marketing nav center links */
      '.kn-burger { display:none; align-items:center; justify-content:center; width:2.25rem; height:2.25rem; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:inherit; cursor:pointer; }',
      '.kn-burger svg { width:18px; height:18px; }',
      '@media (max-width: 900px) {',
      '  .kn-burger { display:inline-flex; }',
      '  .kn-center-mobile-hidden { display:none !important; }',
      '}',
      /* Drawer */
      '.kn-drawer { position:fixed; top:0; right:0; bottom:0; width:min(86vw, 18rem); background:#0A0A0A; color:#fff; z-index:200; transform:translateX(100%); transition:transform 0.18s ease; padding:1rem 1.25rem; box-shadow:-12px 0 30px -8px rgba(0,0,0,0.4); display:flex; flex-direction:column; gap:0.25rem; }',
      '.kn-drawer.on { transform:translateX(0); }',
      '.kn-drawer a { color:#fff; text-decoration:none; padding:0.625rem 0.75rem; border-radius:8px; font-size:0.9375rem; }',
      '.kn-drawer a:hover { background:#1A1A1A; color:#FFD400; }',
      '.kn-drawer .kn-drawer-head { display:flex; justify-content:space-between; align-items:center; padding:0.25rem 0.25rem 0.5rem; border-bottom:1px solid #1A1A1A; margin-bottom:0.5rem; }',
      '.kn-drawer .kn-drawer-head .kn-x { background:transparent; color:#fff; border:0; cursor:pointer; font-size:1.25rem; line-height:1; padding:0.25rem 0.5rem; border-radius:6px; }',
      '.kn-drawer .kn-drawer-head .kn-x:hover { background:#1A1A1A; }',
      '.kn-drawer .kn-divider { height:1px; background:#1A1A1A; margin:0.5rem 0; }',
      '.kn-drawer .kn-cta { background:#FFD400; color:#0A0A0A; font-weight:600; text-align:center; margin-top:auto; }',
      '.kn-drawer .kn-cta:hover { background:#F5B400; color:#0A0A0A; }',
      '.kn-scrim { position:fixed; inset:0; background:rgba(10,10,10,0.5); z-index:199; opacity:0; pointer-events:none; transition:opacity 0.18s ease; }',
      '.kn-scrim.on { opacity:1; pointer-events:auto; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ---- Tidy any nav markup found on the page ------------------
  function tidyEachNav() {
    var navs = document.querySelectorAll('nav');
    for (var i = 0; i < navs.length; i++) {
      var nav = navs[i];

      // Mark Hints buttons icon-only on mobile (and add a yellow dot if
      // the page didn't include one).
      var hints = nav.querySelector('#kooperHintsBtn');
      if (hints) {
        if (!hints.querySelector('.kt-hint-dot-mini')) {
          var dot = document.createElement('span');
          dot.className = 'kt-hint-dot-mini';
          dot.setAttribute('aria-hidden','true');
          hints.insertBefore(dot, hints.firstChild);
        }
        var label = hints.querySelector('[data-kt-label]');
        if (!label) {
          // Wrap any "Hints" text node in a labelled span so we can hide it on mobile.
          var raw = hints.textContent.trim();
          if (raw) {
            hints.textContent = '';
            if (!hints.querySelector('.kt-hint-dot-mini')) {
              var d2 = document.createElement('span'); d2.className='kt-hint-dot-mini'; hints.appendChild(d2);
            }
            var sp = document.createElement('span'); sp.setAttribute('data-kt-label',''); sp.textContent = raw;
            hints.appendChild(sp);
          }
        }
        hints.setAttribute('data-kooper-icon-mobile','');
      }

      // Sign-out icon — make sure it stays visible on mobile (only label hides if any).
      var signOut = nav.querySelector('a[href*="kooper-sign-in.html"]:not(#kooperBackToDash)');
      if (signOut && /sign\s?out/i.test(signOut.textContent || '')) {
        signOut.setAttribute('data-kooper-icon-mobile','');
      }

      // Add hamburger toggle if the nav has center links (any nav-link group)
      var centerLinks = nav.querySelectorAll('a.nav-link, a[data-kooper-center-link]');
      if (centerLinks.length > 0) {
        var firstCenter = centerLinks[0];
        var centerWrap = firstCenter.parentNode;
        if (centerWrap && !centerWrap.classList.contains('kn-center-marked')) {
          centerWrap.classList.add('kn-center-marked');
          centerWrap.classList.add('kn-center-mobile-hidden');
        }

        if (!nav.querySelector('.kn-burger')) {
          var burger = document.createElement('button');
          burger.type = 'button';
          burger.className = 'kn-burger';
          burger.setAttribute('aria-label','Open navigation');
          burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
          burger.addEventListener('click', openDrawer);
          // Insert before the hints button if present, else at end of right cluster
          var insertHost = (hints && hints.parentNode) || (nav.querySelector('.flex.items-center.gap-2'));
          if (insertHost) insertHost.insertBefore(burger, insertHost.firstChild);
          else nav.appendChild(burger);
        }
      }
    }
  }

  // ---- Drawer (built once, populated per page) ----------------
  function buildDrawer() {
    if (document.getElementById('knDrawer')) return;
    var marketing = isMarketing();
    var d = document.createElement('div');
    d.id = 'knDrawer';
    d.className = 'kn-drawer';

    var marketingLinks = [
      { href:'kooper-care-landing.html', label:'Home' },
      { href:'kooper-apps.html',         label:'All apps' },
      { href:'kooper-ai.html',           label:'kooper · ai' },
      { href:'kooper-care-dashboards.html', label:'See the dashboard' },
      { href:'kooper-sign-in.html',      label:'Sign in', cta:false },
      { href:'kooper-sign-in.html#book', label:'Book demo', cta:true }
    ];
    var appLinks = [
      { href:'kooper-care-landing.html',    label:'Home' },
      { href:'kooper-care-dashboards.html', label:'Dashboard' },
      { href:'kooper-care-plans.html',      label:'Care plans' },
      { href:'kooper-clinical.html',        label:'Clinical' },
      { href:'kooper-recording-demo.html',  label:'Reporting' },
      { href:'kooper-chat.html',            label:'Team chat' },
      { href:'kooper-reports.html',         label:'Reports' },
      { href:'kooper-rota.html',            label:'Rota' },
      { href:'kooper-sign-in.html',         label:'Sign out', cta:false, divider:true }
    ];
    var links = marketing ? marketingLinks : appLinks;

    var inner = '<div class="kn-drawer-head"><span style="font-family:Space Grotesk,sans-serif;font-weight:600">kooper</span><button class="kn-x" aria-label="Close" id="knDrawerX">×</button></div>';
    links.forEach(function (l) {
      if (l.divider) inner += '<div class="kn-divider"></div>';
      var cls = l.cta ? 'kn-cta' : '';
      inner += '<a href="' + l.href + '" class="' + cls + '">' + l.label + '</a>';
    });
    d.innerHTML = inner;
    document.body.appendChild(d);

    var scrim = document.createElement('div');
    scrim.id = 'knScrim';
    scrim.className = 'kn-scrim';
    scrim.addEventListener('click', closeDrawer);
    document.body.appendChild(scrim);

    document.getElementById('knDrawerX').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  }
  function openDrawer() {
    var d = document.getElementById('knDrawer'), s = document.getElementById('knScrim');
    if (d) d.classList.add('on');
    if (s) s.classList.add('on');
  }
  function closeDrawer() {
    var d = document.getElementById('knDrawer'), s = document.getElementById('knScrim');
    if (d) d.classList.remove('on');
    if (s) s.classList.remove('on');
  }

  // ---- Marketing-surface AI link injection --------------------
  // On marketing pages the nav should surface kooper · ai as a real
  // link to the product deep-dive. We add it to the nav's center
  // link group once, after detecting the surface.
  function injectMarketingAILink() {
    if (!isMarketing()) return;
    if (document.getElementById('knMarketingAI')) return;
    if (pageKey() === 'ai') return; // already on the AI page
    var nav = document.querySelector('nav'); if (!nav) return;
    var centerWrap = nav.querySelector('.kn-center-marked');
    if (!centerWrap) return;
    var has = centerWrap.querySelector('a[href$="kooper-ai.html"]');
    if (has) { has.id = has.id || 'knMarketingAI'; return; }
    var a = document.createElement('a');
    a.id = 'knMarketingAI';
    a.href = 'kooper-ai.html';
    a.className = 'nav-link';
    a.setAttribute('data-kooper-center-link','');
    a.textContent = 'kooper · ai';
    centerWrap.appendChild(a);
  }

  // ---- Boot ---------------------------------------------------
  function boot() {
    injectStyles();
    tidyEachNav();
    buildDrawer();
    injectMarketingAILink();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
