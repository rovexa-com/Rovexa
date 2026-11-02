(() => {
  'use strict';
  const cv = document.getElementById('confetti');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  const small = matchMedia('(max-width:720px)').matches;
  const N = small ? 55 : 110;
  const colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c026d3', '#e04fe8', '#f472e0', '#f6f3fc'];
  let w, h, dpr, parts = [], raf = 0, t0 = 0;
  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const make = () => ({
    x: w / 2 + (Math.random() - .5) * 120,
    y: h * .38,
    vx: (Math.random() - .5) * (small ? 9 : 14),
    vy: -(Math.random() * 11 + 5),
    s: Math.random() * 6 + 4,
    r: Math.random() * Math.PI * 2,
    vr: (Math.random() - .5) * .35,
    c: colors[(Math.random() * colors.length) | 0],
    round: Math.random() > .6
  });
  const tick = (now) => {
    if (!t0) t0 = now;
    ctx.clearRect(0, 0, w, h);
    const fade = Math.max(0, 1 - (now - t0 - 2600) / 1200);
    parts.forEach(p => {
      p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 6.283); ctx.fill(); }
      else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    });
    if (fade > 0) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  };
  const start = () => {
    size();
    parts = Array.from({ length: N }, make);
    raf = requestAnimationFrame(tick);
  };
  // fire once the check mark has drawn
  setTimeout(start, 1200);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (parts.length && t0) raf = requestAnimationFrame(tick); });
})();
