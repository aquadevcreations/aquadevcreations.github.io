/*
 * Irreversible — demo web.
 * Riproduzione della schermata principale (ButtonScreenContent + RedButton) e della RevealView
 * dall'app Android (MainScreen.kt, RevealView.kt, theme/Color.kt). Misure in dp = px CSS.
 * Nella demo nulla viene scritto sulla blockchain: lo stato vive solo nel browser.
 */
(function () {
  var root = document.getElementById("demo-irreversible");
  if (!root) return;

  // ---- Palette (theme/Color.kt) ----
  var C = {
    black: "#000000", charcoal: "#0D0D0D", border: "#222222",
    crimson: "#E50914", crimsonLight: "#FF2A32", crimsonDark: "#7A0006",
    dormant: "#381517", white: "#F4F4F5", muted: "#71717A", subtle: "#52525B"
  };

  // ---- Frasi (backend) ----
  var EVENTS = [
    "A streetlight in a city you'll never visit flickered out.",
    "Somewhere, a letter that was never going to be sent was finally thrown away.",
    "A stray cat crossed a street one second before a car would have hit it.",
    "A song stuck in someone's head finally faded, replaced by silence.",
    "A door that had been left ajar for years quietly clicked shut.",
    "A phone rang once in an empty house and stopped.",
    "Someone almost remembered a dream, then didn't.",
    "A page turned itself in a book no one was reading.",
    "A candle in a window burned down to nothing, unnoticed.",
    "A message was typed, then deleted, then typed again.",
    "A bus passed a stop where no one was waiting anymore.",
    "A shadow moved across a wall for no reason anyone could name.",
    "A glass of water went untouched until it was room temperature.",
    "Someone's reflection lingered a moment longer than it should have.",
    "A radio between stations found a word, then lost it again.",
    "A single leaf fell straight down with no wind to carry it.",
    "A clock in a waiting room was three minutes wrong, and stayed that way.",
    "Somebody's name was almost called, then wasn't.",
    "A light left on in a room no one entered finally burned out.",
    "A path through tall grass closed over by morning.",
    "A kettle finished boiling for no one in particular.",
    "Someone paused mid-sentence and never finished the thought.",
    "A photograph slipped behind a drawer, unnoticed, for the last time.",
    "A dog looked up at an empty doorway, then looked away.",
    "A key stayed in a lock, untouched, until the metal cooled.",
    "A window fogged over and cleared without anyone watching.",
    "An umbrella opened by mistake in a room, and no one minded.",
    "A ticket was bought for a train that was never boarded.",
    "Somewhere, a chair was pulled out and pushed back in, unused.",
    "A single bell rang once in a tower no one visits anymore.",
    "A voicemail played to no one, then ended.",
    "A curtain moved, though the window was shut.",
    "Someone's handwriting changed slightly, and no one noticed why.",
    "A coin was found, spent, and forgotten within the hour.",
    "A porch light stayed on through a morning it wasn't needed.",
    "A song ended on the radio a half-second before the story could finish.",
    "A pair of shoes was left by a door that no one used again.",
    "A calendar page turned to a date already passed.",
    "Someone hummed a tune they didn't know the name of.",
    "A streetlamp buzzed once and went quiet again."
  ];
  var BGS = ["indigo_1", "indigo_2", "amber_1", "amber_2", "aurora_1", "aurora_2", "rose_1", "rose_2"];
  var DAY = 24 * 60 * 60 * 1000;

  // ---- Stato locale (solo nel browser) ----
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  if (!get("irr_first")) put("irr_first", String(Date.now()));

  function lastPress() { var v = get("irr_last"); return v ? Number(v) : null; }
  function isDormant() { var lp = lastPress(); return lp !== null && Date.now() - lp < DAY; }
  function cooldownText() {
    var lp = lastPress(); if (lp === null) return "";
    var rem = Math.max(0, lp + DAY - Date.now());
    var h = Math.floor(rem / 3600000), m = Math.floor((rem % 3600000) / 60000);
    return h > 0 ? h + "h " + m + "m" : m + "m";
  }
  function daysResisted() {
    if (isDormant()) return 0;
    var from = lastPress() || Number(get("irr_first")) || Date.now();
    return Math.max(0, Math.floor((Date.now() - from) / DAY));
  }
  function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  // ---- DOM ----
  root.innerHTML =
    '<div class="irr-scaler"><div class="irr-phone">' +
      '<div class="irr-screen irr-main">' +
        '<div class="irr-col">' +
          '<div class="irr-title">IRREVERSIBLE</div>' +
          '<div class="irr-sub">DON\'T TOUCH THE BUTTON</div>' +
          '<div class="irr-btnbox"><canvas width="268" height="268"></canvas>' +
            '<button class="irr-hit" aria-label="The button"><span class="irr-in"></span></button></div>' +
          '<div class="irr-days"></div>' +
          '<div class="irr-links"><span data-l="app">trace</span><span data-l="app">quests</span><span data-l="app">what is this</span></div>' +
          '<div class="irr-notice" hidden></div>' +
          '<div class="irr-links irr-links2"><span data-l="tg">elsewhere</span><span data-l="app">speak</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="irr-screen irr-reveal" hidden>' +
        '<div class="irr-bg"></div>' +
        '<div class="irr-rv">' +
          '<button class="irr-back" aria-label="Return"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#52525B" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>' +
          '<div class="irr-mid"><div class="irr-hair"></div><div class="irr-event"></div><div class="irr-hair"></div></div>' +
          '<div class="irr-bottom"><div class="irr-rec">This has been permanently recorded.</div>' +
            '<div class="irr-demo-note"></div>' +
            '<button class="irr-return">RETURN</button></div>' +
        '</div>' +
      '</div>' +
    '</div></div>' +
    '<button class="irr-reset"></button>';

  var $ = function (s) { return root.querySelector(s); };
  var canvas = $("canvas"), ctx = canvas.getContext("2d");
  var hit = $(".irr-hit"), inner = $(".irr-in"), notice = $(".irr-notice");
  var mainScr = $(".irr-main"), revScr = $(".irr-reveal");
  var lang = function () { return document.body.dataset.lang === "it" ? "it" : "en"; };

  function t(it, en) { return lang() === "it" ? it : en; }
  function refreshTexts() {
    $(".irr-demo-note").textContent = t("demo: in questa versione non viene scritto nulla sulla blockchain", "demo: nothing is written on-chain in this version");
    $(".irr-reset").textContent = t("azzera demo", "reset demo");
  }
  refreshTexts();
  document.querySelectorAll(".lang").forEach(function (b) { b.addEventListener("click", function () { setTimeout(refreshTexts, 0); }); });

  // Scala il telefono (progettato a 360dp) alla larghezza disponibile
  var scaler = $(".irr-scaler"), phone = $(".irr-phone");
  function fit() {
    var w = Math.min(360, root.clientWidth);
    var s = w / 360;
    phone.style.transform = "scale(" + s + ")";
    scaler.style.width = w + "px";
    scaler.style.height = (800 * s) + "px";
  }
  window.addEventListener("resize", fit); fit();

  // HiDPI canvas
  var DPR = Math.min(3, window.devicePixelRatio || 1);
  canvas.width = 268 * DPR; canvas.height = 268 * DPR;
  canvas.style.width = "268px"; canvas.style.height = "268px";

  // ---- Stato UI ----
  var state = { pressing: false, pressed: false };
  var anim = { pressScale: 1, pressOffset: 0, darken: 0, spec: 1, vScale: 0, vOff: 0, vSpec: 0 };

  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }
  function radial(cx, cy, r, colors) {
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    colors.forEach(function (c, i) { g.addColorStop(i / (colors.length - 1), c); });
    return g;
  }
  function linear(x0, y0, x1, y1, colors) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    colors.forEach(function (c, i) { g.addColorStop(i / (colors.length - 1), c); });
    return g;
  }
  function circle(cx, cy, r, fill) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
  function ring(cx, cy, r, stroke, w) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); }

  // Porting di RedButton → Canvas (stessi livelli e colori)
  function draw(pulseScale, glowAlpha) {
    var dormant = isDormant(), pressing = state.pressing;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, 268, 268);
    ctx.save();
    ctx.translate(134, 134); ctx.scale(pulseScale, pulseScale); ctx.translate(-134, -134);
    var cx = 134, cy = 134, R = 100, pressed = state.pressed;

    if (!dormant) {
      var k = pressed ? 0.5 : 0.85;
      circle(cx, cy, R + 32, radial(cx, cy, R + 32, [hexA("#FF1E27", glowAlpha * k), hexA(C.crimsonDark, glowAlpha * 0.2 * k), "rgba(0,0,0,0)"]));
    }
    var gy = cy + 14, gr = R + 30;
    circle(cx, gy, gr, radial(cx, gy, gr, ["rgba(0,0,0," + (dormant ? 0.7 : 0.85) + ")", "rgba(0,0,0," + (dormant ? 0.35 : 0.45) + ")", "rgba(0,0,0,0)"]));

    var fy = cy + 8, fr = R + 26;
    circle(cx, fy, fr, linear(cx, fy - fr, cx, fy + fr, ["#32363E", "#202227", "#141519", "#0C0D10"]));
    ring(cx, fy, fr, linear(cx, fy - fr, cx, fy + fr, ["#5A606D", "#383C45", "#1E2026"]), 1.25);

    var coy = cy + 4, cr = R + 14;
    circle(cx, coy, cr, linear(cx, coy - cr, cx, coy + cr, ["#282B32", "#1B1D22", "#111216", "#090A0C"]));
    ring(cx, coy, cr, linear(cx, coy - cr, cx, coy + cr, ["#4C515D", "#30333B", "#191A1E"]), 1.2);

    var sr = R + 3.5;
    circle(cx, cy, sr, "#070709");
    ring(cx, cy, sr, "#020202", 2.5);

    var dy = cy + anim.pressOffset, dr = R * anim.pressScale;
    var sky = dy + 4.5;
    circle(cx, sky, dr, linear(cx, sky - dr, cx, sky + dr, dormant ? ["#381518", "#1E080A", "#0D0304"] : ["#6B040A", "#3E0105", "#180002"]));

    var lx = cx - dr * 0.32, ly = dy - dr * 0.34;
    var dome = dormant ? ["#552226", C.dormant, "#2A0D10", "#140406", "#0A0203"]
      : pressing ? [C.crimsonLight, C.crimsonDark, "#480004", "#220002", "#100001"]
      : ["#FF3838", C.crimsonLight, C.crimson, C.crimsonDark, "#4A0005", "#1E0002"];
    ctx.save(); ctx.beginPath(); ctx.arc(cx, dy, dr, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = radial(lx, ly, dr * 1.32, dome); ctx.fillRect(0, 0, 268, 268);
    ctx.restore();

    if (anim.darken > 0.001) circle(cx, dy, dr, "rgba(0,0,0," + anim.darken + ")");
    circle(cx, dy, dr, radial(cx, dy, dr, ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0," + (dormant ? 0.55 : 0.48) + ")"]));
    ring(cx, dy, dr - 1, dormant ? "rgba(107,40,44,0.28)" : "rgba(255,122,122,0.22)", 1);

    var f = anim.spec;
    var scx = cx - dr * 0.35, scy = dy - dr * 0.36, rx = dr * 0.28 * f, ry = dr * 0.17 * f;
    var sa = (dormant ? 0.08 : pressing ? 0.12 : 0.42) * f;
    if (rx > 0.5) {
      ctx.save(); ctx.beginPath(); ctx.ellipse(scx, scy, rx, ry, 0, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = radial(scx, scy, rx, ["rgba(255,255,255," + sa + ")", hexA(C.crimsonLight, sa * 0.45), "rgba(0,0,0,0)"]);
      ctx.fillRect(0, 0, 268, 268); ctx.restore();
    }
    var pcx = cx - dr * 0.38, pcy = dy - dr * 0.38, pr = dr * 0.09 * f;
    if (pr > 0.3) circle(pcx, pcy, pr, radial(pcx, pcy, pr, ["rgba(255,255,255," + (sa * 0.85) + ")", "rgba(0,0,0,0)"]));
    ctx.restore();
  }

  // Molla smorzata (DampingRatioMediumBouncy ≈ 0.5, StiffnessLow ≈ 200)
  function springStep(key, vkey, target, dt) {
    var k = 200, c = 2 * 0.5 * Math.sqrt(k);
    var x = anim[key] - target;
    var a = -k * x - c * anim[vkey];
    anim[vkey] += a * dt; anim[key] += anim[vkey] * dt;
  }

  var t0 = performance.now(), prev = t0;
  function frame(now) {
    var dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    var active = !isDormant() && !state.pressing;
    var phase = ((now - t0) / 3800) % 2; var p = phase < 1 ? phase : 2 - phase;
    var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // FastOutSlowIn approx
    var pulse = active ? 0.985 + (1.025 - 0.985) * e : 1;
    var glow = active ? 0.15 + (0.45 - 0.15) * e : 0;

    if (state.pressed) {
      var step = dt / 0.12;
      anim.pressScale = Math.max(0.935, anim.pressScale - (1 - 0.935) * step);
      anim.pressOffset = Math.min(5.5, anim.pressOffset + 5.5 * step);
      anim.spec = Math.max(0.35, anim.spec - 0.65 * step);
      anim.darken = Math.min(0.28, anim.darken + 0.28 * step);
      anim.vScale = anim.vOff = anim.vSpec = 0;
    } else {
      springStep("pressScale", "vScale", 1, dt);
      springStep("pressOffset", "vOff", 0, dt);
      springStep("spec", "vSpec", 1, dt);
      anim.darken = Math.max(0, anim.darken - 0.28 * dt / 0.18);
    }
    hit.style.transform = "translateY(" + anim.pressOffset + "px) scale(" + anim.pressScale + ")";
    $(".irr-btnbox").style.transform = "scale(" + pulse + ")";
    draw(1, glow);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function renderMain() {
    $(".irr-days").textContent = "Days resisted: " + daysResisted();
    if (state.pressing) {
      inner.innerHTML = '<span class="irr-spin"></span>';
    } else if (isDormant()) {
      inner.innerHTML = '<span class="irr-rl">RETURN LATER</span><span class="irr-cd">' + cooldownText() + "</span>";
    } else {
      inner.innerHTML = "";
    }
  }
  renderMain();
  setInterval(renderMain, 30000);

  var noticeTimer;
  function showNotice(text) {
    notice.textContent = text; notice.hidden = false;
    requestAnimationFrame(function () { notice.classList.add("on"); });
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(hideNotice, 4000);
  }
  function hideNotice() { notice.classList.remove("on"); setTimeout(function () { notice.hidden = true; }, 300); }
  notice.addEventListener("click", hideNotice);

  // Pressione fisica
  function down() { if (!state.pressing) state.pressed = true; }
  function up() { state.pressed = false; }
  hit.addEventListener("pointerdown", down);
  ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { hit.addEventListener(ev, up); });

  hit.addEventListener("click", function () {
    vibrate(18);
    if (state.pressing) return;
    if (isDormant()) {
      var d = cooldownText() || "24 hours";
      showNotice("The button remembers. Return in " + d + ".");
      return;
    }
    hideNotice();
    state.pressing = true; renderMain();
    setTimeout(function () {
      state.pressing = false;
      put("irr_last", String(Date.now()));
      openReveal(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
    }, 1400);
  });

  function crossfade(from, to) {
    to.hidden = false; to.classList.remove("on");
    requestAnimationFrame(function () {
      to.classList.add("on"); from.classList.remove("on");
      setTimeout(function () { from.hidden = true; }, 800);
    });
  }
  mainScr.classList.add("on");

  function openReveal(text) {
    var bg = BGS[Math.floor(Math.random() * BGS.length)];
    $(".irr-bg").style.backgroundImage = "url(irr-" + bg + ".webp)";
    $(".irr-event").textContent = text;
    var rv = $(".irr-rv"); rv.classList.remove("on");
    crossfade(mainScr, revScr);
    setTimeout(function () { rv.classList.add("on"); vibrate(45); }, 50);
  }
  function closeReveal() { renderMain(); crossfade(revScr, mainScr); }
  $(".irr-back").addEventListener("click", closeReveal);
  $(".irr-return").addEventListener("click", closeReveal);

  root.querySelectorAll("[data-l]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (el.dataset.l === "tg") { window.open("https://t.me/donttouchthebutton", "_blank", "noopener"); return; }
      showNotice(t("Disponibile nell'app.", "Available in the app."));
    });
  });

  $(".irr-reset").addEventListener("click", function () {
    put("irr_last", null); put("irr_first", String(Date.now()));
    hideNotice(); renderMain();
    if (!revScr.hidden) closeReveal();
  });
})();
