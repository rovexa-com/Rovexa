/* ============================================================
   Hero "build console" animation
   Building -> Designing -> Optimizing -> Ready -> loop
   Pure vanilla JS + CSS (no external deps). Everything below is
   driven by a single timeline array so the sequence/timings are
   easy to tweak in one place.
   ============================================================ */
(() => {
  'use strict';

  const consoleEl = document.getElementById('buildConsole');
  if (!consoleEl) return; // hero console only exists on the homepage

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sitePreview = document.getElementById('sitePreview');
  const spCta = document.getElementById('spCta');
  const spCursor = document.getElementById('spCursor');
  const ringBar = document.getElementById('ringBar');
  const ringLabel = document.getElementById('ringLabel');
  const badges = {
    seo: document.getElementById('badgeSeo'),
    mobile: document.getElementById('badgeMobile'),
    speed: document.getElementById('badgeSpeed'),
  };

  /* ---------------- Progress ring math ---------------- */
  const RING_R = 31;
  const RING_C = 2 * Math.PI * RING_R;
  if (ringBar) {
    ringBar.style.strokeDasharray = String(RING_C);
  }

  const setRingPercent = (pct) => {
    if (!ringBar) return;
    const offset = RING_C - (RING_C * pct) / 100;
    ringBar.style.strokeDashoffset = String(offset);
    if (ringLabel) ringLabel.textContent = `${Math.round(pct)}%`;
  };

  let ringRAF = null;
  const animateRingTo = (from, to, duration) => {
    if (ringRAF) cancelAnimationFrame(ringRAF);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setRingPercent(from + (to - from) * eased);
      if (p < 1) ringRAF = requestAnimationFrame(step);
    };
    ringRAF = requestAnimationFrame(step);
  };

  /* ---------------- Static end-state for reduced motion ---------------- */
  if (reduceMotion) {
    consoleEl.dataset.stage = 'active';
    setRingPercent(92);
    Object.values(badges).forEach((b) => b && b.classList.add('is-done'));
    if (sitePreview) sitePreview.classList.remove('scan-active', 'ready-active');
    return; // no looping timeline
  }

  /* ---------------- Full animated timeline ---------------- */
  const TOTAL_MS = 6500;
  const RING_START = 65;
  const RING_END = 92;

  const resetAll = () => {
    consoleEl.dataset.stage = 'skeleton';
    setRingPercent(RING_START);
    Object.values(badges).forEach((b) => b && b.classList.remove('is-done'));
    if (sitePreview) sitePreview.classList.remove('scan-active', 'ready-active');
    if (spCta) spCta.classList.remove('cta-hover');
    if (spCursor) spCursor.classList.remove('cursor-active');
  };

  const enterActiveStage = () => {
    consoleEl.dataset.stage = 'active';
  };

  const startOptimize = () => {
    animateRingTo(RING_START, RING_END, 1600);
  };

  const activateBadge = (key) => {
    const el = badges[key];
    if (el) el.classList.add('is-done');
  };

  const startScan = () => {
    if (!sitePreview) return;
    sitePreview.classList.remove('scan-active');
    // force reflow so the animation restarts cleanly each loop
    void sitePreview.offsetWidth;
    sitePreview.classList.add('scan-active');
  };

  const showReady = () => {
    if (sitePreview) sitePreview.classList.add('ready-active');
    if (spCursor) spCursor.classList.add('cursor-active');
    if (spCta) spCta.classList.add('cta-hover');
  };

  const hideReady = () => {
    if (sitePreview) sitePreview.classList.remove('ready-active', 'scan-active');
    if (spCursor) spCursor.classList.remove('cursor-active');
    if (spCta) spCta.classList.remove('cta-hover');
  };

  const timers = [];
  const schedule = (delay, fn) => timers.push(setTimeout(fn, delay));

  const runCycle = () => {
    timers.forEach(clearTimeout);
    timers.length = 0;

    resetAll();                                    // 0ms    — skeleton loading
    schedule(700, enterActiveStage);                // 700ms  — building starts
    schedule(1500, startOptimize);                  // 1500ms — optimization begins
    schedule(1600, () => activateBadge('seo'));
    schedule(2100, () => activateBadge('mobile'));
    schedule(2600, () => activateBadge('speed'));
    schedule(3300, startScan);                       // 3300ms — final scan
    schedule(4200, showReady);                       // 4200ms — "Website ready"
    schedule(5200, hideReady);                        // 5200ms — begin reset
    schedule(5400, resetAll);                         // 5400ms — back to skeleton

    schedule(TOTAL_MS, runCycle);                     // loop
  };

  // Run only while the hero is on screen AND the tab is visible.
  let inView = false;
  const stop = () => {
    timers.forEach(clearTimeout); timers.length = 0;
    if (ringRAF) cancelAnimationFrame(ringRAF);
  };
  const sync = () => {
    if (inView && !document.hidden) runCycle(); else stop();
  };
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const v = entries[entries.length - 1].isIntersecting;
      if (v !== inView) { inView = v; sync(); }
    }, { threshold: 0.2 }).observe(consoleEl);
  } else {
    inView = true; runCycle();
  }
})();
