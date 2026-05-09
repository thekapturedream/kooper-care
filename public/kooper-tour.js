/* ============================================================
   kooper · tour — guided tour + hints overlay
   --------------------------------------------------------------
   Drop-in for any kooper page. Provides:
   1) An ambient "Hints" mode — yellow pulse dots near key
      features. Tap or hover a dot for a one-line tooltip.
   2) A step-by-step guided tour — spotlight + tooltip moves
      through innovations in order. Prev / Next / Skip / Close.
   3) A header toggle button (#kooperHintsBtn) that flips
      between Hints On / Off, with a state stored in localStorage.

   How to use on a page:
     <script src="kooper-tour.js" defer></script>
     <script id="kooper-tour-config" type="application/json">
       {
         "page": "reporting",
         "steps": [
           { "target": "#userTypeRail", "title": "...", "body": "...",
             "placement": "bottom" },
           ...
         ],
         "hints": [
           { "target": "#someElement", "label": "What this does..." },
           ...
         ]
       }
     </script>
   ============================================================ */
(function () {
  'use strict';

  // --- Inject shared styles --------------------------------------
  var STYLE = `
  .kt-scrim { position: fixed; inset: 0; z-index: 9990; pointer-events: none; opacity: 0; transition: opacity 0.18s ease; background: rgba(10,10,10,0.55); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
  .kt-scrim.on { opacity: 1; pointer-events: auto; }
  .kt-spotlight { position: absolute; border-radius: 14px; box-shadow: 0 0 0 9999px rgba(10,10,10,0.62); pointer-events: none; transition: top 0.32s ease, left 0.32s ease, width 0.32s ease, height 0.32s ease; }

  .kt-tooltip { position: fixed; z-index: 9995; background: #FFFFFF; border-radius: 14px; box-shadow: 0 22px 50px -16px rgba(0,0,0,0.42); width: min(340px, calc(100vw - 32px)); padding: 0; opacity: 0; pointer-events: none; transition: opacity 0.18s ease, transform 0.18s ease; transform: translateY(-4px); overflow: hidden; }
  .kt-tooltip.on { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .kt-tooltip-head { padding: 0.875rem 1rem 0.25rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 0.625rem; }
  .kt-step-counter { font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.12em; color: #876300; background: #FFFBEB; padding: 0.1875rem 0.5rem; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }
  .kt-x { background: transparent; border: 0; cursor: pointer; color: #6B7280; padding: 0.25rem; border-radius: 6px; line-height: 0; flex-shrink: 0; }
  .kt-x:hover { color: #0A0A0A; background: #F5F5F5; }
  .kt-tooltip-body { padding: 0.25rem 1rem 0.875rem; }
  .kt-tooltip-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 600; font-size: 1rem; line-height: 1.25; color: #0A0A0A; letter-spacing: -0.01em; margin-bottom: 0.375rem; }
  .kt-tooltip-text { font-size: 0.8125rem; line-height: 1.5; color: #3A3A3A; }
  .kt-tooltip-text strong { color: #0A0A0A; font-weight: 600; }
  .kt-tooltip-foot { padding: 0.625rem 1rem; background: #FAFAF7; border-top: 1px solid #ECEAE3; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .kt-tooltip-foot .kt-foot-left { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .kt-skip { background: transparent; border: 0; cursor: pointer; font-size: 0.6875rem; font-weight: 500; color: #6B7280; padding: 0.375rem 0.5rem; border-radius: 6px; }
  .kt-skip:hover { color: #0A0A0A; background: #F5F5F5; }
  .kt-prev, .kt-next { padding: 0.375rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.12s ease; border: 1px solid transparent; font-family: inherit; }
  .kt-prev { background: #FFFFFF; color: #0A0A0A; border-color: #D4D4D4; }
  .kt-prev:hover { border-color: #0A0A0A; }
  .kt-prev:disabled { opacity: 0.4; cursor: not-allowed; }
  .kt-next { background: #0A0A0A; color: #FFD400; border-color: #0A0A0A; display: inline-flex; align-items: center; gap: 0.25rem; }
  .kt-next:hover { background: #FFD400; color: #0A0A0A; }
  .kt-toggle-inline { display: inline-flex; align-items: center; gap: 0.375rem; font-size: 0.6875rem; color: #6B7280; cursor: pointer; user-select: none; padding: 0.25rem 0.375rem; border-radius: 6px; }
  .kt-toggle-inline:hover { background: #F5F5F5; color: #0A0A0A; }
  .kt-toggle-inline .kt-sw { width: 22px; height: 12px; background: #D4D4D4; border-radius: 999px; position: relative; transition: background 0.15s ease; flex-shrink: 0; }
  .kt-toggle-inline .kt-sw::after { content: ''; position: absolute; top: 1px; left: 1px; width: 10px; height: 10px; background: #FFFFFF; border-radius: 50%; transition: transform 0.18s ease; }
  .kt-toggle-inline.on .kt-sw { background: #0A0A0A; }
  .kt-toggle-inline.on .kt-sw::after { transform: translateX(10px); background: #FFD400; }

  /* Header hints button states */
  #kooperHintsBtn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.625rem; border-radius: 8px; cursor: pointer; transition: all 0.12s ease; background: transparent; border: 1px solid transparent; font: inherit; font-size: 0.75rem; line-height: 1; color: rgba(255,255,255,0.7); white-space: nowrap; }
  #kooperHintsBtn:hover { background: rgba(255,255,255,0.08); color: #FFFFFF; }
  #kooperHintsBtn.is-on { color: #FFD400; background: rgba(255,212,0,0.12); border-color: rgba(255,212,0,0.35); }
  #kooperHintsBtn .kt-hint-dot-mini { width: 7px; height: 7px; border-radius: 999px; background: #FFD400; flex-shrink: 0; }
  #kooperHintsBtn.is-on .kt-hint-dot-mini { animation: kt-pulse 1.6s ease-out infinite; }
  /* Light-mode contexts (sign-in etc) */
  #kooperHintsBtn.kt-light { color: #6B7280; }
  #kooperHintsBtn.kt-light:hover { background: #F5F5F5; color: #0A0A0A; }
  #kooperHintsBtn.kt-light.is-on { color: #876300; background: #FFFBEB; border-color: rgba(255,212,0,0.5); }

  /* Ambient hints — pulse dots that float near key elements */
  .kt-hint-dot { position: absolute; z-index: 80; width: 14px; height: 14px; border-radius: 999px; background: #FFD400; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: pointer; pointer-events: auto; }
  .kt-hint-dot::before { content: ''; position: absolute; inset: -1px; border-radius: 999px; background: #0A0A0A; z-index: -1; }
  .kt-hint-dot::after { content: ''; position: absolute; inset: 0; border-radius: 999px; background: #FFD400; opacity: 0.5; animation: kt-pulse 1.8s ease-out infinite; }
  @keyframes kt-pulse { 0% { transform: scale(0.7); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
  .kt-hint-dot:hover, .kt-hint-dot:focus { transform: scale(1.15); outline: none; }
  .kt-hint-tooltip { position: fixed; z-index: 90; background: #0A0A0A; color: #FFFFFF; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.75rem; max-width: 240px; line-height: 1.4; box-shadow: 0 12px 28px -10px rgba(0,0,0,0.4); opacity: 0; pointer-events: none; transition: opacity 0.14s ease; }
  .kt-hint-tooltip.on { opacity: 1; pointer-events: auto; }

  /* Hints button menu (right-click / long-press) */
  .kt-menu { position: fixed; z-index: 9996; background: #FFFFFF; border: 1px solid #ECEAE3; border-radius: 12px; box-shadow: 0 18px 40px -14px rgba(0,0,0,0.22); padding: 0.375rem; min-width: 220px; opacity: 0; pointer-events: none; transform: translateY(-4px); transition: opacity 0.14s ease, transform 0.14s ease; }
  .kt-menu.on { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .kt-menu-item { display: flex; align-items: center; gap: 0.625rem; padding: 0.5rem 0.625rem; border-radius: 8px; cursor: pointer; font-size: 0.8125rem; color: #1A1A1A; transition: background 0.12s ease; user-select: none; border: 0; background: transparent; width: 100%; text-align: left; font-family: inherit; }
  .kt-menu-item:hover { background: #FAFAF7; }
  .kt-menu-item .kt-menu-ico { width: 22px; height: 22px; border-radius: 6px; background: #FFFBEB; color: #876300; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 700; }
  .kt-menu-item .kt-menu-ico.dark { background: #0A0A0A; color: #FFD400; }
  .kt-menu-divider { height: 1px; background: #ECEAE3; margin: 0.25rem 0.375rem; }
  .kt-menu-foot { padding: 0.4375rem 0.625rem 0.25rem; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9A9A9A; }

  /* Tour launch button — for first-time visitors */
  .kt-launch-strip { position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%) translateY(8px); z-index: 70; background: #0A0A0A; color: #FFFFFF; padding: 0.625rem 0.875rem 0.625rem 0.75rem; border-radius: 999px; box-shadow: 0 14px 36px -12px rgba(0,0,0,0.45); display: flex; align-items: center; gap: 0.625rem; font-size: 0.8125rem; font-weight: 500; opacity: 0; pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease; max-width: calc(100vw - 24px); width: max-content; flex-wrap: nowrap; white-space: nowrap; }
  .kt-launch-strip.on { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
  .kt-launch-strip .kt-launch-icon { width: 24px; height: 24px; border-radius: 50%; background: #FFD400; color: #0A0A0A; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700; font-size: 0.75rem; line-height: 1; }
  .kt-launch-strip .kt-launch-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .kt-launch-cta { background: #FFD400; color: #0A0A0A; border: 0; padding: 0.3125rem 0.6875rem; border-radius: 999px; font-size: 0.6875rem; font-weight: 700; cursor: pointer; font-family: inherit; flex-shrink: 0; white-space: nowrap; line-height: 1.2; }
  .kt-launch-cta:hover { background: #F5B400; }
  .kt-launch-x { background: transparent; border: 0; color: rgba(255,255,255,0.5); cursor: pointer; padding: 0.25rem; line-height: 0; flex-shrink: 0; }
  .kt-launch-x:hover { color: #FFFFFF; }
  /* Mobile · narrow viewports */
  @media (max-width: 480px) {
    .kt-launch-strip { left: 12px; right: 12px; transform: none; max-width: calc(100vw - 24px); width: auto; padding: 0.5rem 0.625rem; gap: 0.5rem; font-size: 0.75rem; }
    .kt-launch-strip.on { transform: none; }
    .kt-launch-strip .kt-launch-text { font-size: 0.75rem; }
    .kt-launch-strip .kt-launch-text-long { display: none; }
  }
  `;

  function injectStyles() {
    if (document.getElementById('kt-styles')) return;
    var s = document.createElement('style');
    s.id = 'kt-styles';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  // --- State -----------------------------------------------------
  var LS_TOUR = 'kooper:tour:completed';
  var LS_HINTS = 'kooper:hints:on';
  var state = {
    config: null,
    stepIndex: 0,
    inTour: false,
    hintsOn: localStorage.getItem(LS_HINTS) === '1'
  };

  // --- Helpers ---------------------------------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function getRect(el) {
    var r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height };
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // --- Spotlight + tooltip elements -----------------------------
  var scrim, spotlight, tooltip;
  function ensureChrome() {
    if (scrim) return;
    scrim = document.createElement('div');
    scrim.className = 'kt-scrim';
    document.body.appendChild(scrim);
    spotlight = document.createElement('div');
    spotlight.className = 'kt-spotlight';
    scrim.appendChild(spotlight);
    tooltip = document.createElement('div');
    tooltip.className = 'kt-tooltip';
    document.body.appendChild(tooltip);
  }

  function placeSpotlight(rect, padding) {
    padding = padding != null ? padding : 8;
    spotlight.style.top = (rect.top - padding) + 'px';
    spotlight.style.left = (rect.left - padding) + 'px';
    spotlight.style.width = (rect.width + padding * 2) + 'px';
    spotlight.style.height = (rect.height + padding * 2) + 'px';
  }

  function placeTooltip(targetRect, placement) {
    var ttRect = tooltip.getBoundingClientRect();
    var vpW = window.innerWidth;
    var vpH = window.innerHeight;
    var gap = 14;
    var top, left;
    var place = placement || 'bottom';
    // Auto fall-through if placement won't fit
    var fits = function (p) {
      if (p === 'bottom') return (targetRect.top + targetRect.height + gap + ttRect.height) < (window.scrollY + vpH);
      if (p === 'top')    return (targetRect.top - gap - ttRect.height) > window.scrollY;
      if (p === 'right')  return (targetRect.left + targetRect.width + gap + ttRect.width) < (window.scrollX + vpW);
      if (p === 'left')   return (targetRect.left - gap - ttRect.width) > window.scrollX;
      return true;
    };
    if (!fits(place)) {
      var fallback = ['bottom','top','right','left'].filter(function (p) { return p !== place && fits(p); });
      if (fallback.length) place = fallback[0];
    }
    if (place === 'bottom') { top = targetRect.top + targetRect.height + gap; left = targetRect.left + targetRect.width / 2 - ttRect.width / 2; }
    else if (place === 'top') { top = targetRect.top - ttRect.height - gap; left = targetRect.left + targetRect.width / 2 - ttRect.width / 2; }
    else if (place === 'right') { top = targetRect.top + targetRect.height / 2 - ttRect.height / 2; left = targetRect.left + targetRect.width + gap; }
    else if (place === 'left')  { top = targetRect.top + targetRect.height / 2 - ttRect.height / 2; left = targetRect.left - ttRect.width - gap; }
    // Clamp to viewport
    left = clamp(left, window.scrollX + 12, window.scrollX + vpW - ttRect.width - 12);
    top  = clamp(top,  window.scrollY + 12, window.scrollY + vpH - ttRect.height - 12);
    tooltip.style.top = (top - window.scrollY) + 'px';
    tooltip.style.left = (left - window.scrollX) + 'px';
  }

  // --- Render the current tour step -----------------------------
  function renderStep() {
    var steps = (state.config && state.config.steps) || [];
    if (!steps.length) return;
    var step = steps[state.stepIndex];
    if (!step) return;
    var target = $(step.target);
    if (!target) {
      // Skip missing target
      if (state.stepIndex < steps.length - 1) { state.stepIndex++; renderStep(); }
      else { closeTour(); }
      return;
    }
    // Scroll target into view (centered) before placing chrome
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      var rect = target.getBoundingClientRect();
      // Use viewport-relative for spotlight (since scrim is fixed)
      spotlight.style.top = (rect.top - 8) + 'px';
      spotlight.style.left = (rect.left - 8) + 'px';
      spotlight.style.width = (rect.width + 16) + 'px';
      spotlight.style.height = (rect.height + 16) + 'px';
      // Build tooltip
      var hintsToggleHTML = '<span class="kt-toggle-inline ' + (state.hintsOn ? 'on' : '') + '" data-kt-hints-inline tabindex="0" role="button" aria-label="Toggle hints"><span class="kt-sw"></span>Hints</span>';
      tooltip.innerHTML =
        '<div class="kt-tooltip-head">' +
          '<span class="kt-step-counter">Step ' + (state.stepIndex + 1) + ' of ' + steps.length + '</span>' +
          '<button class="kt-x" data-kt-close aria-label="Close tour">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="kt-tooltip-body">' +
          '<div class="kt-tooltip-title">' + escapeHTML(step.title || '') + '</div>' +
          '<div class="kt-tooltip-text">' + (step.body || '') + '</div>' +
        '</div>' +
        '<div class="kt-tooltip-foot">' +
          '<div class="kt-foot-left">' +
            (state.stepIndex < steps.length - 1
              ? '<button class="kt-skip" data-kt-skip>Skip tour</button>'
              : '<button class="kt-skip" data-kt-skip>Done</button>') +
            hintsToggleHTML +
          '</div>' +
          '<div style="display:flex;gap:0.375rem">' +
            '<button class="kt-prev" data-kt-prev' + (state.stepIndex === 0 ? ' disabled' : '') + '>Back</button>' +
            (state.stepIndex < steps.length - 1
              ? '<button class="kt-next" data-kt-next>Next →</button>'
              : '<button class="kt-next" data-kt-finish>Finish ✓</button>') +
          '</div>' +
        '</div>';
      // Position
      tooltip.classList.add('on');
      requestAnimationFrame(function () {
        placeTooltip(rect, step.placement || 'bottom');
      });
    }, 320);
  }

  function escapeHTML(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); }

  // --- Tour controls --------------------------------------------
  function startTour() {
    ensureChrome();
    if (!state.config || !state.config.steps || !state.config.steps.length) return;
    state.inTour = true;
    state.stepIndex = 0;
    scrim.classList.add('on');
    document.body.style.overflow = 'hidden';
    hideHints();
    hideLaunchStrip();
    renderStep();
  }
  function nextStep() {
    var len = (state.config.steps || []).length;
    if (state.stepIndex < len - 1) {
      tooltip.classList.remove('on');
      state.stepIndex++;
      setTimeout(renderStep, 80);
    } else { closeTour(true); }
  }
  function prevStep() {
    if (state.stepIndex > 0) {
      tooltip.classList.remove('on');
      state.stepIndex--;
      setTimeout(renderStep, 80);
    }
  }
  function closeTour(completed) {
    if (!state.inTour) return;
    state.inTour = false;
    if (scrim) scrim.classList.remove('on');
    if (tooltip) tooltip.classList.remove('on');
    document.body.style.overflow = '';
    if (completed) localStorage.setItem(LS_TOUR, '1');
    if (state.hintsOn) showHints();
  }

  // --- Ambient hints --------------------------------------------
  var hintDots = [];
  var hintTooltipEl;
  function showHints() {
    var hints = (state.config && state.config.hints) || [];
    hideHints();
    if (!hintTooltipEl) {
      hintTooltipEl = document.createElement('div');
      hintTooltipEl.className = 'kt-hint-tooltip';
      document.body.appendChild(hintTooltipEl);
    }
    hints.forEach(function (h, idx) {
      var target = $(h.target);
      if (!target) return;
      // Make sure target's offsetParent is positioned — fallback: anchor the dot to body absolute via target rect on scroll
      var dot = document.createElement('button');
      dot.className = 'kt-hint-dot';
      dot.setAttribute('aria-label', h.label);
      dot.dataset.hintIndex = idx;
      dot.dataset.hintLabel = h.label;
      document.body.appendChild(dot);
      hintDots.push({ el: dot, target: target, label: h.label });
      // Show on hover/focus, hide on leave
      function showTip(e) {
        hintTooltipEl.textContent = h.label;
        hintTooltipEl.classList.add('on');
        var dr = dot.getBoundingClientRect();
        var ttR = hintTooltipEl.getBoundingClientRect();
        var top = dr.top - ttR.height - 8;
        var left = dr.left + dr.width / 2 - ttR.width / 2;
        if (top < 8) top = dr.top + dr.height + 8;
        left = clamp(left, 8, window.innerWidth - ttR.width - 8);
        hintTooltipEl.style.top = top + 'px';
        hintTooltipEl.style.left = left + 'px';
      }
      function hideTip() { hintTooltipEl.classList.remove('on'); }
      dot.addEventListener('mouseenter', showTip);
      dot.addEventListener('mouseleave', hideTip);
      dot.addEventListener('focus', showTip);
      dot.addEventListener('blur', hideTip);
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        showTip(e);
        // Keep visible briefly on tap
        clearTimeout(window.__ktHintTimer);
        window.__ktHintTimer = setTimeout(hideTip, 2400);
      });
    });
    repositionHints();
    window.addEventListener('scroll', repositionHints, { passive: true });
    window.addEventListener('resize', repositionHints);
  }
  function hideHints() {
    hintDots.forEach(function (h) { if (h.el && h.el.parentNode) h.el.parentNode.removeChild(h.el); });
    hintDots = [];
    if (hintTooltipEl) hintTooltipEl.classList.remove('on');
    window.removeEventListener('scroll', repositionHints);
    window.removeEventListener('resize', repositionHints);
  }
  function repositionHints() {
    hintDots.forEach(function (h) {
      var r = h.target.getBoundingClientRect();
      // Place dot at top-right of target
      h.el.style.top = (r.top + window.scrollY - 7) + 'px';
      h.el.style.left = (r.left + window.scrollX + r.width - 7) + 'px';
    });
  }

  // --- Hints toggle button --------------------------------------
  function setHintsBtn() {
    var btn = document.getElementById('kooperHintsBtn');
    if (!btn) return;
    btn.classList.toggle('is-on', state.hintsOn);
    var label = btn.querySelector('[data-kt-label]') || btn;
    if (label !== btn) label.textContent = state.hintsOn ? 'Hints on' : 'Hints';
  }
  function toggleHints() {
    state.hintsOn = !state.hintsOn;
    localStorage.setItem(LS_HINTS, state.hintsOn ? '1' : '0');
    setHintsBtn();
    if (state.inTour) return;
    if (state.hintsOn) showHints(); else hideHints();
  }

  // --- First-visit launch strip ---------------------------------
  var launchEl;
  function showLaunchStrip() {
    if (launchEl) return;
    launchEl = document.createElement('div');
    launchEl.className = 'kt-launch-strip';
    launchEl.innerHTML =
      '<span class="kt-launch-icon">★</span>' +
      '<span class="kt-launch-text"><span class="kt-launch-text-long">New here? </span>Quick tour of <strong>kooper · ' + (state.config.page || 'this page') + '</strong></span>' +
      '<button class="kt-launch-cta" data-kt-launch>Take tour</button>' +
      '<button class="kt-launch-x" data-kt-launch-x aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>';
    document.body.appendChild(launchEl);
    requestAnimationFrame(function () { launchEl.classList.add('on'); });
  }
  function hideLaunchStrip() {
    if (!launchEl) return;
    launchEl.classList.remove('on');
    setTimeout(function () { if (launchEl && launchEl.parentNode) { launchEl.parentNode.removeChild(launchEl); launchEl = null; } }, 200);
  }

  // --- Global click delegation ----------------------------------
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-kt-close]')) { closeTour(); return; }
    if (e.target.closest('[data-kt-skip]'))  { closeTour(true); return; }
    if (e.target.closest('[data-kt-prev]'))  { prevStep(); return; }
    if (e.target.closest('[data-kt-next]'))  { nextStep(); return; }
    if (e.target.closest('[data-kt-finish]')){ closeTour(true); return; }
    if (e.target.closest('[data-kt-hints-inline]')) { e.preventDefault(); toggleHints(); /* update inline switch immediately */ var sw = document.querySelector('[data-kt-hints-inline]'); if (sw) sw.classList.toggle('on', state.hintsOn); return; }
    if (e.target.closest('#kooperHintsBtn'))  { e.preventDefault(); toggleHints(); return; }
    if (e.target.closest('[data-kt-launch]')) { hideLaunchStrip(); startTour(); return; }
    if (e.target.closest('[data-kt-launch-x]')){ hideLaunchStrip(); localStorage.setItem(LS_TOUR, 'dismissed'); return; }
    if (e.target.closest('[data-kt-start]'))  { startTour(); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (!state.inTour) return;
    if (e.key === 'Escape') closeTour();
    else if (e.key === 'ArrowRight') nextStep();
    else if (e.key === 'ArrowLeft')  prevStep();
  });

  // --- Hints button options menu --------------------------------
  var menuEl;
  function buildMenu() {
    if (menuEl) return menuEl;
    menuEl = document.createElement('div');
    menuEl.className = 'kt-menu';
    menuEl.setAttribute('role', 'menu');
    menuEl.innerHTML =
      '<div class="kt-menu-foot">Hints &amp; tour</div>' +
      '<button class="kt-menu-item" data-kt-menu="replay" role="menuitem">' +
        '<span class="kt-menu-ico dark">▶</span>' +
        '<span>Replay this page\'s tour</span>' +
      '</button>' +
      '<button class="kt-menu-item" data-kt-menu="hints" role="menuitem">' +
        '<span class="kt-menu-ico"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg></span>' +
        '<span data-kt-menu-hints-label>Toggle hints</span>' +
      '</button>' +
      '<div class="kt-menu-divider"></div>' +
      '<button class="kt-menu-item" data-kt-menu="reset" role="menuitem">' +
        '<span class="kt-menu-ico">↺</span>' +
        '<span>Reset all tours · show launch strip again</span>' +
      '</button>' +
      '<div class="kt-menu-foot">Tip · right-click Hints to open this menu</div>';
    document.body.appendChild(menuEl);
    return menuEl;
  }
  function openMenu(anchor) {
    var m = buildMenu();
    var lbl = m.querySelector('[data-kt-menu-hints-label]');
    if (lbl) lbl.textContent = state.hintsOn ? 'Turn hints off' : 'Turn hints on';
    var r = anchor.getBoundingClientRect();
    var mw = 240; // approx min-width
    m.style.top  = (r.bottom + 8) + 'px';
    var left = r.right - mw;
    if (left < 12) left = 12;
    if (left + mw > window.innerWidth - 12) left = window.innerWidth - mw - 12;
    m.style.left = left + 'px';
    m.classList.add('on');
  }
  function closeMenu() { if (menuEl) menuEl.classList.remove('on'); }

  // Long-press detection for touch
  function attachHintsBtnHandlers() {
    var btn = document.getElementById('kooperHintsBtn');
    if (!btn || btn.dataset.ktAttached === '1') return;
    btn.dataset.ktAttached = '1';
    // Right-click → open menu
    btn.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      openMenu(btn);
    });
    // Long-press for touch
    var pressTimer = null;
    btn.addEventListener('touchstart', function () {
      pressTimer = setTimeout(function () { openMenu(btn); pressTimer = null; }, 550);
    }, { passive: true });
    var cancel = function () { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
    btn.addEventListener('touchend',    cancel);
    btn.addEventListener('touchmove',   cancel);
    btn.addEventListener('touchcancel', cancel);
    // Tooltip hint
    if (!btn.title) btn.title = 'Click to toggle hints · right-click or long-press for more options';
  }

  // Menu click delegation
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-kt-menu]')) {
      var item = e.target.closest('[data-kt-menu]');
      var k = item.dataset.ktMenu;
      closeMenu();
      if (k === 'replay') { startTour(); }
      else if (k === 'hints') { toggleHints(); }
      else if (k === 'reset') {
        localStorage.removeItem(LS_TOUR);
        kooperBriefMessage('Reset · launch strip will reappear on every page');
        // Show launch strip on this page right now
        setTimeout(showLaunchStrip, 200);
      }
      return;
    }
    // Close menu on outside click
    if (menuEl && menuEl.classList.contains('on') && !e.target.closest('.kt-menu') && !e.target.closest('#kooperHintsBtn')) {
      closeMenu();
    }
  });

  // Brief inline message (toast-like, doesn't depend on host page's toast helper)
  function kooperBriefMessage(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#0A0A0A;color:#FFD400;padding:0.625rem 1rem;border-radius:8px;font-size:0.8125rem;font-weight:500;z-index:9997;font-family:Inter,sans-serif;box-shadow:0 10px 24px -8px rgba(0,0,0,0.4);';
    document.body.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity 0.3s ease'; t.style.opacity = '0'; }, 1700);
    setTimeout(function () { t.remove(); }, 2100);
  }

  // --- Public API + init -----------------------------------------
  window.kooperTour = {
    start: startTour,
    close: closeTour,
    toggleHints: toggleHints,
    openMenu: function () { var btn = document.getElementById('kooperHintsBtn'); if (btn) openMenu(btn); },
    isHintsOn: function () { return state.hintsOn; }
  };

  function init() {
    injectStyles();
    var configEl = document.getElementById('kooper-tour-config');
    if (!configEl) return;
    try { state.config = JSON.parse(configEl.textContent.trim()); }
    catch (e) { console.warn('kooper-tour: invalid config JSON', e); return; }
    setHintsBtn();
    attachHintsBtnHandlers();
    if (state.hintsOn) showHints();
    // Show launch strip if first visit (no completed/dismissed flag in storage)
    var seen = localStorage.getItem(LS_TOUR);
    if (!seen && state.config.steps && state.config.steps.length) {
      setTimeout(showLaunchStrip, 900);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
