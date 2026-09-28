/*
 * Wobblebrain — demo web.
 * Porting del capitolo 1 ("The Forest of Balance", livelli 1–5) dall'app Android:
 * MainGameScreen/TopGameBar (MainActivity.kt), CartoonScaleView, WeightBlockView, MascotView,
 * InventoryDock, LevelCompleteBanner, ConfettiCanvas, AmbientBackgroundMotion, CartoonSoundSynth,
 * logica di GameViewModel e livelli da LevelsRepository. Misure in dp = px CSS (telefono logico 425dp).
 * Nella demo l'energia non viene consumata e i progressi restano solo nel browser.
 */
(function () {
  var root = document.getElementById("demo-wobblebrain");
  if (!root) return;

  var PW = 425, PH = 880, DENS = 2.75;
  var OUT = "#1E100B";
  var GROUP = "https://groups.google.com/g/wobblebrain_closedtest";

  // ---- Colori (ui/theme/Color.kt, WeightBlockView.getBlockColorSpec "classic") ----
  var BLOCK = {
    1: ["#80E5FF", "#00C7FD", "#0077B6"], 2: ["#FFF066", "#FFD000", "#FF8800"],
    3: ["#69F0AE", "#00E676", "#008938"], 4: ["#FFB347", "#FF7A00", "#D00000"],
    5: ["#FF7597", "#FF2A6D", "#9E0038"], 6: ["#E056FD", "#B5179E", "#560BAD"],
    7: ["#70A6FF", "#3A86FF", "#023E8A"], 8: ["#FF5376", "#FF0055", "#880026"],
    9: ["#FFD54F", "#FFB703", "#FB5607"]
  };
  var PAL = { top: "#93C5FD", mid: "#FDE047", bottom: "#FFEDD5", accent: "#F59E0B" };

  // ---- Livelli 1–5 (data/LevelsRepository.kt) ----
  function B(id, v, fixed) { return { id: id, value: v, fixed: !!fixed }; }
  var LEVELS = [
    { id: 1, title: "Level 1: Even Steven", optimal: 1,
      tip: ["Ciao! Sono Wobbly! Trascina o tocca il blocco 4 sul piatto destro per bilanciare la bilancia!",
            "Hi there! I'm Wobbly! Drag or tap the 4 block onto the right tray to balance the scale!"],
      scales: [{ id: "scale_1_1", title: "Wooden Scale", op: "ADD", goal: "EQUAL", target: 4, lc: 1, rc: 1,
                 left: [B("l1_fixed_4", 4, 1)], right: [] }],
      inv: [B("inv_1_4", 4), B("inv_1_2", 2), B("inv_1_1", 1)] },
    { id: 2, title: "Level 2: Squash & Sum", optimal: 2,
      tip: ["Il piatto sinistro ha 6! Riesci a trovare due blocchi che sommati diano 6 per il piatto destro?",
            "The left side has 6! Can you find two blocks that add up to 6 for the right side?"],
      scales: [{ id: "scale_2_1", title: "Double Tray", op: "ADD", goal: "EQUAL", target: 6, lc: 1, rc: 2,
                 left: [B("l2_fixed_6", 6, 1)], right: [] }],
      inv: [B("inv_2_2", 2), B("inv_2_4", 4), B("inv_2_3", 3), B("inv_2_5", 5)] },
    { id: 3, title: "Level 3: Wobble Difference", optimal: 1,
      tip: ["Guarda attentamente l'obiettivo! Sinistra ha 7 e vogliamo Sinistra - Destra = 3. Quale numero va a destra?",
            "Look closely at the goal! Left is 7, and we want Left - Right = 3. What number should go on the right?"],
      scales: [{ id: "scale_3_1", title: "Tilt-O-Matic", op: "SUBTRACT", goal: "TARGET_DIFF", diff: 3, lc: 1, rc: 1,
                 left: [B("l3_fixed_7", 7, 1)], right: [] }],
      inv: [B("inv_3_1", 1), B("inv_3_4", 4), B("inv_3_5", 5), B("inv_3_2", 2)] },
    { id: 4, title: "Level 4: Double Teeter", optimal: 2,
      tip: ["Entrambi i piatti hanno bisogno di aiuto! Posiziona un blocco a sinistra e uno a destra in modo che le somme coincidano.",
            "Both sides need help! Place a block on the left and a block on the right so their sums match."],
      scales: [{ id: "scale_4_1", title: "Master Balance", op: "ADD", goal: "EQUAL", target: null, lc: 2, rc: 2,
                 left: [B("l4_fixed_3", 3, 1)], right: [B("l4_fixed_2", 2, 1)] }],
      inv: [B("inv_4_5", 5), B("inv_4_6", 6), B("inv_4_1", 1), B("inv_4_4", 4)] },
    { id: 5, title: "Level 5: The Chained Gate", optimal: 2,
      tip: ["Un enigma a catena! Bilanciare la prima bilancia sblocca la seconda e dona un Blocco Dorato!",
            "A chained puzzle! Balancing the first scale unlocks the second scale and rewards a Golden Block!"],
      scales: [{ id: "scale_5_1", title: "Gate Scale #1", op: "ADD", goal: "EQUAL", target: 5, lc: 1, rc: 1,
                 left: [B("l5_fixed_5", 5, 1)], right: [], reward: [B("reward_gold_8", 8)] },
               { id: "scale_5_2", title: "Vault Scale #2", op: "ADD", goal: "EQUAL", target: 8, lc: 1, rc: 1,
                 left: [B("l5_fixed_8", 8, 1)], right: [], lockedBy: "scale_5_1" }],
      inv: [B("inv_5_5", 5), B("inv_5_3", 3), B("inv_5_4", 4)] }
  ];

  var lang = function () { return document.body.dataset.lang === "it" ? "it" : "en"; };
  function t(it, en) { return lang() === "it" ? it : en; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  // ---- Icone Material ----
  var IC = {
    grid: "M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z",
    undo: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
    bulb: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
    gear: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    volOn: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
    volOff: "M7 9v6h4l5 5V4l-5 5H7z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    refresh: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
    play: "M8 5v14l11-7z"
  };
  function svg(name, size, color) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="' + color + '" d="' + IC[name] + '"/></svg>';
  }

  // ======================================================================
  // Suoni: CartoonSoundSynth (PCM 44.1 kHz, stesse formule dell'app)
  // ======================================================================
  var SR = 44100, actx = null, bufs = {}, soundOn = get("wb_sound") !== "0";
  function gen(dur, fn) {
    var n = Math.floor(SR * dur), b = actx.createBuffer(1, n, SR), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) { var tt = i / SR; d[i] = Math.max(-1, Math.min(1, fn(tt, tt / dur))); }
    return b;
  }
  function arp(notes, stagger, decay, gain, harm) {
    return function (tt) {
      var s = 0;
      for (var k = 0; k < notes.length; k++) {
        var st = k * stagger; if (tt < st) continue;
        var nt = tt - st, f = notes[k], env = Math.exp(-nt * decay);
        var v = Math.sin(2 * Math.PI * f * nt);
        if (harm) v += Math.sin(2 * Math.PI * f * 2 * nt) * harm[0] + Math.sin(2 * Math.PI * f * 3 * nt) * harm[1];
        s += v * env * gain;
      }
      return s;
    };
  }
  var PI2 = 2 * Math.PI;
  var SOUNDS = {
    pop: [0.08, function (tt, p) { return Math.sin(PI2 * (220 + p * 430) * tt) * (1 - p) * 0.7; }],
    plop: [0.12, function (tt, p) { return Math.sin(PI2 * (550 - p * 370) * tt) * Math.exp(-p * 4) * 0.8; }],
    wobble: [0.22, function (tt, p) { return Math.sin(PI2 * (280 + 40 * Math.sin(PI2 * 18 * tt)) * tt) * Math.exp(-p * 3.5) * 0.6; }],
    balanced: [0.4, function (tt, p) { return (Math.sin(PI2 * 659.25 * tt) + Math.sin(PI2 * 987.77 * tt) * 0.6) * 0.45 * Math.exp(-p * 4); }],
    fanfare: [1.3, arp([523.25, 659.25, 783.99, 1046.5, 1174.66, 1318.51, 1567.98], 0.11, 2.8, 0.22, [0.35, 0.15])],
    click: [0.03, function (tt) { return Math.sin(PI2 * 800 * tt) * (1 - tt / 0.03) * 0.4; }],
    oops: [0.28, function (tt, p) { var f = 440 - p * 310 + 32 * Math.sin(PI2 * 36 * tt); return (Math.sin(PI2 * f * tt) + Math.sin(PI2 * f * 2 * tt) * 0.38) * Math.exp(-p * 3.4) * 0.75; }],
    undo: [0.1, function (tt, p) { return Math.sin(PI2 * (520 - p * 260) * tt) * Math.sin(Math.PI * p) * 0.65; }]
  };
  function unlockAudio() {
    if (actx) { if (actx.state === "suspended") actx.resume(); return; }
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
  }
  function play(name) {
    if (!soundOn || !actx) return;
    try {
      if (!bufs[name]) bufs[name] = gen(SOUNDS[name][0], SOUNDS[name][1]);
      var s = actx.createBufferSource(); s.buffer = bufs[name];
      var g = actx.createGain(); g.gain.value = 0.55;
      s.connect(g); g.connect(actx.destination); s.start();
    } catch (e) {}
  }

  // ======================================================================
  // DOM
  // ======================================================================
  root.innerHTML =
    '<div class="wb-scaler"><div class="wb-phone">' +
      '<canvas class="wb-amb"></canvas>' +
      '<div class="wb-col">' +
        '<div class="wb-top"></div>' +
        '<div class="wb-scroll"><div class="wb-arena"></div></div>' +
        '<div class="wb-bottom"></div>' +
      '</div>' +
      '<div class="wb-xp" hidden></div>' +
      '<canvas class="wb-conf"></canvas>' +
      '<div class="wb-toast"></div>' +
      '<div class="wb-drag" hidden></div>' +
      '<div class="wb-end" hidden></div>' +
    '</div></div>';

  var $ = function (s) { return root.querySelector(s); };
  var scaler = $(".wb-scaler"), phone = $(".wb-phone");
  var topEl = $(".wb-top"), scrollEl = $(".wb-scroll"), arenaEl = $(".wb-arena"), bottomEl = $(".wb-bottom");
  var ambC = $(".wb-amb"), confC = $(".wb-conf"), xpEl = $(".wb-xp"), toastEl = $(".wb-toast"), dragEl = $(".wb-drag"), endEl = $(".wb-end");
  var DPR = Math.min(3, window.devicePixelRatio || 1);
  var scaleF = 1;

  function fit() {
    var host = root.parentElement || root;
    var w = Math.min(PW, host.clientWidth || PW);
    scaleF = w / PW;
    phone.style.transform = "scale(" + scaleF + ")";
    scaler.style.width = w + "px";
    scaler.style.height = (PH * scaleF) + "px";
  }
  window.addEventListener("resize", fit); fit();

  function sizeCanvas(c, w, h) { c.width = Math.round(w * DPR); c.height = Math.round(h * DPR); c.style.width = w + "px"; c.style.height = h + "px"; }
  sizeCanvas(ambC, PW, PH); sizeCanvas(confC, PW, PH);

  // ======================================================================
  // Blocchi (WeightBlockView)
  // ======================================================================
  function blockHTML(b, S, o) {
    o = o || {};
    var c = BLOCK[((b.value - 1) % 9) + 1];
    var w = S * 0.92, sel = !!o.sel;
    var shW = S * (sel ? 0.85 : 0.94), shH = S * (sel ? 0.22 : 0.26);
    var shTop = (sel ? S * 0.22 : 5) + S - shH * 0.8;
    var gid = "g" + Math.random().toString(36).slice(2, 8);
    var gloss = "M7 5 Q" + (w / 2) + " 4 " + (w - 8) + " 7 Q" + (w - 12) + " 13 " + (w / 2) + " 10 Q10 11 7 5Z";
    var rivets = "";
    if (b.fixed) {
      [[5.5, 5.5], [w - 5.5, 5.5], [5.5, w - 5.5], [w - 5.5, w - 5.5]].forEach(function (p) {
        rivets += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.45" fill="' + OUT + '"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="url(#' + gid + 'r)"/>';
      });
    }
    var fs = S * 0.42, padH = Math.max(3.5, Math.min(8, S * 0.12));
    return '<div class="wb-blk' + (sel ? " sel" : "") + (o.cls ? " " + o.cls : "") + '" style="width:' + S + 'px;height:' + S + 'px"' +
      (o.attrs || "") + '>' +
      '<div class="wb-sq"><div class="wb-wg">' +
        '<div class="wb-bsh" style="left:' + ((S - shW) / 2) + 'px;top:' + shTop + 'px;width:' + shW + 'px;height:' + shH + 'px;background:radial-gradient(circle ' + (shW / 2) + 'px at 50% 50%,rgba(0,0,0,.33),rgba(0,0,0,.13) ' + (shW / 4) + 'px,transparent ' + (shW / 2) + 'px)"></div>' +
        '<div class="wb-bb" style="width:' + w + 'px;height:' + w + 'px;left:' + (S * 0.04) + 'px;top:' + (S * 0.04) + 'px;background:linear-gradient(' + c[0] + ',' + c[1] + ',' + c[2] + ');box-shadow:0 ' + (sel ? 8 : 3) + 'px ' + (sel ? 14 : 5) + 'px ' + (sel ? "rgba(0,0,0,.35)" : "rgba(0,0,0,.28)") + '">' +
          '<svg class="wb-bsv" width="' + w + '" height="' + w + '" viewBox="0 0 ' + w + ' ' + w + '"><defs>' +
            '<linearGradient id="' + gid + 'g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + w + '"><stop offset="0" stop-color="#fff" stop-opacity=".87"/><stop offset="1" stop-color="#fff" stop-opacity=".27"/></linearGradient>' +
            '<linearGradient id="' + gid + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".27"/></linearGradient>' +
            '<radialGradient id="' + gid + 'r" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#CBD5E1"/><stop offset="1" stop-color="#64748B"/></radialGradient>' +
          '</defs><path d="' + gloss + '" fill="url(#' + gid + 'g)"/><circle cx="10" cy="14" r="3" fill="#fff" fill-opacity=".67"/>' +
          '<rect x="0" y="' + (w - 8) + '" width="' + w + '" height="8" rx="8" fill="url(#' + gid + 'b)"/>' + rivets + '</svg>' +
          '<div class="wb-bc"><div class="wb-eyes"><i><b style="width:' + (sel ? 4.5 : 3.8) + 'px;height:' + (sel ? 4.5 : 3.8) + 'px"></b></i><i><b style="width:' + (sel ? 4.5 : 3.8) + 'px;height:' + (sel ? 4.5 : 3.8) + 'px"></b></i></div>' +
          '<div class="wb-num" style="font-size:' + fs + 'px;line-height:' + fs + 'px;padding:1px ' + padH + 'px;color:' + c[2] + ';min-width:' + (fs + 4) + 'px">' + b.value + '</div></div>' +
        '</div>' +
      '</div></div></div>';
  }

  // ======================================================================
  // Stato di gioco (GameViewModel)
  // ======================================================================
  var levelIdx = Math.max(0, Math.min(4, Number(get("wb_level")) || 0));
  var S = null, undoStack = [], penalty = false, bestStars = {};
  var drag = null;          // { block, x, y, hovered }
  var ui = { scales: {}, tipKey: "", focus: null, newly: {}, idleAt: 0 };

  function initLevel(i) {
    var L = LEVELS[i];
    var placed = [], unlocked = {};
    L.scales.forEach(function (sc) {
      if (!sc.lockedBy) unlocked[sc.id] = true;
      sc.left.forEach(function (b, k) { placed.push({ block: b, scaleId: sc.id, left: true, slot: k }); });
      sc.right.forEach(function (b, k) { placed.push({ block: b, scaleId: sc.id, left: false, slot: k }); });
    });
    undoStack = []; penalty = false;
    S = { L: L, inv: L.inv.slice(), placed: placed, unlocked: unlocked, balanced: {}, moves: 0, complete: false,
          sel: null, worried: false, over: null };
  }
  function scaleById(id) { for (var i = 0; i < S.L.scales.length; i++) if (S.L.scales[i].id === id) return S.L.scales[i]; return null; }
  function sideBlocks(placed, id, left) { return placed.filter(function (p) { return p.scaleId === id && p.left === left; }); }
  function sum(arr) { return arr.reduce(function (a, p) { return a + p.block.value; }, 0); }
  function isBalanced(sc, placed) {
    var l = sideBlocks(placed, sc.id, true), r = sideBlocks(placed, sc.id, false);
    if (!l.length && !r.length) return false;
    var ls = sum(l), rs = sum(r);
    if (sc.op === "SUBTRACT" || sc.goal === "TARGET_DIFF") return (ls - rs) === sc.diff;
    if (sc.target != null) return ls === sc.target && rs === sc.target;
    return ls > 0 && ls === rs;
  }
  function effectiveTarget(sc, left, placed) {
    if (sc.goal === "EQUAL" && sc.target != null) return sc.target;
    if (sc.op !== "ADD") return null;
    var other = sideBlocks(placed, sc.id, !left), cap = left ? sc.rc : sc.lc;
    var fixed = other.filter(function (p) { return p.block.fixed; });
    if (fixed.length && other.length >= cap && fixed.length === other.length) return sum(fixed);
    return null;
  }

  function selectBlock(id) {
    if (S.complete) return;
    if (S.sel === id) S.sel = null; else { play("pop"); S.sel = id; }
    render();
  }
  function onSlotClicked(scId, left, pref) {
    if (S.complete || penalty || !S.sel) return;
    var block = S.inv.filter(function (b) { return b.id === S.sel; })[0]; if (!block) return;
    var sc = scaleById(scId), cap = left ? sc.lc : sc.rc;
    var occ = sideBlocks(S.placed, scId, left).map(function (p) { return p.slot; });
    var slot = (pref >= 0 && pref < cap && occ.indexOf(pref) < 0) ? pref : -1;
    if (slot < 0) for (var k = 0; k < cap; k++) if (occ.indexOf(k) < 0) { slot = k; break; }
    if (slot < 0) return;
    placeBlock(block, scId, left, slot);
  }
  function placeBlock(block, scId, left, slot) {
    if (S.complete || !S.unlocked[scId] || penalty) return;
    var sc = scaleById(scId);
    var existing = S.placed.filter(function (p) { return p.scaleId === scId && p.left === left && p.slot === slot; })[0];
    if (existing && existing.block.fixed) return;
    var np = { block: block, scaleId: scId, left: left, slot: slot };
    var filtered = S.placed.filter(function (p) {
      return !((p.scaleId === scId && p.left === left && p.slot === slot) || p.block.id === block.id);
    }).concat([np]);

    var isAdd = sc.op === "ADD" && sc.goal === "EQUAL";
    if (isAdd) {
      var ns = sum(sideBlocks(filtered, scId, left)), tv = effectiveTarget(sc, left, S.placed);
      if (tv != null && ns > tv) return mistake(block, scId, left, existing, filtered);
    } else {
      var lc = sideBlocks(filtered, scId, true).length, rc = sideBlocks(filtered, scId, false).length;
      if (Math.max(0, sc.lc - lc) === 0 && Math.max(0, sc.rc - rc) === 0 && !isBalanced(sc, filtered))
        return mistake(block, scId, left, existing, filtered);
    }
    var inv = S.inv.filter(function (b) { return b.id !== block.id; });
    if (existing && !existing.block.fixed && existing.block.id !== block.id) inv.push(existing.block);
    undoStack.push({ placed: S.placed, inv: S.inv, moves: S.moves });
    vibrate(18); play("plop"); play("wobble");
    S.placed = filtered; S.inv = inv; S.sel = null; S.moves++;
    evaluate();
  }
  function mistake(block, scId, left, displaced, temp) {
    if (penalty) return;
    penalty = true;
    vibrate([30, 50, 40]); play("oops");
    S.placed = temp; S.inv = S.inv.filter(function (b) { return b.id !== block.id; });
    S.sel = null; S.worried = true; S.over = { id: scId, left: left };
    render();
    setTimeout(function () {
      S.placed = S.placed.filter(function (p) { return p.block.id !== block.id; });
      if (displaced && !displaced.block.fixed) S.placed.push(displaced);
      var inv = S.inv.filter(function (b) { return !displaced || b.id !== displaced.block.id; });
      if (!inv.some(function (b) { return b.id === block.id; })) inv.push(block);
      S.inv = inv; S.worried = false; S.over = null;
      play("pop"); penalty = false;
      render();
    }, 750);
  }
  function removePlaced(p) {
    if (S.complete || p.block.fixed || penalty) return;
    undoStack.push({ placed: S.placed, inv: S.inv, moves: S.moves });
    S.placed = S.placed.filter(function (q) { return !(q.scaleId === p.scaleId && q.left === p.left && q.slot === p.slot); });
    S.inv = S.inv.concat([p.block]); S.moves++;
    play("pop"); play("wobble");
    evaluate();
  }
  function undo() {
    if (!undoStack.length || S.complete) return;
    var snap = undoStack.pop();
    play("undo");
    S.placed = snap.placed; S.inv = snap.inv; S.moves = snap.moves; S.sel = null; S.worried = false; S.over = null;
    evaluate();
  }
  function evaluate() {
    var now = {}, inv = S.inv.slice(), unlocked = {};
    Object.keys(S.unlocked).forEach(function (k) { unlocked[k] = true; });
    S.L.scales.forEach(function (sc) {
      if (isBalanced(sc, S.placed)) {
        now[sc.id] = true;
        if (!S.balanced[sc.id] && sc.reward) sc.reward.forEach(function (rw) {
          if (!inv.some(function (b) { return b.id === rw.id; }) && !S.placed.some(function (p) { return p.block.id === rw.id; })) inv.push(rw);
        });
      }
    });
    var prop = true;
    while (prop) {
      prop = false;
      S.L.scales.forEach(function (o) {
        if (o.lockedBy && now[o.lockedBy] && !unlocked[o.id]) { unlocked[o.id] = true; prop = true; onUnlocked(o.id); }
      });
    }
    var newly = Object.keys(now).filter(function (k) { return !S.balanced[k]; });
    var all = S.L.scales.every(function (sc) { return now[sc.id]; });
    S.balanced = now; S.unlocked = unlocked; S.inv = inv;
    if (all && !S.complete) {
      S.complete = true; S.sel = null;
      vibrate(45);
      var stars = S.moves <= S.L.optimal ? 3 : S.moves <= S.L.optimal + 2 ? 2 : 1;
      bestStars[S.L.id] = Math.max(bestStars[S.L.id] || 0, stars);
      floatXp(35 + stars * 5);
      if (levelIdx < LEVELS.length - 1) {
        play("balanced");
        put("wb_level", String(levelIdx + 1));
      } else {
        setTimeout(function () { play("fanfare"); confetti(); }, 450);
      }
    } else if (newly.length) {
      vibrate(45); play("balanced");
    }
    render();
  }
  function onUnlocked(id) {
    var at = performance.now();
    ui.newly[id] = at;
    setTimeout(function () {
      ui.focus = id; render();
      var card = ui.scales[id] && ui.scales[id].card;
      if (card) smoothScroll(Math.max(0, card.offsetTop - 120), 750);
      setTimeout(function () { if (ui.focus === id) { ui.focus = null; render(); } }, 2200);
    }, 550);
    setTimeout(render, 2950);
  }
  function smoothScroll(to, dur) {
    var from = scrollEl.scrollTop, t0 = performance.now();
    (function step(n) {
      var p = Math.min(1, (n - t0) / dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      scrollEl.scrollTop = from + (to - from) * e;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  function resetLevel() { play("pop"); startLevel(levelIdx); }
  function nextLevel() {
    if (levelIdx < LEVELS.length - 1) startLevel(levelIdx + 1);
    else showEnd();
  }
  function startLevel(i) {
    levelIdx = i; put("wb_level", String(i));
    initLevel(i); buildLevel(); render();
    scrollEl.scrollTop = 0;
  }

  // ======================================================================
  // Costruzione della schermata (MainGameScreen)
  // ======================================================================
  function buildTop() {
    topEl.innerHTML =
      '<div class="wb-tl">' +
        '<button class="wb-lvl" data-a="levels">' + svg("grid", 16, OUT) + '<span></span></button>' +
        '<button class="wb-en" data-a="energy"><span class="wb-en-i">⚡</span><span class="wb-en-n">10</span><span class="wb-en-m">/10</span></button>' +
      '</div>' +
      '<div class="wb-tr">' +
        '<div class="wb-moves"></div>' +
        '<button class="wb-cb wb-undo" data-a="undo" aria-label="Undo"></button>' +
        '<button class="wb-cb" data-a="hint" aria-label="Hint">' + svg("bulb", 20, OUT) + '</button>' +
        '<button class="wb-cb" data-a="settings" aria-label="Settings">' + svg("gear", 20, OUT) + '</button>' +
        '<button class="wb-cb wb-snd" data-a="sound" aria-label="Sound"></button>' +
      '</div>';
  }

  function geom(sc) {
    var arenaW = PW - 28 - 16;
    var avail = Math.max(80, arenaW / 2 - 18);
    function slot(cap) { return cap === 1 ? Math.min(62, avail - 30) : cap === 2 ? Math.min(54, (avail - 38) / 2) : Math.min(46, (avail - 26 - 6 * (cap - 1)) / cap); }
    var ls = slot(sc.lc), rs = slot(sc.rc);
    var lw = ls * sc.lc + (sc.lc > 1 ? 8 * (sc.lc - 1) : 0) + 32, rw = rs * sc.rc + (sc.rc > 1 ? 8 * (sc.rc - 1) : 0) + 32;
    var lh = Math.max(116, Math.min(136, ls * 1.55 + 42)), rh = Math.max(116, Math.min(136, rs * 1.55 + 42));
    var half = Math.min(18 + Math.max(lw, rw) / 2, arenaW / 2 - 10);
    return { W: arenaW, cx: arenaW / 2, ls: ls, rs: rs, lw: lw, rw: rw, lh: lh, rh: rh, half: half,
             beamW: half * 2 + 26, pivotY: 34, trayTop: 82, H: 82 + Math.max(lh, rh) + 34 + 20 };
  }

  function buildLevel() {
    ui.scales = {}; ui.focus = null; ui.newly = {}; ui.tipKey = ""; ui.idleAt = performance.now();
    var h = '<div class="wb-mrow"><canvas class="wb-mascot"></canvas>' +
              '<div class="wb-bub"><svg class="wb-tail" width="8" height="16" viewBox="0 0 8 16"><path d="M8 2 L0 8 L8 14Z" fill="#fff" stroke="' + OUT + '" stroke-width="3" stroke-linejoin="round"/></svg>' +
              '<div class="wb-bubb"><div class="wb-blab"></div><div class="wb-btxt"></div></div></div></div>' +
            '<div class="wb-stuck" hidden><button data-a="hint">' + svg("bulb", 16, "#D97706") + '<span></span></button></div>';
    S.L.scales.forEach(function (sc, i) {
      var g = geom(sc);
      h += '<div class="wb-card" data-s="' + sc.id + '"' + (i < S.L.scales.length - 1 ? ' style="margin-bottom:18px"' : '') + '>' +
             '<div class="wb-hd"><div class="wb-hl"><div class="wb-ht"><span class="wb-stitle">' + esc(sc.title) + '</span>' +
               '<span class="wb-op ' + (sc.op === "SUBTRACT" ? "sub" : "add") + '">' + (sc.op === "SUBTRACT" ? "−" : "+") + '</span>' +
               '<span class="wb-unl" hidden>' + svg("star", 11, "#fff") + '<span></span></span></div>' +
               '<div class="wb-goal"></div></div><div class="wb-vs"></div></div>' +
             '<div class="wb-ar" style="height:' + g.H + 'px">' +
               '<canvas class="wb-arc"></canvas>' +
               trayShell(true, g) + trayShell(false, g) +
               '<div class="wb-lock" hidden><div>' + svg("lock", 20, OUT) + '<span>Solve previous scale to unlock</span></div></div>' +
             '</div></div>';
    });
    arenaEl.innerHTML = h;
    S.L.scales.forEach(function (sc) {
      var card = arenaEl.querySelector('.wb-card[data-s="' + sc.id + '"]');
      var g = geom(sc), cv = card.querySelector(".wb-arc");
      sizeCanvas(cv, g.W, g.H);
      ui.scales[sc.id] = { card: card, canvas: cv, g: g,
        beam: { x: 0, v: 0 }, face: { tilt: { x: 0, v: 0 }, off: { x: 0, v: 0 }, bl: -16, br: 2, bo: -2.5, px: 0, py: 0, sw: 0 },
        idleAt: performance.now(), sig: "" };
    });
    ui.mascot = arenaEl.querySelector(".wb-mascot");
    sizeCanvas(ui.mascot, 76, 96);
    ui.shudder = null;
  }
  function trayShell(left, g) {
    var w = left ? g.lw : g.rw, h = left ? g.lh : g.rh;
    var x = (left ? g.cx - g.half : g.cx + g.half) - w / 2;
    return '<div class="wb-tray" data-left="' + (left ? 1 : 0) + '" style="left:' + x + 'px;top:' + g.trayTop + 'px;width:' + w + 'px">' +
             '<div class="wb-sack" style="height:' + h + 'px"><svg class="wb-sackl" width="' + w + '" height="' + h + '">' +
               '<line x1="6" y1="4" x2="' + (w - 6) + '" y2="4" stroke="rgba(30,16,11,.13)" stroke-width="2"/>' +
               '<line x1="10" y1="2" x2="' + (w - 10) + '" y2="2" stroke="rgba(255,255,255,.93)" stroke-width="1.8"/>' +
               '<line x1="' + (w * .25) + '" y1="16" x2="' + (w * .25) + '" y2="' + (h - 14) + '" stroke="rgba(0,0,0,.07)" stroke-width="1.6"/>' +
               '<line x1="' + (w * .75) + '" y1="16" x2="' + (w * .75) + '" y2="' + (h - 14) + '" stroke="rgba(0,0,0,.07)" stroke-width="1.6"/></svg>' +
               '<div class="wb-slots"></div></div>' +
             '<div class="wb-sum"></div></div>';
  }

  // ---- Aggiornamento ----
  function goalText(sc) {
    if (sc.goal === "EQUAL") return sc.target != null ? t("Obiettivo: Entrambi i piatti devono essere ", "Goal: Both trays must equal ") + sc.target : t("Obiettivo: Sinistra = Destra", "Goal: Left = Right");
    return t("Obiettivo: Sinistra - Destra = ", "Goal: Left - Right = ") + sc.diff;
  }
  function highlight(txt) {
    return esc(txt).replace(/(\b\d+\b|[=+\-−÷])/g, '<em>$1</em>');
  }
  function slotHTML(sc, left, k, size, locked) {
    var p = S.placed.filter(function (q) { return q.scaleId === sc.id && q.left === left && q.slot === k; })[0];
    if (p) {
      var click = !p.block.fixed && !locked;
      return blockHTML(p.block, size, { cls: click ? "wb-tap" : "", attrs: click ? ' data-a="remove" data-s="' + sc.id + '" data-l="' + (left ? 1 : 0) + '" data-k="' + k + '"' : "" });
    }
    var hl = S.sel != null && !locked;
    var hov = drag && drag.hovered && drag.hovered.id === sc.id && drag.hovered.left === left && drag.hovered.slot === k;
    var sw = hov ? 3.2 : hl ? 2.4 : 1.8;
    var dash = hov ? "" : '<svg class="wb-dash" width="' + size + '" height="' + size + '"><rect x="' + (sw / 2) + '" y="' + (sw / 2) + '" width="' + (size - sw) + '" height="' + (size - sw) + '" rx="12" fill="none" stroke="' + (hl ? "#E85D04" : "rgba(30,16,11,.4)") + '" stroke-width="' + sw + '" stroke-dasharray="3.6 2.2"/></svg>';
    return '<div class="wb-slot' + (hov ? " hov" : hl ? " hl" : "") + '" style="width:' + size + 'px;height:' + size + 'px;font-size:' + (size * (hov ? .5 : .44)) + 'px"' +
      (locked ? "" : ' data-a="slot" data-s="' + sc.id + '" data-l="' + (left ? 1 : 0) + '" data-k="' + k + '"') + '>' + dash + '<span>' + (hov ? "▼" : "+") + '</span></div>';
  }

  function render() {
    var L = S.L, now = performance.now();
    // Barra superiore
    topEl.querySelector(".wb-lvl span").textContent = L.title;
    topEl.querySelector(".wb-moves").textContent = t("Mosse: ", "Moves: ") + S.moves;
    var ub = topEl.querySelector(".wb-undo"), canUndo = undoStack.length > 0;
    ub.classList.toggle("off", !canUndo);
    ub.innerHTML = svg("undo", 20, canUndo ? OUT : "#94A3B8");
    topEl.querySelector(".wb-snd").innerHTML = svg(soundOn ? "volOn" : "volOff", 20, OUT);

    // Mascotte
    var tip = S.worried ? t("Ops! Quello ha superato la bilancia! Lascia che lo rimetta a posto!", "Oops! That overshot the scale! Let me return it!") : t(L.tip[0], L.tip[1]);
    var bub = arenaEl.querySelector(".wb-bub");
    bub.classList.toggle("worried", S.worried);
    arenaEl.querySelector(".wb-blab").textContent = S.worried ? t("OPS!", "OOPS!") : t("OBIETTIVO DI WOBBLY", "WOBBLY'S GOAL");
    arenaEl.querySelector(".wb-btxt").innerHTML = highlight(tip);
    if (ui.tipKey !== tip) {
      ui.tipKey = tip;
      bub.classList.remove("pulse"); void bub.offsetWidth; bub.classList.add("pulse");
    }
    if (S.worried && !ui.shudder) ui.shudder = now;
    var stuck = arenaEl.querySelector(".wb-stuck");
    stuck.hidden = !(S.moves >= 3 && !S.complete);
    stuck.querySelector("span").textContent = t("Serve un indizio?", "Need a hint?");

    // Bilance
    L.scales.forEach(function (sc) {
      var u = ui.scales[sc.id], card = u.card, g = u.g;
      var locked = !S.unlocked[sc.id], bal = !!S.balanced[sc.id];
      var ls = sum(sideBlocks(S.placed, sc.id, true)), rs = sum(sideBlocks(S.placed, sc.id, false));
      var newly = ui.newly[sc.id] && now - ui.newly[sc.id] < 2900;
      var foc = ui.focus === sc.id, glow = newly || foc;
      if (glow && !card.classList.contains("glow")) { card.classList.remove("popf"); void card.offsetWidth; card.classList.add("popf"); }
      card.classList.toggle("glow", glow);
      card.querySelector(".wb-unl").hidden = !glow;
      card.querySelector(".wb-unl span").textContent = t("SBLOCCATO!", "UNLOCKED!");
      var goal = card.querySelector(".wb-goal");
      goal.textContent = goalText(sc); goal.classList.toggle("ok", bal);
      var vs = card.querySelector(".wb-vs");
      vs.className = "wb-vs" + (locked ? " lk" : bal ? " ok" : "");
      vs.innerHTML = bal ? svg("check", 15, "#fff") + '<span>' + t("BILANCIATO!", "BALANCED!") + '</span>' : '<span>' + ls + ' vs ' + rs + '</span>';
      [true, false].forEach(function (left) {
        var tray = card.querySelector('.wb-tray[data-left="' + (left ? 1 : 0) + '"]');
        var cap = left ? sc.lc : sc.rc, size = left ? g.ls : g.rs, hs = "";
        for (var k = 0; k < cap; k++) hs += slotHTML(sc, left, k, size, locked);
        tray.querySelector(".wb-slots").innerHTML = hs;
        tray.querySelector(".wb-sum").textContent = t("Somma: ", "Sum: ") + (left ? ls : rs);
        var over = S.over && S.over.id === sc.id && S.over.left === left;
        if (over && !tray.classList.contains("over")) { tray.classList.add("over"); }
        if (!over) tray.classList.remove("over");
      });
      card.querySelector(".wb-lock").hidden = !locked;
      var sig = S.placed.filter(function (p) { return p.scaleId === sc.id; }).map(function (p) { return p.block.id + p.slot + p.left; }).join() + "|" + (S.sel || "") + "|" + bal + "|" + !!S.over;
      if (sig !== u.sig) { u.sig = sig; u.idleAt = now; }
    });

    // Parte bassa: banner di livello completato oppure inventario
    if (S.complete) {
      if (!bottomEl.querySelector(".wb-done")) {
        var stars = S.moves <= L.optimal ? 3 : S.moves <= L.optimal + 2 ? 2 : 1, st = "";
        for (var i = 1; i <= 3; i++) st += '<span class="wb-star' + (i <= stars ? " on" : "") + (i === 2 ? " big" : "") + '">' + svg("star", i === 2 ? 22 : 18, i <= stars ? "#fff" : "#94A3B8") + '</span>';
        bottomEl.innerHTML = '<div class="wb-done"><div class="wb-dh"><div class="wb-dpill"></div><div class="wb-stars">' + st + '</div></div>' +
          '<div class="wb-dr"><div class="wb-stat"><div><small class="m"></small><b>' + S.moves + '</b></div><i></i><div><small class="tg"></small><b class="g">' + L.optimal + '</b></div></div>' +
          '<button class="wb-replay" data-a="replay">' + svg("refresh", 18, OUT) + '<span></span></button>' +
          '<button class="wb-next" data-a="next"><span></span>' + svg("play", 18, OUT) + '</button></div></div>';
      }
      bottomEl.querySelector(".wb-dpill").textContent = t("LIVELLO BILANCIATO!", "LEVEL BALANCED!");
      bottomEl.querySelector("small.m").textContent = t("Mosse", "Moves");
      bottomEl.querySelector("small.tg").textContent = t("Obiettivo", "Target");
      bottomEl.querySelector(".wb-replay span").textContent = t("Rigioca", "Replay");
      bottomEl.querySelector(".wb-next span").textContent = t("Avanti", "Next");
    } else {
      var inner = '<div class="wb-handle"></div>';
      if (S.inv.length) {
        inner += '<div class="wb-inv">' + S.inv.map(function (b) {
          if (drag && drag.block.id === b.id) return '<div class="wb-ph"></div>';
          return blockHTML(b, 56, { sel: S.sel === b.id, cls: "wb-tap", attrs: ' data-a="inv" data-id="' + b.id + '"' });
        }).join("") + '</div>';
      } else {
        inner += '<div class="wb-empty">' + t("Tocca i blocchi sulla bilancia per riprenderli", "Tap placed blocks on the scale to return them") + '</div>';
      }
      bottomEl.innerHTML = '<div class="wb-dock"><div class="wb-docki">' + inner + '</div></div>';
    }
  }

  // ======================================================================
  // Disegno animato: sfondo, bilance (trave, funi, fulcro con faccia), Wobbly
  // ======================================================================
  function stepSpring(s, target, k, z, dt) {
    var c = 2 * z * Math.sqrt(k), n = 4, h = dt / n;
    for (var i = 0; i < n; i++) { var a = -k * (s.x - target) - c * s.v; s.v += a * h; s.x += s.v * h; }
  }
  function tween(cur, target, dt, ms) { return cur + (target - cur) * (1 - Math.exp(-dt * 3000 / ms)); }
  function blinkK(tms, dur, a, b, c) {
    var p = tms % dur;
    if (p < a) return 1;
    if (p < b) return 1 - (p - a) / (b - a) * 0.88;
    if (p < c) { var q = (p - b) / (c - b); return 0.12 + 0.88 * (1 - Math.pow(1 - q, 2)); }
    return 1;
  }

  function drawAmbient(ctx, time) {
    var w = PW, h = PH, f = (time / 32000) % 1, T = PI2;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, w, h);
    function orb(x, y, r, col, a0, a1) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(col, a0)); g.addColorStop(0.5, rgba(col, a1)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, T); ctx.fill();
    }
    orb(w * .2 + Math.sin(f * T) * 35, h * .22 + Math.cos(f * T) * 25, 150, PAL.top, .18, .06);
    orb(w * .8 + Math.cos(f * T * .8 + 1.2) * 40, h * .45 + Math.sin(f * T * .8 + 1.2) * 30, 175, PAL.mid, .2, .07);
    orb(w * .25 + Math.sin(f * T * 1.1 + 2.5) * 32, h * .78 + Math.cos(f * T * 1.1 + 2.5) * 22, 160, PAL.accent, .12, .05);
    orb(w * .65 + Math.cos(f * T * .9 + .7) * 28, h * .9 + Math.sin(f * T * .9 + .7) * 20, 140, PAL.bottom, .16, .05);
    var P = [[.12, .25, .08, .22, 16, "c"], [.82, .40, -.06, .18, 14, "m"], [.35, .70, .10, .25, 20, "c"], [.68, .85, -.07, .20, 12, "m"],
             [.22, .55, .05, .15, 15, "m"], [.88, .15, -.09, .24, 18, "c"], [.52, .32, .04, .16, 6, "m"]];
    P.forEach(function (p) {
      var yn = (((p[1] - f * p[3]) % 1) + 1) % 1;
      var xn = (((p[0] + Math.sin(f * T * 1.5 + p[1] * 5) * .035 + f * p[2]) % 1) + 1) % 1;
      var x = xn * w, y = yn * h, fade = Math.max(0, Math.min(1, Math.sin(yn * Math.PI)));
      var a = Math.max(.04, Math.min(.28, .28 * fade));
      if (p[5] === "c") {
        var r = p[4] * .35; ctx.fillStyle = "rgba(255,255,255," + a + ")";
        ctx.beginPath(); ctx.arc(x, y - r * .2, r, 0, T); ctx.fill();
        ctx.beginPath(); ctx.arc(x - r * .8, y + r * .1, r * .75, 0, T); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * .85, y + r * .1, r * .82, 0, T); ctx.fill();
      } else {
        var aa = Math.min(.35, a * 1.1), rr = p[4] * .5 * 1.6;
        var g = ctx.createRadialGradient(x, y, 0, x, y, rr);
        g.addColorStop(0, rgba(PAL.accent, aa)); g.addColorStop(.5, rgba(PAL.accent, aa * .3)); g.addColorStop(1, rgba(PAL.accent, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, T); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255," + Math.min(.4, aa * 1.2) + ")"; ctx.beginPath(); ctx.arc(x, y, p[4] * .5 * .45, 0, T); ctx.fill();
      }
    });
  }
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }
  function rrect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function lin(ctx, x0, y0, x1, y1, cols) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    cols.forEach(function (c, i) { g.addColorStop(i / (cols.length - 1), c); }); return g;
  }
  function rad(ctx, x, y, r, cols) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    cols.forEach(function (c, i) { g.addColorStop(i / (cols.length - 1), c); }); return g;
  }

  function moodOf(sc, u, now) {
    var ls = sum(sideBlocks(S.placed, sc.id, true)), rs = sum(sideBlocks(S.placed, sc.id, false)), diff = ls - rs;
    var bal = !!S.balanced[sc.id], placing = !!drag || S.sel != null, mist = !!(S.over && S.over.id === sc.id);
    var has = S.placed.some(function (p) { return p.scaleId === sc.id; });
    var dist;
    if (sc.goal === "EQUAL" && sc.target != null) dist = Math.max(Math.abs(ls - sc.target), Math.abs(rs - sc.target));
    else if (sc.goal === "TARGET_DIFF" || sc.op === "SUBTRACT") dist = Math.abs(diff - sc.diff);
    else dist = Math.abs(diff);
    var close = !bal && has && dist >= 1 && dist <= 2;
    var heavy = !bal && (dist >= 4 || Math.abs(diff) >= 4);
    var inten = Math.max(.2, Math.min(1, (Math.max(dist, Math.abs(diff)) - 3) / 6));
    var mood = mist ? "MISTAKE" : bal ? "SOLVED" : placing ? "PLACING" : close ? "CLOSE" : heavy ? "UNBAL" : "IDLE";
    return { mood: mood, diff: diff, inten: inten, bal: bal, locked: !S.unlocked[sc.id] };
  }

  function drawScale(sc, u, now, dt) {
    var g = u.g, ctx = u.canvas.getContext("2d"), m = moodOf(sc, u, now), f = u.face;
    var target = m.locked ? 0 : m.diff > 0 ? -Math.min(m.diff * 2.6, 12.5) : m.diff < 0 ? Math.min(-m.diff * 2.6, 12.5) : 0;
    stepSpring(u.beam, target, 210, .52, dt);
    var bounce = -2 * Math.cos(Math.PI * (now % 440) / 220);
    var ang = u.beam.x + (m.bal ? bounce : 0);

    // Stato del volto (FulcrumStandView)
    var solveW = -1.5 * Math.cos(Math.PI * (now % 440) / 220);
    var tiltT = { IDLE: 5.5, PLACING: 0, UNBAL: m.diff > 0 ? -4.5 * m.inten : m.diff < 0 ? 4.5 * m.inten : 0, CLOSE: 1.5, SOLVED: solveW, MISTAKE: -3.5 }[m.mood];
    stepSpring(f.tilt, tiltT, 280, .65, dt);
    stepSpring(f.off, { PLACING: -2.5, CLOSE: -1.8, MISTAKE: -3.2 }[m.mood] || 0, 300, .62, dt);
    f.bl = tween(f.bl, { IDLE: -16, PLACING: -8, UNBAL: 16 + 16 * m.inten, CLOSE: -10, SOLVED: -12, MISTAKE: -24 }[m.mood], dt, 190);
    f.br = tween(f.br, { IDLE: 2, PLACING: 8, UNBAL: -16 - 16 * m.inten, CLOSE: 10, SOLVED: 12, MISTAKE: 24 }[m.mood], dt, 190);
    f.bo = tween(f.bo, { IDLE: -2.5, PLACING: -3.5, UNBAL: .8 + .5 * m.inten, CLOSE: -3, SOLVED: -3.5, MISTAKE: -4.5 }[m.mood], dt, 190);
    var pxT = m.mood === "PLACING" ? 0 : m.diff > 0 ? -2.2 : m.diff < 0 ? 2.2 : m.mood === "IDLE" ? .8 : 0;
    f.px = tween(f.px, pxT, dt, 180);
    f.py = tween(f.py, { PLACING: -1.8, CLOSE: -.8, IDLE: -.8, UNBAL: .4, SOLVED: -1 }[m.mood] || 0, dt, 180);
    f.sw = tween(f.sw, (m.mood === "UNBAL" && m.inten > .35) ? 1 : 0, dt, 220);
    var blink = m.mood === "IDLE" ? blinkK(now, 4200, 3600, 3760, 3920) : (m.mood === "PLACING" || m.mood === "MISTAKE") ? 1 : blinkK(now, 3400, 3100, 3220, 3340);

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, g.W, g.H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // --- Fulcro ---
    ctx.save();
    ctx.translate(g.cx - 32, g.pivotY - 14);
    var w = 64, h = 90;
    ctx.save(); ctx.translate(0, h - 16);
    ctx.beginPath(); ctx.ellipse(w / 2, 8, w * .42, 8, 0, 0, PI2);
    ctx.fillStyle = rad(ctx, w / 2, 8, w * .45, ["rgba(0,0,0,.33)", "rgba(0,0,0,.09)", "rgba(0,0,0,0)"]); ctx.fill();
    ctx.restore();
    rrect(ctx, 5, h - 14, w - 10, 11, 5);
    ctx.fillStyle = lin(ctx, 0, h - 14, 0, h - 3, ["#E2E8F0", "#64748B"]); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, 10); ctx.lineTo(w - 10, h - 12); ctx.lineTo(10, h - 12); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, 0, 0, h, ["#FFEA75", "#FFC300", "#FF8800", "#D64000"]); ctx.fill();
    ctx.lineWidth = 2.8; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, 10); ctx.lineTo(w / 2, h - 12); ctx.lineTo(10, h - 12); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, 0, w, 0, ["rgba(255,255,255,.27)", "rgba(255,255,255,0)"]); ctx.fill();
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(w / 2, 18, 8.5, 0, PI2); ctx.fill();
    ctx.fillStyle = rad(ctx, w / 2 - .5, 17.5, 7, ["#FFFFFF", "#E2E8F0", "#64748B"]); ctx.beginPath(); ctx.arc(w / 2, 18, 7, 0, PI2); ctx.fill();
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(w / 2, 18, 3.5, 0, PI2); ctx.fill();
    drawFace(ctx, m, f, blink);
    ctx.restore();

    // --- Trave ---
    ctx.save();
    ctx.translate(g.cx, g.pivotY); ctx.rotate(ang * Math.PI / 180);
    var bw = g.beamW, bh = 22, x0 = -bw / 2, y0 = -bh / 2;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2;
    rrect(ctx, x0, y0, bw, bh, 12); ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + bh, ["#FFD180", "#E07A28", "#873600", "#4A1800"]); ctx.fill();
    ctx.restore();
    ctx.save(); rrect(ctx, x0, y0, bw, bh, 12); ctx.clip();
    ctx.strokeStyle = OUT; ctx.lineWidth = 5.2; rrect(ctx, x0, y0, bw, bh, 12); ctx.stroke();
    ctx.lineCap = "butt";
    ctx.strokeStyle = lin(ctx, x0 + 18, 0, x0 + bw - 18, 0, ["rgba(255,255,255,0)", "rgba(255,255,255,.73)", "rgba(255,255,255,0)"]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0 + 18, y0 + 3); ctx.lineTo(x0 + bw - 18, y0 + 3); ctx.stroke();
    ctx.strokeStyle = "rgba(74,24,0,.2)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0 + 24, y0 + bh * .45); ctx.lineTo(x0 + bw - 24, y0 + bh * .45); ctx.stroke();
    ctx.fillStyle = lin(ctx, x0, 0, x0 + 14, 0, ["#FFFFFF", "#E2E8F0", "#64748B"]); ctx.fillRect(x0, y0, 14, bh);
    ctx.fillStyle = lin(ctx, x0 + bw - 14, 0, x0 + bw, 0, ["#64748B", "#E2E8F0", "#FFFFFF"]); ctx.fillRect(x0 + bw - 14, y0, 14, bh);
    [[x0 + 7, 0], [x0 + bw - 7, 0]].forEach(function (p) {
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, PI2); ctx.fill();
      ctx.fillStyle = rad(ctx, p[0] - .4, p[1] - .4, 2.8, ["#FFE57F", "#FFB300", "#C67D00"]); ctx.beginPath(); ctx.arc(p[0], p[1], 2.8, 0, PI2); ctx.fill();
    });
    ctx.restore();
    ctx.restore();

    // --- Perno centrale ---
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(g.cx, g.pivotY, 12, 0, PI2); ctx.fill();
    ctx.fillStyle = rad(ctx, g.cx - .7, g.pivotY - .7, 10, ["#FFF7C2", "#FFD166", "#FF9F1C", "#C75D00"]); ctx.beginPath(); ctx.arc(g.cx, g.pivotY, 10, 0, PI2); ctx.fill();
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(g.cx, g.pivotY, 4, 0, PI2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(g.cx - 4, g.pivotY - 4, 1.8, 0, PI2); ctx.fill();

    // --- Funi ---
    var rA = ang * Math.PI / 180, cs = Math.cos(rA), sn = Math.sin(rA);
    [[true, g.lw], [false, g.rw]].forEach(function (s) {
      var left = s[0], tw = s[1], tcx = left ? g.cx - g.half : g.cx + g.half;
      var ax = left ? g.cx - g.half * cs : g.cx + g.half * cs, ay = left ? g.pivotY - g.half * sn : g.pivotY + g.half * sn;
      [tcx - tw * .42, tcx + tw * .42].forEach(function (ex) {
        var ey = g.trayTop + 4;
        ctx.lineCap = "round";
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.strokeStyle = lin(ctx, 0, Math.min(ay, ey), 0, Math.max(ay, ey), ["#FFFFFF", "#E2E8F0", "#64748B"]); ctx.lineWidth = 3.6;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
      });
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(ax, ay, 5, 0, PI2); ctx.fill();
      ctx.fillStyle = rad(ctx, ax - .4, ay - .4, 4, ["#FFFFFF", "#E2E8F0", "#64748B"]); ctx.beginPath(); ctx.arc(ax, ay, 3.8, 0, PI2); ctx.fill();
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(ax, ay, 1.6, 0, PI2); ctx.fill();
    });
  }

  function drawFace(ctx, m, f, blink) {
    var mood = m.mood;
    ctx.save();
    ctx.translate(32, 61.5 + f.off.x); ctx.rotate(f.tilt.x * Math.PI / 180); ctx.translate(-32, -61.5);
    // Sopracciglia
    [[22, f.bl], [42, f.br]].forEach(function (b) {
      ctx.save(); ctx.translate(b[0], 50 + f.bo); ctx.rotate(b[1] * Math.PI / 180);
      ctx.strokeStyle = OUT; ctx.lineWidth = 2.3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke(); ctx.restore();
    });
    // Occhi
    var ew = mood === "MISTAKE" ? 11.5 : mood === "PLACING" ? 10.6 : 10, eh = mood === "MISTAKE" ? 12.5 : mood === "PLACING" ? 11.6 : 11;
    var squint = mood === "UNBAL" ? (.86 - .16 * m.inten) : 1, sy = Math.max(.08, Math.min(1.2, blink * squint));
    var ps = { MISTAKE: 2.4, CLOSE: 5, PLACING: 4.8, SOLVED: 5.2 }[mood] || 4.2;
    var rowW = ew * 2 + 6, ey = 57.5;
    [32 - rowW / 2 + ew / 2, 32 + rowW / 2 - ew / 2].forEach(function (ex) {
      ctx.save(); ctx.translate(ex, ey); ctx.scale(1, sy);
      ctx.beginPath(); ctx.ellipse(0, 0, ew / 2, eh / 2, 0, 0, PI2); ctx.fillStyle = "#fff"; ctx.fill();
      ctx.lineWidth = 1.4; ctx.strokeStyle = OUT; ctx.stroke();
      if (sy > .28) {
        if (mood === "SOLVED") {
          var iw = ew - 4, ih = eh - 4;
          ctx.beginPath(); ctx.moveTo(-iw / 2 + 1, -ih / 2 + ih * .65); ctx.quadraticCurveTo(0, -ih / 2 + 1, iw / 2 - 1, -ih / 2 + ih * .65);
          ctx.strokeStyle = "#0E8578"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.stroke();
        } else {
          ctx.fillStyle = "#1B1B22"; ctx.beginPath(); ctx.arc(f.px, f.py, ps / 2, 0, PI2); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(f.px - ps / 2 + .6 + .75, f.py - ps / 2 + .6 + .75, .75, 0, PI2); ctx.fill();
          if (mood === "CLOSE") { ctx.beginPath(); ctx.arc(f.px - ps / 2 + 2.8 + .55, f.py - ps / 2 + 2.8 + .55, .55, 0, PI2); ctx.fill(); }
        }
      }
      ctx.restore();
    });
    // Goccia di sudore
    if (f.sw > .05) {
      var sx = 32 + (m.diff >= 0 ? 18 : -18) - 3.5, syy = ey - 7 - 5;
      ctx.save(); ctx.globalAlpha = f.sw; ctx.translate(sx, syy);
      ctx.beginPath(); ctx.moveTo(3.5, 0); ctx.quadraticCurveTo(7, 6.5, 3.5, 10); ctx.quadraticCurveTo(0, 6.5, 3.5, 0); ctx.closePath();
      ctx.fillStyle = "#67E8F9"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(2.8, 5, 1, 0, PI2); ctx.fill(); ctx.restore();
    }
    // Guance e bocca
    var cheek = (mood === "SOLVED" || mood === "CLOSE") ? "#FF5277" : mood === "UNBAL" ? "#FFA07A" : "#FF3366";
    var cr = 3 * ((mood === "SOLVED" || mood === "CLOSE") ? 1.15 : 1);
    ctx.fillStyle = cheek;
    ctx.beginPath(); ctx.arc(18, 70.5, cr, 0, PI2); ctx.fill();
    ctx.beginPath(); ctx.arc(46, 70.5, cr, 0, PI2); ctx.fill();
    ctx.save(); ctx.translate(24, 66);
    var mw = 16, mh = 9;
    ctx.strokeStyle = OUT; ctx.lineCap = "round";
    if (mood === "SOLVED") {
      ctx.beginPath(); ctx.moveTo(1.5, 2); ctx.quadraticCurveTo(mw / 2, mh, mw - 1.5, 2); ctx.closePath();
      ctx.fillStyle = "#5A0E1A"; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3.5, mh * .65); ctx.quadraticCurveTo(mw / 2, mh * .4, mw - 3.5, mh * .65); ctx.quadraticCurveTo(mw / 2, mh, 3.5, mh * .65);
      ctx.fillStyle = "#FF6584"; ctx.fill();
    } else if (mood === "MISTAKE") {
      ctx.beginPath(); ctx.ellipse(mw / 2, (1 + mh) / 2, (mw - 8) / 2, (mh - 1) / 2, 0, 0, PI2);
      ctx.fillStyle = "#4A0E17"; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
    } else if (mood === "UNBAL") {
      var wv = Math.max(1, 1.6 * m.inten);
      rrect(ctx, 3, mh * .35 - wv * .5, mw - 6, mh * .3 + wv, 2); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2, mh / 2 - wv); ctx.bezierCurveTo(mw * .35, mh / 2 + wv, mw * .65, mh / 2 - wv, mw - 2, mh / 2 + wv);
      ctx.lineWidth = 2.2; ctx.stroke();
    } else {
      ctx.beginPath();
      if (mood === "CLOSE") { ctx.moveTo(2, 2.8); ctx.quadraticCurveTo(mw / 2, mh * .9, mw - 2, 2.8); ctx.lineWidth = 2.2; }
      else if (mood === "PLACING") { ctx.moveTo(3, 3); ctx.quadraticCurveTo(mw / 2, mh * .85, mw - 3, 3); ctx.lineWidth = 2.2; }
      else { ctx.moveTo(3.5, 4.2); ctx.quadraticCurveTo(mw / 2, mh * .72, mw - 3, 3); ctx.lineWidth = 2.1; }
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  function drawMascot(now) {
    var c = ui.mascot; if (!c) return;
    var ctx = c.getContext("2d"), cel = S.complete, wor = S.worried;
    // animazioni (MascotView)
    var bPer = cel ? 180 : wor ? 120 : 650, bAmp = cel ? -14 : wor ? -2 : -5;
    var bp = (now % (bPer * 2)) / bPer, be = bp < 1 ? bp : 2 - bp; be = be * be * (3 - 2 * be);
    var bounce = bAmp * be;
    var br = (now % 2400) / 1200, bre = br < 1 ? br : 2 - br; bre = bre * bre * (3 - 2 * bre);
    var breath = 1 + .05 * bre;
    var rPer = cel ? 200 : 800, rAmp = cel ? 10 : 3, rp = (now % (rPer * 2)) / rPer, re = rp < 1 ? rp : 2 - rp; re = re * re * (3 - 2 * re);
    var rot = -rAmp + 2 * rAmp * re;
    var sh = 0;
    if (ui.shudder) {
      var e = now - ui.shudder, seq = [0, -7, 7, -5, 5, 0], i = Math.floor(e / 45);
      if (i >= seq.length - 1) { if (!wor) ui.shudder = null; sh = 0; }
      else sh = seq[i] + (seq[i + 1] - seq[i]) * ((e % 45) / 45);
    }
    if (wor) rot = sh * 1.5;
    c.style.transform = "translate(" + sh + "px," + bounce + "px) scale(" + breath + ") rotate(" + rot + "deg)";
    var blink = wor ? 1 : blinkK(now, 3400, 3100, 3220, 3340);

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, 76, 96);
    // ombra
    ctx.save(); ctx.translate(0, 12);
    ctx.beginPath(); ctx.ellipse(38, 76 * .65 + 8, 76 * .35, 8, 0, 0, PI2);
    ctx.fillStyle = rad(ctx, 38, 76 * .75, 76 * .4, ["rgba(0,0,0,.33)", "rgba(0,0,0,.07)", "rgba(0,0,0,0)"]); ctx.fill();
    ctx.restore();
    // cervello
    var ov = [[9, 14, 44, 54], [32, 14, 67, 54], [20, 5, 56, 42], [14, 22, 62, 65]];
    ctx.beginPath();
    ov.forEach(function (o) { ctx.moveTo(o[2], (o[1] + o[3]) / 2); ctx.ellipse((o[0] + o[2]) / 2, (o[1] + o[3]) / 2, (o[2] - o[0]) / 2, (o[3] - o[1]) / 2, 0, 0, PI2); });
    ctx.fillStyle = lin(ctx, 0, 0, 0, 76, ["#FFCCD5", "#FF5286", "#C70039", "#700020"]); ctx.fill("nonzero");
    ctx.strokeStyle = OUT; ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.stroke();
    ctx.strokeStyle = "#C70039"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(26, 18); ctx.quadraticCurveTo(38, 24, 38, 38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, 18); ctx.quadraticCurveTo(38, 24, 38, 38); ctx.stroke();
    ctx.fillStyle = rad(ctx, 26, 16, 8, ["rgba(255,255,255,.93)", "rgba(255,255,255,0)"]); ctx.beginPath(); ctx.arc(26, 16, 8, 0, PI2); ctx.fill();
    // occhi
    var ew = wor ? 10 : 9, eh = wor ? 11 : 10, rowTop = 43 - (eh + 3 + 8) / 2, ey = rowTop + eh / 2;
    [38 - 4 - ew / 2, 38 + 4 + ew / 2].forEach(function (ex) {
      ctx.save(); ctx.translate(ex, ey); ctx.scale(1, wor ? 1 : blink);
      ctx.beginPath(); ctx.ellipse(0, 0, ew / 2, eh / 2, 0, 0, PI2); ctx.fillStyle = "#fff"; ctx.fill();
      ctx.lineWidth = 1.4; ctx.strokeStyle = wor ? "#B71C1C" : OUT; ctx.stroke();
      if (blink > .3 || wor) {
        var ps = wor ? 3.5 : cel ? 5.5 : 4.5;
        ctx.fillStyle = wor ? "#B71C1C" : OUT; ctx.beginPath(); ctx.arc(0, 0, ps / 2, 0, PI2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-ps / 2 + 1.1, -ps / 2 + 1.1, .6, 0, PI2); ctx.fill();
      }
      ctx.restore();
    });
    // guance e bocca
    var my = rowTop + eh + 3, mcy = my + 4;
    ctx.fillStyle = wor ? "#FFAA00" : "#FF0055";
    ctx.beginPath(); ctx.arc(38 - 7 - 4 - 3.5, mcy, 3.5, 0, PI2); ctx.fill();
    ctx.beginPath(); ctx.arc(38 + 7 + 4 + 3.5, mcy, 3.5, 0, PI2); ctx.fill();
    ctx.save(); ctx.translate(31, my);
    ctx.beginPath();
    if (wor) { ctx.ellipse(7, 4.25, 5, 3.75, 0, 0, PI2); ctx.strokeStyle = OUT; ctx.lineWidth = 2.4; ctx.stroke(); ctx.fillStyle = "#6A040F"; ctx.fill(); }
    else if (cel) { ctx.ellipse(7, 4, 7, 4, 0, 0, PI2); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#FF3366"; ctx.fill(); }
    else { ctx.moveTo(0, 1); ctx.quadraticCurveTo(7, 7, 14, 1); ctx.strokeStyle = OUT; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.stroke(); }
    ctx.restore();
  }

  // ---- Coriandoli (ConfettiCanvas) ----
  var conf = null;
  function confetti() {
    var cols = ["#FF4D6D", "#FFD166", "#06D6A0", "#118AB2", "#7209B7", "#FF9E00", "#48CAE4", "#FF70A6", "#70D6FF", "#FF9770"];
    var ps = [];
    for (var i = 0; i < 150; i++) ps.push({ x: Math.random() * 900 + 50, y: Math.random() * 300 + 50, vx: (Math.random() - .5) * 900, vy: -(Math.random() * 600 + 350),
      c: cols[Math.floor(Math.random() * cols.length)], s: Math.random() * 14 + 8, circ: Math.random() < .5, rs: (Math.random() - .5) * 900 });
    conf = { t0: performance.now(), ps: ps };
  }
  function drawConfetti(now) {
    var ctx = confC.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, PW, PH);
    if (!conf) return;
    var tt = (now - conf.t0) / 2800;
    if (tt >= 1) { conf = null; return; }
    var grav = 1050 * tt * tt, al = Math.max(0, Math.min(1, 1 - tt * 1.08)), k = 1 / DENS * (PW / 411);
    ctx.globalAlpha = al;
    conf.ps.forEach(function (p) {
      var x = (p.x + p.vx * tt) * k * 1.2, y = (p.y + p.vy * tt + grav) * k * 1.2;
      ctx.save(); ctx.translate(x, y); ctx.rotate(p.rs * tt * Math.PI / 180); ctx.fillStyle = p.c;
      var s = p.s * k * 1.2;
      if (p.circ) { ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, PI2); ctx.fill(); }
      else ctx.fillRect(-s / 2, -s / 3, s, s * .7);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  // ---- PE fluttuanti ----
  function floatXp(n) {
    xpEl.textContent = t("⚡ +" + n + " PE", "⚡ +" + n + " XP");
    xpEl.hidden = false; xpEl.classList.remove("go"); void xpEl.offsetWidth; xpEl.classList.add("go");
    clearTimeout(floatXp.tm); floatXp.tm = setTimeout(function () { xpEl.hidden = true; }, 1600);
  }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("on");
    clearTimeout(toast.tm); toast.tm = setTimeout(function () { toastEl.classList.remove("on"); }, 2000);
  }

  // ---- Fine demo (dopo il livello 5) ----
  function showEnd() {
    var total = 0; LEVELS.forEach(function (l) { total += bestStars[l.id] || 0; });
    endEl.innerHTML = '<div class="wb-endc"><div class="wb-dpill">' + t("CAPITOLO 1 COMPLETATO!", "CHAPTER 1 COMPLETE!") + '</div>' +
      '<div class="wb-endst">' + svg("star", 22, "#FF8800") + '<b>' + total + ' / 15</b></div>' +
      '<p>' + t("Hai bilanciato la Foresta dell'Equilibrio. Nel gioco completo ti aspettano tanti altri capitoli, nuove operazioni e la sfida giornaliera.",
               "You balanced The Forest of Balance. The full game has many more chapters, new operations and a daily challenge.") + '</p>' +
      '<a class="wb-next" href="' + GROUP + '" target="_blank" rel="noopener"><span>' + t("Diventa tester", "Become a tester") + '</span>' + svg("play", 18, OUT) + '</a>' +
      '<button class="wb-replay" data-a="restart">' + svg("refresh", 18, OUT) + '<span>' + t("Ricomincia dal livello 1", "Start again from level 1") + '</span></button></div>';
    endEl.hidden = false;
    play("fanfare"); confetti();
  }

  // ======================================================================
  // Input: tocchi e trascinamento (InventoryDock / DragDropState)
  // ======================================================================
  function toPhone(e) {
    var r = phone.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scaleF, y: (e.clientY - r.top) / scaleF };
  }
  function slotTargets() {
    var r0 = phone.getBoundingClientRect(), out = [];
    arenaEl.querySelectorAll('.wb-slot[data-a="slot"]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      out.push({ id: el.dataset.s, left: el.dataset.l === "1", slot: +el.dataset.k,
        x0: (r.left - r0.left) / scaleF, y0: (r.top - r0.top) / scaleF, x1: (r.right - r0.left) / scaleF, y1: (r.bottom - r0.top) / scaleF });
    });
    return out;
  }
  function hoverAt(p) {
    var best = null, bd = 1e9, R = 13;
    (drag.targets || []).forEach(function (tg) {
      if (p.x >= tg.x0 - R && p.x <= tg.x1 + R && p.y >= tg.y0 - R && p.y <= tg.y1 + R) {
        var cx = (tg.x0 + tg.x1) / 2, cy = (tg.y0 + tg.y1) / 2, d = (cx - p.x) * (cx - p.x) + (cy - p.y) * (cy - p.y);
        if (d < bd) { bd = d; best = tg; }
      }
    });
    return best;
  }
  function placeDrag() {
    dragEl.style.left = (drag.x - 32) + "px"; dragEl.style.top = (drag.y - 44) + "px";
    dragEl.classList.toggle("hov", !!drag.hovered);
  }

  var press = null;
  phone.addEventListener("pointerdown", function (e) {
    unlockAudio();
    var el = e.target.closest("[data-a]");
    if (!el || !phone.contains(el)) return;
    if (el.dataset.a === "inv" && !S.complete) {
      press = { el: el, id: el.dataset.id, start: toPhone(e), pid: e.pointerId, dragging: false };
      try { phone.setPointerCapture(e.pointerId); } catch (x) {}
      e.preventDefault();
    }
  });
  phone.addEventListener("pointermove", function (e) {
    if (!press || e.pointerId !== press.pid) return;
    var p = toPhone(e), dx = p.x - press.start.x, dy = p.y - press.start.y, slop = 8;
    if (!press.dragging) {
      if (Math.hypot(dx, dy) > slop) {
        if (dy < -slop * .4 || Math.abs(dy) > Math.abs(dx) * 1.15) {
          if (penalty) { press = null; return; }
          var block = S.inv.filter(function (b) { return b.id === press.id; })[0];
          if (!block) { press = null; return; }
          press.dragging = true;
          drag = { block: block, x: p.x, y: p.y, hovered: null, targets: null };
          dragEl.innerHTML = blockHTML(block, 64, { sel: true });
          dragEl.hidden = false;
          render();
          drag.targets = slotTargets();
        } else { press = null; return; }
      } else return;
    }
    drag.x = p.x; drag.y = p.y;
    var h = hoverAt(p), prev = drag.hovered;
    drag.hovered = h;
    if ((h && (!prev || prev.id !== h.id || prev.left !== h.left || prev.slot !== h.slot)) || (!h && prev)) {
      render(); drag.targets = slotTargets();
    }
    placeDrag();
  });
  function endPress(e, cancel) {
    if (!press || e.pointerId !== press.pid) return;
    var pr = press; press = null;
    if (pr.dragging) {
      var d = drag; drag = null; dragEl.hidden = true;
      if (!cancel && d.hovered) placeBlock(d.block, d.hovered.id, d.hovered.left, d.hovered.slot);
      else render();
    } else if (!cancel) {
      selectBlock(pr.id);
    }
  }
  phone.addEventListener("pointerup", function (e) { endPress(e, false); });
  phone.addEventListener("pointercancel", function (e) { endPress(e, true); });

  phone.addEventListener("click", function (e) {
    var el = e.target.closest("[data-a]");
    if (!el || !phone.contains(el)) return;
    var a = el.dataset.a;
    if (a === "inv") return;
    if (a === "slot") onSlotClicked(el.dataset.s, el.dataset.l === "1", +el.dataset.k);
    else if (a === "remove") {
      var p = S.placed.filter(function (q) { return q.scaleId === el.dataset.s && q.left === (el.dataset.l === "1") && q.slot === +el.dataset.k; })[0];
      if (p) removePlaced(p);
    }
    else if (a === "undo") undo();
    else if (a === "sound") { soundOn = !soundOn; put("wb_sound", soundOn ? "1" : "0"); if (soundOn) play("click"); render(); }
    else if (a === "replay") resetLevel();
    else if (a === "next") nextLevel();
    else if (a === "restart") { endEl.hidden = true; startLevel(0); }
    else if (a === "hint" || a === "settings" || a === "levels" || a === "energy") toast(t("Disponibile nell'app completa.", "Available in the full app."));
  });
  arenaEl.addEventListener("click", function (e) { if (e.target.closest(".wb-mascot")) play("pop"); });

  // Lingua
  document.querySelectorAll(".lang").forEach(function (b) { b.addEventListener("click", function () { setTimeout(render, 0); }); });

  // ======================================================================
  // Avvio e ciclo di animazione
  // ======================================================================
  buildTop();
  initLevel(levelIdx); buildLevel(); render();

  var visible = true, last = performance.now();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { last = performance.now(); requestAnimationFrame(loop); } }).observe(root);
  }
  var ambCtx = ambC.getContext("2d");
  function loop(now) {
    if (!visible) return;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    drawAmbient(ambCtx, now);
    S.L.scales.forEach(function (sc) { var u = ui.scales[sc.id]; if (u) drawScale(sc, u, now, dt); });
    drawMascot(now);
    drawConfetti(now);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
