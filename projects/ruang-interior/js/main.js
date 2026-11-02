/* RUANG — Interior Atelier · site behaviour (no dependencies) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG — wire up the enquiry form here.
     Option A: set ENDPOINT to a form service URL (Formspree, Getform,
               Basin, your own PHP/Node handler…). The form is POSTed as JSON.
     Option B: leave it empty and the form opens the visitor's email app
               addressed to EMAIL, pre-filled with their message.
     ------------------------------------------------------------------ */
  var CONFIG = { ENDPOINT: "", EMAIL: "hello@ruangatelier.my" };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ARROW = '<svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 5h17M13 1l4 4-4 4"/></svg>';

  /* ---------------- Header ---------------- */
  var hdr = $(".hdr");
  function onScroll() { hdr.classList.toggle("stuck", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var burger = $(".burger");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  $$(".mnav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------------- Reveal on scroll ---------------- */
  var targets = $$(".rv,.rvi");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* ---------------- Parallax ---------------- */
  var pars = $$("[data-par]");
  if (pars.length && !reduce) {
    var ticking = false;
    var run = function () {
      var vh = window.innerHeight;
      pars.forEach(function (p) {
        var host = p.parentElement.getBoundingClientRect();
        if (host.bottom < -100 || host.top > vh + 100) return;
        var prog = (host.top + host.height / 2 - vh / 2) / vh;
        p.style.transform = "translate3d(0," + (prog * -parseFloat(p.dataset.par)) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    window.addEventListener("resize", run);
    run();
  }

  /* ---------------- Marquee ---------------- */
  $$(".marquee .track").forEach(function (t) { t.innerHTML += t.innerHTML; t.setAttribute("aria-hidden", "true"); });

  /* ---------------- Services hover preview (home) ---------------- */
  var prev = $(".svc-prev");
  if (prev && window.matchMedia("(hover:hover) and (min-width:901px)").matches) {
    var imgs = $$("img", prev);
    var rows = $$(".svc-row");
    var tx = 0, ty = 0, cx = 0, cy = 0, active = false;
    rows.forEach(function (r, i) {
      r.addEventListener("mouseenter", function () {
        imgs.forEach(function (im, j) { im.classList.toggle("on", j === i); });
        prev.classList.add("on"); active = true;
      });
      r.addEventListener("mouseleave", function () { prev.classList.remove("on"); active = false; });
    });
    window.addEventListener("mousemove", function (e) { tx = e.clientX + 36; ty = e.clientY - 150; });
    (function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      prev.style.transform = "translate3d(" + cx + "px," + cy + "px,0) scale(" + (active ? 1 : .85) + ")";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- Gallery + lightbox (projects) ---------------- */
  var PROJECTS = {
    a: { t: "Rumah Kenanga", loc: "Kuala Kangsar, Perak", y: 2024, cat: "Heritage", size: "3,400 sq ft", dur: "11 months", scope: "Restoration · Joinery · Lighting",
      note: "A century-old timber house re-roofed and re-floored in reclaimed chengal. Every carved panel was catalogued, repaired and put back where it began." },
    b: { t: "The Rimba Atrium", loc: "Damansara Heights, Kuala Lumpur", y: 2025, cat: "Biophilic", size: "5,800 sq ft", dur: "14 months", scope: "Architecture liaison · Interiors · Landscape",
      note: "A double-height courtyard of water, stone and rainforest planting that cools the whole house and pulls the garden through every room." },
    c: { t: "Pagi House", loc: "Mont Kiara, Kuala Lumpur", y: 2024, cat: "Minimal", size: "2,100 sq ft", dur: "7 months", scope: "Interiors · Bespoke joinery",
      note: "A calm, light-washed home in oak and linen. A study that disappears behind folding doors when the working day is over." },
    d: { t: "Mahkota Residence", loc: "Bukit Tunku, Kuala Lumpur", y: 2023, cat: "Contemporary", size: "6,200 sq ft", dur: "16 months", scope: "Full interiors · Furniture · Styling",
      note: "Veined marble underfoot, a coffered ceiling overhead and deep navy velvet in between. Formal rooms, built for long family evenings." },
    e: { t: "Cendana Lane", loc: "Ipoh, Perak", y: 2023, cat: "Classic", size: "2,600 sq ft", dur: "8 months", scope: "Interiors · Soft furnishings",
      note: "Exposed brick arches, honeyed timber floors and generous drapery — a warm, collected living room with old-world manners." },
    f: { t: "Lembah Loft", loc: "Petaling Jaya, Selangor", y: 2025, cat: "Minimal", size: "1,150 sq ft", dur: "4 months", scope: "Interiors · Styling",
      note: "A compact apartment made generous through texture: turned timber, hand-knit wool and a quiet grey-green palette." },
    g: { t: "Nocturne Penthouse", loc: "KL City Centre", y: 2024, cat: "Contemporary", size: "4,300 sq ft", dur: "12 months", scope: "Full interiors · Lighting design",
      note: "Black-veined marble, brass-edged ceilings and a sculptural light that writes a single line across the room after dark." },
    h: { t: "Hijau Apartment", loc: "Bangsar, Kuala Lumpur", y: 2024, cat: "Biophilic", size: "1,450 sq ft", dur: "5 months", scope: "Interiors · Joinery · Planting",
      note: "Sage walls, a rattan-fronted sideboard and a mirror like a low moon. Plants do most of the decorating." }
  };
  var TILES = [
    { id: "g",  p: "g", src: "img/g.jpg",  w: 2000, h: 1492, kind: "Room" },
    { id: "b2", p: "b", src: "img/b2.jpg", w: 661,  h: 691,  kind: "Detail", cap: "Atrium waterfall & floating stair" },
    { id: "a",  p: "a", src: "img/a.jpg",  w: 1600, h: 1067, kind: "Room" },
    { id: "h",  p: "h", src: "img/h.jpg",  w: 2000, h: 2000, kind: "Room" },
    { id: "d",  p: "d", src: "img/d.jpg",  w: 800,  h: 1200, kind: "Room" },
    { id: "c2", p: "c", src: "img/c2.jpg", w: 632,  h: 614,  kind: "Detail", cap: "The concealed study" },
    { id: "e",  p: "e", src: "img/e.jpg",  w: 1110, h: 624,  kind: "Room" },
    { id: "f2", p: "f", src: "img/f2.jpg", w: 1600, h: 960,  kind: "Detail", cap: "Turned timber & hand-knit wool" },
    { id: "b",  p: "b", src: "img/b.jpg",  w: 1376, h: 768,  kind: "Room" },
    { id: "g2", p: "g", src: "img/g2.jpg", w: 1600, h: 1535, kind: "Detail", cap: "Veined marble feature wall" },
    { id: "f",  p: "f", src: "img/f.jpg",  w: 1333, h: 2000, kind: "Room" },
    { id: "a2", p: "a", src: "img/a2.jpg", w: 544,  h: 747,  kind: "Detail", cap: "Hand-carved timber screen" },
    { id: "c",  p: "c", src: "img/c.jpg",  w: 1376, h: 768,  kind: "Room" },
    { id: "h2", p: "h", src: "img/h2.jpg", w: 1600, h: 1372, kind: "Detail", cap: "Rattan sideboard & round mirror" },
    { id: "d2", p: "d", src: "img/d2.jpg", w: 800,  h: 480,  kind: "Detail", cap: "Coffered ceiling & crystal chandelier" },
    { id: "e2", p: "e", src: "img/e2.jpg", w: 777,  h: 468,  kind: "Detail", cap: "Brick arch shelving" }
  ];

  var grid = $("#masonry");
  if (grid) {
    var CATS = ["All", "Heritage", "Contemporary", "Biophilic", "Classic", "Minimal"];
    var filtersEl = $("#filters"), countEl = $("#galCount");
    var current = "All";

    TILES.forEach(function (t) {
      var P = PROJECTS[t.p];
      t.title = t.kind === "Detail" ? t.cap : P.t;
      var b = document.createElement("button");
      b.className = "tile"; b.type = "button"; b.dataset.cat = P.cat; b.dataset.id = t.id;
      b.setAttribute("aria-label", "View " + t.title + ", " + P.t);
      b.innerHTML =
        '<img src="' + t.src + '" width="' + t.w + '" height="' + t.h + '" alt="' + t.title + " — " + P.t + ", " + P.cat + ' interior" loading="lazy" decoding="async">' +
        '<span class="pl">' + t.kind + "</span>" +
        '<span class="plus"><svg viewBox="0 0 14 14" stroke="currentColor" stroke-width="1"><path d="M7 0v14M0 7h14"/></svg></span>' +
        '<span class="tc"><b>' + t.title + "</b><span>" + P.loc + " · " + P.y + "</span></span>";
      b.addEventListener("click", function () { openLB(t.id); });
      grid.appendChild(b);
      t.el = b;
    });

    CATS.forEach(function (c) {
      var n = c === "All" ? TILES.length : TILES.filter(function (t) { return PROJECTS[t.p].cat === c; }).length;
      var btn = document.createElement("button");
      btn.className = "chip"; btn.type = "button"; btn.setAttribute("aria-pressed", c === "All");
      btn.innerHTML = c + "<sup>" + n + "</sup>";
      btn.addEventListener("click", function () { applyFilter(c); });
      filtersEl.appendChild(btn);
    });

    var applyFilter = function (c) {
      current = c;
      $$(".chip", filtersEl).forEach(function (b) { b.setAttribute("aria-pressed", b.firstChild.textContent === c); });
      var shown = 0;
      TILES.forEach(function (t) {
        var ok = c === "All" || PROJECTS[t.p].cat === c;
        t.el.classList.toggle("hide", !ok);
        if (ok) { shown++; t.el.classList.remove("pop"); void t.el.offsetWidth; t.el.style.animationDelay = (shown * 0.05) + "s"; t.el.classList.add("pop"); }
      });
      countEl.textContent = shown + (shown === 1 ? " image" : " images");
    };
    applyFilter("All");

    /* Lightbox */
    var lb = $("#lb"), lbImg = $("#lbImg"), idx = 0, list = [];
    var visible = function () { return TILES.filter(function (t) { return !t.el.classList.contains("hide"); }); };
    var fill = function (t) {
      var P = PROJECTS[t.p];
      $("#lbKind").textContent = P.cat + " · " + t.kind;
      $("#lbTitle").textContent = t.title;
      $("#lbLoc").textContent = t.kind === "Detail" ? P.t + " — " + P.loc : P.loc;
      $("#lbNote").textContent = P.note;
      $("#lbYear").textContent = P.y; $("#lbSize").textContent = P.size; $("#lbDur").textContent = P.dur; $("#lbScope").textContent = P.scope;
      $("#lbCnt").textContent = (idx + 1) + " / " + list.length;
    };
    var show = function (swap) {
      var t = list[idx];
      if (swap) lbImg.classList.add("sw");
      var im = new Image();
      im.onload = im.onerror = function () {
        lbImg.src = t.src; lbImg.alt = t.title + " — " + PROJECTS[t.p].t;
        fill(t);
        requestAnimationFrame(function () { lbImg.classList.remove("sw"); });
        [1, -1].forEach(function (d) { var n = list[(idx + d + list.length) % list.length]; if (n) (new Image()).src = n.src; });
      };
      setTimeout(function () { im.src = t.src; }, swap ? 180 : 0);
    };
    var lastFocus = null;
    var openLB = function (id) {
      list = visible();
      var i = list.findIndex(function (t) { return t.id === id; });
      if (i < 0) { applyFilter("All"); list = visible(); i = list.findIndex(function (t) { return t.id === id; }); }
      idx = Math.max(0, i);
      lastFocus = document.activeElement;
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      show(false);
      $(".lb-close", lb).focus();
    };
    var closeLB = function () {
      lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    var step = function (d) { idx = (idx + d + list.length) % list.length; show(true); };
    $$(".lb-close", lb).forEach(function (b) { b.addEventListener("click", closeLB); });
    $(".lb-prev", lb).addEventListener("click", function () { step(-1); });
    $(".lb-next", lb).addEventListener("click", function () { step(1); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        var f = $$("button", lb); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    lb.addEventListener("click", function (e) { if (e.target.classList.contains("lb-stage")) closeLB(); });
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });

    /* Spotlight buttons open the lightbox straight onto a project */
    $$("[data-open]").forEach(function (el) {
      el.addEventListener("click", function () { applyFilter("All"); openLB(el.dataset.open); });
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } });
    });

    /* Deep link: projects.html#heritage etc. */
    var h = decodeURIComponent(location.hash.replace("#", "")).toLowerCase();
    CATS.forEach(function (c) { if (c.toLowerCase() === h && c !== "All") applyFilter(c); });
  }

  /* ---------------- Enquiry form ---------------- */
  $$(".form-wrap").forEach(function (wrap) {
    var form = $("form", wrap);
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$(".fld", form).forEach(function (f) {
        var i = $("input,textarea,select", f); if (!i || !i.required) return;
        var v = i.value.trim(), bad = !v;
        if (!bad && i.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        f.classList.toggle("bad", bad); if (bad) ok = false;
      });
      if (!ok) { var first = $(".fld.bad input,.fld.bad textarea", form); if (first) first.focus(); return; }

      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      var done = function () { wrap.classList.add("sent"); $("h3", wrap).focus && $("h3", wrap).setAttribute("tabindex", "-1"); $("h3", wrap).focus(); };

      if (CONFIG.ENDPOINT) {
        var btn = $("button[type=submit]", form); btn.disabled = true;
        fetch(CONFIG.ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw 0; done(); })
          .catch(function () { btn.disabled = false; alert("Sorry — something went wrong. Please email us directly at " + CONFIG.EMAIL); });
      } else {
        var body = "Name: " + data.name + "\nPhone: " + (data.phone || "-") + "\nProject: " + data.type + "\nBudget: " + data.budget + "\n\n" + data.message;
        window.location.href = "mailto:" + CONFIG.EMAIL + "?subject=" + encodeURIComponent("Project enquiry — " + data.name) + "&body=" + encodeURIComponent(body);
        done();
      }
    });
    $$("input,textarea", form).forEach(function (i) { i.addEventListener("input", function () { i.closest(".fld").classList.remove("bad"); }); });
  });

  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
})();
