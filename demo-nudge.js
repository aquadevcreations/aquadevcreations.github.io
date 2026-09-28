/*
 * Nudge — demo web a due telefoni collegati.
 * Porting di HomeScreen.kt, PatternRecorderSheet.kt, SchizzoPickerDialog.kt, GlowDrawSheet.kt,
 * FlyInteractiveOverlay.kt, SchizzoCleanOverlay.kt, GlowDrawOverlay.kt, ReactionBannerOverlay.kt,
 * QuickReactionRow.kt e dei pattern di HapticVibratorHelper.kt. Misure in dp = px CSS.
 * Tutto avviene nel browser: nessun dato viene inviato.
 */
(function () {
  var root = document.getElementById("demo-nudge");
  if (!root) return;

  var PW = 411, PH = 870; // schermo logico (dp) del telefono
  var DENS = 2.75; // px→dp dello schermo di riferimento (valori in px nel codice Canvas)

  // ---------- Icone Material ----------
  var P = {
    info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    vibration: "M0 15h2V9H0v6zm3 2h2V7H3v10zm19-8v6h2V9h-2zm-3 8h2V7h-2v10zM16.5 3h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM16 19H8V5h8v14z",
    touch: "M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    play: "M8 5v14l11-7z",
    del: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    delOut: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z",
    send: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",
    sparkle: "M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",
    made: "M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z",
    received: "M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z",
    widgets: "M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z",
    clean: "M16 11h-1V3c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v8H8c-2.76 0-5 2.24-5 5v7h18v-7c0-2.76-2.24-5-5-5zm3 10h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H9v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H5v-5c0-1.65 1.35-3 3-3h8c1.65 0 3 1.35 3 3v5z",
    check: "M9 16.17L4.83 12l-1.42 1.42L9 19 21 7l-1.41-1.41z"
  };
  function ic(name, size, color) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="' + (color || "currentColor") + '" d="' + P[name] + '"/></svg>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---------- Vibrazione (pattern Android → navigator.vibrate) ----------
  function toWeb(timings) { return timings[0] === 0 ? timings.slice(1) : [0].concat(timings); }
  var HAPTIC = {
    mosca: [0, 45, 30, 40, 25, 55, 35, 70, 40, 45, 25, 60, 30, 80, 50, 40, 30, 50],
    squash: [0, 90, 40, 160],
    schizzo: [0, 120, 50, 70, 40, 40],
    soffio: [0, 50, 45, 50, 45, 55, 45, 60, 50, 50],
    tick: [0, 25],
    glow: [0, 12],
    "💥": [0, 30, 20, 110], "❤️": [0, 80, 90, 120], "😈": [0, 60, 40, 65], "✨": [0, 35, 30, 40, 30, 45], "💨": [0, 50, 35, 75]
  };
  var REACTIONS = [
    ["💥", "Preso!", "Preso! 💥", "#FF5252"], ["❤️", "Amore", "Ti penso ❤️", "#FF4081"], ["😈", "Vendetta!", "Vendetta! 😈", "#E040FB"],
    ["✨", "Magico", "Magico! ✨", "#00E5FF"], ["💨", "Salto!", "Salto! 💨", "#00E676"]
  ];
  function hexA(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }

  // ---------- Layout generale ----------
  root.innerHTML =
    '<div class="nd-tabs"><button data-t="0" class="on">📱 Alex</button><button data-t="1">📱 Sam</button></div>' +
    '<div class="nd-pair"><div class="nd-slot" data-s="0"><div class="nd-cap"></div></div><div class="nd-slot" data-s="1"><div class="nd-cap"></div></div></div>' +
    '<p class="nd-note"></p>';
  var lang = function () { return document.body.dataset.lang === "it" ? "it" : "en"; };
  function capTexts() {
    var it = lang() === "it";
    root.querySelector('[data-s="0"] .nd-cap').textContent = it ? "Il tuo telefono (Alex)" : "Your phone (Alex)";
    root.querySelector('[data-s="1"] .nd-cap').textContent = it ? "Il telefono del partner (Sam)" : "Your partner's phone (Sam)";
    root.querySelector(".nd-note").textContent = it
      ? "Demo: i due telefoni sono simulati nella pagina, niente viene inviato. Su Android il telefono vibra con gli stessi ritmi dell'app."
      : "Demo: both phones are simulated on this page, nothing is sent. On Android your phone vibrates with the app's own patterns.";
  }
  capTexts();
  document.querySelectorAll(".lang").forEach(function (b) { b.addEventListener("click", function () { setTimeout(capTexts, 0); }); });

  var slots = root.querySelectorAll(".nd-slot"), tabs = root.querySelectorAll(".nd-tabs button");
  function showTab(i) {
    tabs.forEach(function (t) { t.classList.toggle("on", t.dataset.t == i); });
    slots.forEach(function (s) { s.classList.toggle("on", s.dataset.s == i); });
    if (window.__ndFit) window.__ndFit();
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { showTab(Number(t.dataset.t)); }); });
  showTab(0);

  // ---------- Telefono ----------
  function Phone(slot, me, partner, index) {
    var self = this;
    this.me = me; this.partner = partner; this.index = index; this.history = [];
    var sc = document.createElement("div"); sc.className = "nd-scaler";
    sc.innerHTML = '<div class="nd-phone"><div class="nd-screen">' +
      '<div class="nd-home"></div><div class="nd-layer"></div><div class="nd-sheetwrap"></div><div class="nd-banner"></div><div class="nd-snack"></div>' +
      '</div></div>';
    slot.appendChild(sc);
    this.scaler = sc; this.phone = sc.querySelector(".nd-phone");
    this.home = sc.querySelector(".nd-home"); this.layer = sc.querySelector(".nd-layer");
    this.sheetWrap = sc.querySelector(".nd-sheetwrap"); this.bannerEl = sc.querySelector(".nd-banner"); this.snackEl = sc.querySelector(".nd-snack");
    this.renderHome();
    this.fit = function () {
      var w = Math.min(360, slot.clientWidth || 360), s = w / PW;
      self.phone.style.transform = "scale(" + s + ")";
      sc.style.width = w + "px"; sc.style.height = (PH * s) + "px";
    };
  }
  var PP = Phone.prototype;

  PP.vibrate = function (android) {
    var web = toWeb(android);
    // la vibrazione reale avviene solo sul telefono che "riceve"
    try { if (navigator.vibrate) navigator.vibrate(web); } catch (e) {}
    // resa visiva della vibrazione sulla cornice
    var ph = this.phone, t = 0;
    web.forEach(function (d, i) {
      if (i % 2 === 0 && d > 0) {
        setTimeout(function () { ph.classList.add("buzz"); }, t);
        setTimeout(function () { ph.classList.remove("buzz"); }, t + d);
      }
      t += d;
    });
  };

  PP.snack = function (msg) {
    var el = this.snackEl;
    el.textContent = msg; el.classList.add("on");
    clearTimeout(this._snackT);
    this._snackT = setTimeout(function () { el.classList.remove("on"); }, 4000);
  };

  PP.addHistory = function (item) {
    item.id = Date.now() + Math.random(); item.ts = Date.now();
    this.history.unshift(item);
    this.renderHistory();
  };

  PP.renderHome = function () {
    var self = this;
    this.home.innerHTML =
      '<div class="nd-list">' +
      // Top bar
      '<div class="nd-top"><div class="nd-row"><div class="nd-orb"><span class="nd-orb-p"></span><span class="nd-dot g"></span><span class="nd-dot c"></span></div>' +
      '<div class="nd-idn"><div class="nd-row"><span class="nd-t1">NUDGE 1:1</span><span class="nd-sep"></span><span class="nd-t2">ONLINE</span></div><div class="nd-pname">' + esc(this.partner) + '</div></div></div>' +
      '<div class="nd-row"><button class="nd-ib" data-a="soon">' + ic("info", 18, "#38BDF8") + '</button><button class="nd-ib" data-a="soon">' + ic("settings", 18, "#94A3B8") + '</button><button class="nd-disc" data-a="soon">Scollega</button></div></div>' +
      // FGS
      '<div class="nd-fgs"><span class="nd-gdot"></span><span>Nudge in ascolto in background • Connessione in tempo reale attiva</span></div>' +
      // Section title
      '<div class="nd-sec"><span class="nd-bar"></span>SCEGLI IL TUO TRILLO</div>' +
      // Brivido hero
      '<div class="nd-card nd-hero" data-a="brivido"><div class="nd-hero-in"><div class="nd-row nd-sb"><div class="nd-hico">' + ic("vibration", 26, "#fff") + '</div><div class="nd-chip">⚡ RITMO APTICO</div></div>' +
      '<div class="nd-h22">Il Brivido</div><div class="nd-p13">Componi liberamente una sequenza di tap e pause. Il tuo partner la percepirà fedelmente sul proprio dispositivo in tempo reale.</div>' +
      '<button class="nd-btn nd-grad-coral" data-a="brivido">' + ic("touch", 18, "#fff") + '<span>Componi Ritmo</span></button></div></div>' +
      // Grid Mosca / Schizzo
      '<div class="nd-grid"><div class="nd-card nd-mini amber" data-a="mosca"><div class="nd-mini-in"><div class="nd-eico">🪰</div><div class="nd-h17">La Mosca</div><div class="nd-p11">Ronzio insistente ed overlay a schermo da scacciare.</div><button class="nd-btn2 nd-grad-amber" data-a="mosca">Invia Mosca</button></div></div>' +
      '<div class="nd-card nd-mini cyan" data-a="schizzo"><div class="nd-mini-in"><div class="nd-eico">🎨</div><div class="nd-h17">Lo Schizzo</div><div class="nd-p11">Imbratta lo schermo di vernice o fango da pulire.</div><button class="nd-btn2 nd-grad-cyan" data-a="schizzo">Scegli Colore</button></div></div></div>' +
      // Soffio
      '<div class="nd-card nd-wide violet" data-a="soffio"><div class="nd-wide-in viol"><div class="nd-eico w">💨</div><div class="nd-grow"><div class="nd-h17">Il Soffio</div><div class="nd-p12">Raffica improvvisa che fa sobbalzare il telefono sulla scrivania.</div></div><button class="nd-btn3 nd-grad-violet" data-a="soffio">Soffia!</button></div></div>' +
      // Glow
      '<div class="nd-card nd-wide glow" data-a="canvas"><div class="nd-wide-in cyn"><div class="nd-eico w c">✨</div><div class="nd-grow"><div class="nd-row"><span class="nd-h17">Glow Draw</span><span class="nd-neon">NEON</span></div><div class="nd-p12">Tratto neon effimero in tempo reale che svanisce in 6 secondi.</div></div><button class="nd-btn3 nd-grad-glow" data-a="canvas">Disegna</button></div></div>' +
      // Lab
      '<div class="nd-lab"><div class="nd-row"><span style="font-size:18px">🧪</span><span class="nd-labt">Laboratorio Test (Prova sul tuo telefono)</span></div>' +
      '<div class="nd-labp">Simula la ricezione di ciascun trillo per provarne la vibrazione e gli overlay visivi.</div>' +
      '<div class="nd-labrow"><button class="nd-ob" data-l="brivido">⚡ Brivido</button><button class="nd-ob" data-l="mosca">🪰 Mosca</button><button class="nd-ob" data-l="schizzo">🎨 Schizzo</button></div>' +
      '<div class="nd-labrow"><button class="nd-ob" data-l="soffio">💨 Soffio</button><button class="nd-ob" data-l="canvas">✨ Glow Draw</button><button class="nd-ob" data-l="reaction">💬 Reazione</button></div></div>' +
      // Widget
      '<div class="nd-widget"><div class="nd-wico">' + ic("widgets", 20, "#9D4EDD") + '</div><div class="nd-grow"><div class="nd-labt">Widget Homescreen 1-Tap</div><div class="nd-p11 s">Aggiungi il widget Glance per lanciare tutti e 4 i trilli direttamente dalla schermata home.</div></div></div>' +
      // History
      '<div class="nd-hhead"><span class="nd-htitle"></span><button class="nd-clear" data-a="clear">' + ic("delOut", 18, "#64748B") + '</button></div>' +
      '<div class="nd-hist"></div>' +
      '</div>';
    this.renderHistory();

    this.home.addEventListener("click", function (e) {
      var a = e.target.closest("[data-a],[data-l],[data-r],[data-replay]");
      if (!a) return;
      e.stopPropagation();
      if (a.dataset.l) return self.simulate(a.dataset.l);
      if (a.dataset.r) return self.historyReact(a);
      if (a.dataset.replay) { var h = self.history.find(function (x) { return String(x.id) === a.dataset.replay; }); if (h && h.pattern) self.vibrate(h.pattern); return; }
      switch (a.dataset.a) {
        case "brivido": return self.openRecorder();
        case "mosca": return self.sendMosca();
        case "schizzo": return self.openSchizzoPicker();
        case "soffio": return self.sendSoffio();
        case "canvas": return self.openGlowSheet();
        case "clear": self.history = []; self.renderHistory(); return self.snack("Storico trilli svuotato");
        case "soon": return self.snack(lang() === "it" ? "Disponibile nell'app completa." : "Available in the full app.");
      }
    });
  };

  function timeAgo(ts) { var m = Math.floor((Date.now() - ts) / 60000); return m + " min fa"; }
  var TYPE = { brivido: ["⚡", "Il Brivido"], mosca: ["🪰", "La Mosca"], schizzo: ["🎨", "Lo Schizzo"], soffio: ["💨", "Il Soffio"], canvas: ["✨", "Glow Draw"], reaction: ["💬", "Reazione Rapida"] };

  PP.renderHistory = function () {
    var h = this.history;
    this.home.querySelector(".nd-htitle").textContent = "STORICO TRILLI (" + h.length + ")";
    this.home.querySelector(".nd-clear").style.visibility = h.length ? "visible" : "hidden";
    var box = this.home.querySelector(".nd-hist");
    if (!h.length) {
      box.innerHTML = '<div class="nd-empty">Ancora nessun trillo scambiato.<br>Invia un Brivido, una Mosca o uno Schizzo!</div>';
      return;
    }
    box.innerHTML = h.map(function (it) {
      var t = TYPE[it.type], icon = it.type === "reaction" ? (it.emoji || "💬") : t[0];
      var detail = { brivido: "Pattern di " + Math.floor((it.pattern || []).length / 2) + " tocchi", schizzo: (it.schizzoType || "Vernice") + " " + (it.color || ""), mosca: "Ronzio persistente", soffio: "Raffica salto", canvas: "Tratto neon effimero", reaction: it.text || "Contro-reazione al volo" }[it.type];
      var sent = it.out;
      var html = '<div class="nd-hitem"><div class="nd-row">' +
        '<div class="nd-hdir ' + (sent ? "s" : "r") + '">' + ic(sent ? "made" : "received", 18, sent ? "#FF3366" : "#00F5D4") + '</div>' +
        '<div class="nd-grow"><div class="nd-row nd-sb"><span class="nd-hname">' + (sent ? "Inviato a " : "Ricevuto da ") + esc(it.contact) + '</span><span class="nd-hago">' + timeAgo(it.ts) + '</span></div>' +
        '<div class="nd-hdet">' + icon + " " + t[1] + " • " + esc(detail) + '</div></div>' +
        (it.type === "brivido" && it.pattern ? '<button class="nd-hplay" data-replay="' + it.id + '">' + ic("play", 18, "#FF6688") + '</button>' : "") +
        '</div>';
      if (!sent && it.type !== "reaction") {
        html += '<div class="nd-hreact" data-hid="' + it.id + '"><span>Rispondi:</span>' +
          [["💥", "Preso! 💥"], ["❤️", "Ti penso ❤️"], ["😈", "Vendetta! 😈"], ["✨", "Magico! ✨"]].map(function (r) {
            return '<button data-r="' + r[0] + '" data-rt="' + esc(r[1]) + '">' + r[0] + "</button>";
          }).join("") + "</div>";
      }
      return html + "</div>";
    }).join("");
  };

  PP.historyReact = function (btn) {
    var row = btn.closest(".nd-hreact");
    if (row.dataset.done) return;
    row.dataset.done = "1";
    this.sendReaction(btn.dataset.r, btn.dataset.rt);
  };

  // ---------- Invio verso il partner ----------
  PP.sendMosca = function () {
    this.addHistory({ type: "mosca", out: true, contact: this.partner });
    this.snack("🪰 Mosca inviata! Ronzerà sul suo telefono.");
    this.other.receive({ type: "mosca" });
  };
  PP.sendSoffio = function () {
    this.addHistory({ type: "soffio", out: true, contact: this.partner });
    this.snack("💨 Soffio inviato! Salto tattile sul suo telefono.");
    this.other.receive({ type: "soffio" });
  };
  PP.sendBrivido = function (pattern) {
    this.addHistory({ type: "brivido", out: true, contact: this.partner, pattern: pattern });
    this.snack("Brivido inviato al tuo partner!");
    this.other.receive({ type: "brivido", pattern: pattern });
  };
  PP.sendSchizzo = function (t, color) {
    this.addHistory({ type: "schizzo", out: true, contact: this.partner, schizzoType: t, color: color });
    this.snack("🎨 Schizzo inviato! Il suo schermo è imbrattato.");
    this.other.receive({ type: "schizzo", schizzoType: t, color: color });
  };
  PP.sendCanvas = function (points, color) {
    this.addHistory({ type: "canvas", out: true, contact: this.partner });
    this.snack("✨ Disegno al Neon inviato al tuo partner!");
    this.other.receive({ type: "canvas", points: points, color: color });
  };
  PP.sendReaction = function (emoji, text) {
    this.addHistory({ type: "reaction", out: true, contact: this.partner, emoji: emoji, text: text });
    this.snack("Reazione inviata: " + emoji);
    this.other.receive({ type: "reaction", emoji: emoji, text: text });
  };

  // ---------- Ricezione ----------
  PP.receive = function (d) {
    var self = this;
    setTimeout(function () {
      showTab(self.index);
      if (d.type !== "reaction") self.addHistory({ type: d.type, out: false, contact: self.partner, pattern: d.pattern, schizzoType: d.schizzoType, color: d.color });
      else self.addHistory({ type: "reaction", out: false, contact: self.partner, emoji: d.emoji, text: d.text });
      self.show(d, true);
    }, 600);
  };

  // Mostra l'effetto (ricezione reale o simulazione dal Laboratorio)
  PP.show = function (d, fromPartner) {
    var sender = fromPartner ? this.partner : this.partner;
    switch (d.type) {
      case "brivido": this.vibrate(d.pattern || [0, 150, 100, 200, 80, 320]); break;
      case "mosca": this.vibrate(HAPTIC.mosca); this.flyOverlay(fromPartner); break;
      case "schizzo": this.vibrate(HAPTIC.schizzo); this.schizzoOverlay(d.schizzoType || "VERNICE", d.color || "#00E5FF", fromPartner); break;
      case "soffio": this.vibrate(HAPTIC.soffio); this.phone.classList.remove("jump"); void this.phone.offsetWidth; this.phone.classList.add("jump"); break;
      case "canvas": this.vibrate(HAPTIC.tick); this.glowOverlay(d.points || "0.5,0.4;0.4,0.3;0.3,0.35;0.3,0.45;0.5,0.65;0.7,0.45;0.7,0.35;0.6,0.3;0.5,0.4", d.color || "#FF4B6E", sender, fromPartner); break;
      case "reaction": this.vibrate(HAPTIC[d.emoji] || HAPTIC.tick); this.reactionBanner(d.emoji || "❤️", d.text || "Ti penso ❤️", sender); break;
    }
  };

  // Laboratorio Test: stessa logica di simulateIncoming* dell'app
  PP.simulate = function (t) {
    var msg = {
      brivido: "Brivido test riprodotto sul dispositivo!",
      mosca: "🪰 Ronzio della mosca attivo! Toccala per prenderla.",
      schizzo: "🎨 Ricevuto uno Schizzo di VERNICE! Trascina per pulire.",
      soffio: "💨 Soffio ricevuto! Vibrazione salto.",
      canvas: "✨ Glow Draw test ricevuto!",
      reaction: "Reazione test: ❤️ Ti penso ❤️"
    }[t];
    this.snack(msg);
    this.show({ type: t }, false);
  };

  // ---------- Riga reazioni rapide ----------
  function reactionRow(title, onPick) {
    var el = document.createElement("div");
    el.className = "nd-qr";
    el.innerHTML = (title ? '<div class="nd-qrt">' + esc(title) + "</div>" : "") + '<div class="nd-qrr">' +
      REACTIONS.map(function (r) {
        return '<button style="background:' + hexA(r[3], 0.15) + ";border-color:" + hexA(r[3], 0.35) + '" data-e="' + r[0] + '" data-tx="' + esc(r[2]) + '"><span class="e">' + r[0] + "</span><span>" + r[1] + "</span></button>";
      }).join("") + "</div>";
    var done = false;
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || done) return;
      done = true; b.classList.add("pop");
      onPick(b.dataset.e, b.dataset.tx);
    });
    return el;
  }

  PP.clearLayer = function () { this.layer.innerHTML = ""; this.layer.classList.remove("on"); clearInterval(this._int); cancelAnimationFrame(this._raf); clearTimeout(this._to); };

  // ---------- Overlay: La Mosca ----------
  PP.flyOverlay = function (fromPartner) {
    var self = this; this.clearLayer();
    var L = this.layer; L.classList.add("on");
    L.innerHTML = '<div class="nd-fly-banner">🪰 Ronzio insistente! Tocca la mosca!</div><button class="nd-fly"><canvas width="46" height="46"></canvas></button><div class="nd-bottom"></div>';
    var fly = L.querySelector(".nd-fly"), cv = fly.querySelector("canvas"), g = cv.getContext("2d");
    var dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = 46 * dpr; cv.height = 46 * dpr; cv.style.width = cv.style.height = "46px";
    var W = PW, H = PH, x = W * 0.5, y = H * 0.4, squashed = false, off = 40 / DENS;
    function drawFly(p) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, 46, 46);
      var s = 46 / 16;
      function px(a, b, c) { g.fillStyle = c; g.fillRect(a * s, b * s, s + 0.2, s + 0.2); }
      var body = "#1E293B", eye = "#EF4444", wing = "rgba(147,197,253,0.85)", leg = "#0F172A";
      px(6, 4, eye); px(9, 4, eye); px(7, 4, body); px(8, 4, body); px(7, 5, body); px(8, 5, body);
      for (var i = 6; i <= 9; i++) { for (var j = 6; j <= 8; j++) px(i, j, body); for (var k = 9; k <= 12; k++) px(i, k, k % 2 === 0 ? body : "#334155"); }
      var w = p > 0.5 ? 0 : 1;
      [[4, 5], [5, 5], [3, 6], [4, 6], [5, 6], [4, 7]].forEach(function (q) { px(q[0] - w, q[1], wing); });
      [[10, 5], [11, 5], [10, 6], [11, 6], [12, 6], [11, 7]].forEach(function (q) { px(q[0] + w, q[1], wing); });
      px(5, 7, leg); px(10, 7, leg); px(4, 9, leg); px(11, 9, leg); px(5, 11, leg); px(10, 11, leg);
    }
    function place() { fly.style.transform = "translate(" + (x - off) + "px," + (y - off) + "px)"; }
    // traiettoria: prima X poi Y (come le animateTo sequenziali), con hovering
    var seg = null;
    function nextSeg(now) {
      var tx = W * 0.15 + Math.random() * W * 0.7, ty = H * 0.2 + Math.random() * H * 0.6, d = 700 + Math.random() * 700;
      seg = { t0: now, x0: x, y0: y, tx: tx, ty: ty, d: d, hover: 150 + Math.random() * 250 };
    }
    var t0 = performance.now();
    function frame(now) {
      if (squashed) return;
      drawFly(((now - t0) / 80) % 2 < 1 ? ((now - t0) / 80) % 1 : 1 - ((now - t0) / 80) % 1);
      if (!seg) nextSeg(now);
      var e = now - seg.t0;
      if (e < seg.d) x = seg.x0 + (seg.tx - seg.x0) * (e / seg.d);
      else if (e < seg.d * 2) { x = seg.tx; y = seg.y0 + (seg.ty - seg.y0) * ((e - seg.d) / seg.d); }
      else if (e < seg.d * 2 + seg.hover) { y = seg.ty; }
      else nextSeg(now);
      place();
      self._raf = requestAnimationFrame(frame);
    }
    place(); self._raf = requestAnimationFrame(frame);
    fly.addEventListener("click", function () {
      if (squashed) return; squashed = true;
      self.vibrate(HAPTIC.squash);
      fly.innerHTML = '<span style="font-size:42px;line-height:1">💥</span>';
      L.querySelector(".nd-fly-banner").textContent = "💥 SPLAT! Mosca scacciata!";
      self.snack("Presa! 💥 Mosca scacciata con successo.");
      var b = L.querySelector(".nd-bottom");
      b.appendChild(reactionRow("RISPONDI AL VOLO", function (e, t) { self.sendReaction(e, t); self.clearLayer(); }));
      var c = document.createElement("button"); c.className = "nd-tbtn"; c.textContent = "Chiudi";
      c.addEventListener("click", function () { self.clearLayer(); }); b.appendChild(c);
      self._to = setTimeout(function () { self.clearLayer(); }, 10000);
    });
  };

  // ---------- Overlay: Lo Schizzo ----------
  PP.schizzoOverlay = function (type, colorHex, fromPartner) {
    var self = this; this.clearLayer();
    var L = this.layer; L.classList.add("on");
    var col = type === "FANGO" ? "#5D4037" : colorHex;
    L.innerHTML = '<canvas class="nd-scv"></canvas>' +
      '<div class="nd-sch-head"><div class="nd-row nd-center">' + ic("clean", 20, "#38BDF8") + '<span class="nd-sch-t">Trascina il dito sullo schermo per pulire!</span></div>' +
      '<div class="nd-prog"><div></div></div><div class="nd-row nd-sb"><span class="nd-sch-p">Pulizia: 0%</span><button class="nd-sch-all">Pulisci Tutto</button></div></div><div class="nd-bottom"></div>';
    var cv = L.querySelector("canvas"), g = cv.getContext("2d"), dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.width = PW * dpr; cv.height = PH * dpr;
    var progress = 0, dist = 0, path = [], finished = false, shownRow = false, last = null;
    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, PW, PH);
      var a = Math.max(0.1, Math.min(0.92, 1 - progress));
      var cx = PW / 2, cy = PH * 0.45, r = PW * 0.38 * (1 - progress * 0.7);
      function circ(x, y, rr, al) { g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fillStyle = hexA(col, al); g.fill(); }
      circ(cx, cy, r, a);
      [[-0.8, -0.6, 0.35], [0.9, -0.4, 0.42], [-0.6, 0.7, 0.32], [0.5, 0.85, 0.38], [1.1, 0.3, 0.25], [-1.1, 0.1, 0.22]].forEach(function (s) { circ(cx + r * s[0], cy + r * s[1], r * s[2], a * 0.9); });
      var dw = r * 0.25; g.fillStyle = hexA(col, a);
      g.beginPath(); if (g.roundRect) g.roundRect(cx - dw / 2, cy + r * 0.5, dw, r * 0.9, dw / 2); else g.rect(cx - dw / 2, cy + r * 0.5, dw, r * 0.9); g.fill();
      if (path.length > 1) {
        g.strokeStyle = "rgba(20,16,38,0.8)"; g.lineWidth = 70 / DENS; g.lineCap = "round";
        for (var i = 0; i < path.length - 1; i++) { if (path[i + 1].brk) continue; g.beginPath(); g.moveTo(path[i].x, path[i].y); g.lineTo(path[i + 1].x, path[i + 1].y); g.stroke(); }
      }
    }
    function update() {
      L.querySelector(".nd-prog div").style.width = (progress * 100) + "%";
      L.querySelector(".nd-sch-p").textContent = "Pulizia: " + Math.floor(progress * 100) + "%";
      if (finished) L.querySelector(".nd-sch-t").textContent = "✨ Schermo pulito a lucido!";
      if ((finished || progress >= 0.75) && !shownRow) {
        shownRow = true;
        var b = L.querySelector(".nd-bottom");
        b.appendChild(reactionRow("RISPONDI AL VOLO", function (e, t) { self.sendReaction(e, t); done(); }));
      }
      if (finished && !L.querySelector(".nd-tbtn")) {
        var c = document.createElement("button"); c.className = "nd-tbtn"; c.textContent = "Fatto";
        c.addEventListener("click", done); L.querySelector(".nd-bottom").appendChild(c);
        self._to = setTimeout(done, 10000);
      }
      draw();
    }
    function done() { self.snack("✨ Schermo pulito a lucido!"); self.clearLayer(); }
    function pos(e) { var r = cv.getBoundingClientRect(), s = r.width / PW; return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s }; }
    var dragging = false, lastTick = 0;
    cv.addEventListener("pointerdown", function (e) { dragging = true; last = pos(e); path.push({ x: last.x, y: last.y, brk: true }); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", function (e) {
      if (!dragging) return; var p = pos(e);
      dist += Math.hypot(p.x - last.x, p.y - last.y); last = p; path.push(p);
      var now = performance.now(); if (now - lastTick > 90) { lastTick = now; try { navigator.vibrate && navigator.vibrate(25); } catch (x) {} }
      progress = Math.min(1, dist / (1600 / DENS));
      if (progress >= 0.85 && !finished) finished = true;
      update();
    });
    ["pointerup", "pointercancel"].forEach(function (ev) { cv.addEventListener(ev, function () { dragging = false; }); });
    L.querySelector(".nd-sch-all").addEventListener("click", function () { progress = 1; finished = true; update(); });
    draw();
  };

  // ---------- Overlay: Glow Draw ----------
  function parseStrokes(raw) {
    return raw.split("|").map(function (s) { return s.split(";").map(function (p) { var q = p.split(","); return [parseFloat(q[0]), parseFloat(q[1])]; }).filter(function (q) { return !isNaN(q[0]); }); }).filter(function (s) { return s.length; });
  }
  function neon(g, strokes, w, h, color, pulse, widths) {
    strokes.forEach(function (pts) {
      if (pts.length < 2) {
        if (pts.length === 1) { var x = pts[0][0] * w, y = pts[0][1] * h; g.beginPath(); g.arc(x, y, widths[3], 0, 7); g.fillStyle = hexA(color, 0.4 * pulse); g.fill(); g.beginPath(); g.arc(x, y, widths[4], 0, 7); g.fillStyle = "#fff"; g.fill(); }
        return;
      }
      g.lineCap = "round"; g.lineJoin = "round";
      [[hexA(color, (widths[5] || 0.35) * pulse), widths[0] * (widths[6] ? pulse : 1)], [hexA(color, 0.85), widths[1]], ["#fff", widths[2]]].forEach(function (L) {
        g.beginPath(); g.moveTo(pts[0][0] * w, pts[0][1] * h);
        for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0] * w, pts[i][1] * h);
        g.strokeStyle = L[0]; g.lineWidth = L[1]; g.stroke();
      });
    });
  }
  PP.glowOverlay = function (points, color, sender, fromPartner) {
    var self = this; this.clearLayer();
    var L = this.layer; L.classList.add("on");
    L.innerHTML = '<div class="nd-glow-bg"></div><canvas class="nd-gcv"></canvas>' +
      '<div class="nd-glow-head"><div class="nd-row nd-sb"><div class="nd-row"><div class="nd-gico" style="background:' + hexA(color, 0.25) + '">' + ic("sparkle", 18, color) + '</div>' +
      '<div><div class="nd-glow-t">✨ Glow Draw da ' + esc(sender) + '</div><div class="nd-glow-s">Tratto effimero • Svanisce tra poco</div></div></div>' +
      '<button class="nd-gx">' + ic("close", 16, "#CBD5E1") + '</button></div><div class="nd-gprog"><div style="background:' + color + '"></div></div></div><div class="nd-bottom g"></div>';
    var cv = L.querySelector("canvas"), g = cv.getContext("2d"), dpr = Math.min(3, window.devicePixelRatio || 1);
    var CW = PW - 48, CH = PH - 160; cv.width = CW * dpr; cv.height = CH * dpr;
    var strokes = parseStrokes(points), t0 = performance.now(), total = 10000, bar = L.querySelector(".nd-gprog div");
    function frame(now) {
      var e = now - t0, ph = (e / 900) % 2, p = ph < 1 ? ph : 2 - ph, pulse = 0.7 + 0.3 * p;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, CW, CH);
      neon(g, strokes, CW, CH, color, pulse, [30 / DENS, 12 / DENS, 4 / DENS, 22 / DENS, 6 / DENS, 0.35, 1]);
      bar.style.width = Math.max(0, 1 - e / total) * 100 + "%";
      if (e >= total) return self.clearLayer();
      self._raf = requestAnimationFrame(frame);
    }
    self._raf = requestAnimationFrame(frame);
    L.querySelector(".nd-gx").addEventListener("click", function () { self.clearLayer(); });
    L.querySelector(".nd-bottom").appendChild(reactionRow("REAGISCI AL VOLO A " + sender, function (e, t) { self.sendReaction(e, t); self.clearLayer(); }));
  };

  // ---------- Banner reazione ----------
  PP.reactionBanner = function (emoji, text, sender) {
    var self = this, B = this.bannerEl;
    B.innerHTML = '<div class="nd-rb"><div class="nd-rbe">' + emoji + '</div><div class="nd-grow"><div class="nd-rbs">Reazione da ' + esc(sender) + '</div><div class="nd-rbt">' + esc(text) + '</div></div><button class="nd-rbx">' + ic("close", 16, "#A5B4FC") + "</button></div>";
    requestAnimationFrame(function () { B.classList.add("on"); });
    function hide() { B.classList.remove("on"); }
    B.querySelector(".nd-rb").addEventListener("click", hide);
    clearTimeout(this._bT); this._bT = setTimeout(hide, 7000);
  };

  // ---------- Bottom sheets ----------
  PP.openSheet = function (html) {
    var self = this, W = this.sheetWrap;
    W.innerHTML = '<div class="nd-scrim"></div><div class="nd-sheet">' + html + "</div>";
    requestAnimationFrame(function () { W.classList.add("on"); });
    W.querySelector(".nd-scrim").addEventListener("click", function () { self.closeSheet(); });
    return W.querySelector(".nd-sheet");
  };
  PP.closeSheet = function () { var W = this.sheetWrap; W.classList.remove("on"); setTimeout(function () { W.innerHTML = ""; }, 300); };

  // Il Brivido: registrazione del ritmo (PatternRecorder)
  PP.openRecorder = function () {
    var self = this, taps = [], cur = null;
    var S = this.openSheet(
      '<div class="nd-sh" style="padding:24px"><div class="nd-row nd-sb"><div><div class="nd-shT coral">Il Brivido</div><div class="nd-shS">Registra il ritmo per ' + esc(this.partner) + '</div></div><button class="nd-x">' + ic("close", 24, "#94A3B8") + "</button></div>" +
      '<div class="nd-tl"></div><div class="nd-row nd-sb nd-stats"><div class="nd-row"><span class="nd-cdot"></span><span class="nd-cnt">Pronto alla cattura</span></div><span class="nd-dur">0.00 s</span></div>' +
      '<div class="nd-padbox"><div class="nd-ring r1"></div><div class="nd-ring r2"></div><div class="nd-pad"><div class="nd-padi">' + ic("touch", 42, "#FF6688") + '</div><div class="nd-padt">TIENI PREMUTO</div><div class="nd-pads">Batti il tuo ritmo</div></div></div>' +
      '<div class="nd-row nd-g10"><button class="nd-o2" data-k="prev" disabled>' + ic("play", 18) + '<span>Riascolta</span></button><button class="nd-o2" data-k="clr" disabled>' + ic("del", 18) + '<span>Cancella</span></button></div>' +
      '<button class="nd-sendb" data-k="send" disabled>' + ic("send", 18) + "<span>Invia Brivido a " + esc(this.partner) + "</span></button></div>");
    function waveform() {
      var c = taps.filter(function (t) { return t.up > t.down; }); if (!c.length) return [];
      var w = [0]; c.forEach(function (t, i) { w.push(t.up - t.down); if (i < c.length - 1) w.push(Math.max(20, c[i + 1].down - t.up)); }); return w;
    }
    function refresh() {
      var w = waveform(), n = taps.length;
      var tl = S.querySelector(".nd-tl");
      if (!n) tl.innerHTML = '<div class="nd-row nd-g8"><span class="nd-pdot"></span><span class="nd-tlh">Tocca e tieni premuto il pad per comporre il ritmo...</span></div>';
      else tl.innerHTML = '<div class="nd-row nd-center">' + w.map(function (d, i) {
        if (i % 2 === 1) return '<span class="nd-seg" style="width:' + Math.max(8, Math.min(70, Math.floor(d / 20))) + 'px"></span>';
        if (i > 0) return '<span style="width:' + Math.max(4, Math.min(24, Math.floor(d / 35))) + 'px;flex-shrink:0"></span>';
        return "";
      }).join("") + "</div>";
      var dur = n ? ((taps[n - 1].up || taps[n - 1].down) - taps[0].down) / 1000 : 0;
      S.querySelector(".nd-cnt").textContent = n ? n + " tocchi registrati" : "Pronto alla cattura";
      S.querySelector(".nd-cnt").classList.toggle("on", !!n);
      S.querySelector(".nd-cdot").style.display = n ? "inline-block" : "none";
      S.querySelector(".nd-dur").textContent = dur.toFixed(2) + " s";
      S.querySelectorAll("[data-k]").forEach(function (b) { b.disabled = !n; });
      S.querySelector(".nd-sendb").classList.toggle("on", !!n);
    }
    refresh();
    var pad = S.querySelector(".nd-pad"), box = S.querySelector(".nd-padbox");
    pad.addEventListener("pointerdown", function (e) {
      e.preventDefault(); pad.setPointerCapture(e.pointerId);
      cur = { down: Date.now(), up: 0 }; taps.push(cur);
      box.classList.add("on"); S.querySelector(".nd-padt").textContent = "REGISTRAZIONE...";
      try { navigator.vibrate && navigator.vibrate(25); } catch (x) {}
    });
    function up() {
      if (!cur) return;
      cur.up = cur.down + Math.max(40, Date.now() - cur.down); cur = null;
      box.classList.remove("on"); S.querySelector(".nd-padt").textContent = "TIENI PREMUTO";
      try { navigator.vibrate && navigator.vibrate(25); } catch (x) {}
      refresh();
    }
    pad.addEventListener("pointerup", up); pad.addEventListener("pointercancel", up);
    S.querySelector(".nd-x").addEventListener("click", function () { self.closeSheet(); });
    S.querySelector('[data-k="prev"]').addEventListener("click", function () { var w = waveform(); if (w.length) self.vibrate(w); });
    S.querySelector('[data-k="clr"]').addEventListener("click", function () { taps = []; refresh(); });
    S.querySelector('[data-k="send"]').addEventListener("click", function () { var w = waveform(); if (!w.length) return; self.closeSheet(); self.sendBrivido(w); });
  };

  // Lo Schizzo: scelta consistenza e colore
  PP.openSchizzoPicker = function () {
    var self = this, type = "VERNICE", color = "#00E5FF";
    var COLORS = ["#00E5FF", "#FF1493", "#76FF03", "#FFEA00", "#A855F7"];
    var S = this.openSheet('<div class="nd-sh" style="padding:20px 22px"><div class="nd-row nd-sb"><div><div class="nd-shT w20">🎨 Lancia uno Schizzo</div><div class="nd-shS s12">Sporca lo schermo di ' + esc(this.partner) + '! Dovrà pulirlo con il dito.</div></div><button class="nd-x">' + ic("close", 24, "#64748B") + "</button></div>" +
      '<div class="nd-lbl">SCEGLI LA CONSISTENZA</div><div class="nd-row nd-g12"><button class="nd-opt" data-t="VERNICE"><span class="e">🎨</span><b>Vernice Fresca</b><i>Colorata e lucida</i></button><button class="nd-opt" data-t="FANGO"><span class="e">💩</span><b>Fango Denso</b><i>Marrone viscoso</i></button></div>' +
      '<div class="nd-colsec"><div class="nd-lbl">COLORE VERNICE</div><div class="nd-row nd-sb nd-cols">' + COLORS.map(function (c) { return '<button class="nd-col" data-c="' + c + '" style="background:' + c + '"></button>'; }).join("") + "</div></div>" +
      '<button class="nd-spara">' + ic("send", 18, "#fff") + "<span>Spara Schizzo!</span></button></div>");
    function refresh() {
      S.querySelectorAll(".nd-opt").forEach(function (o) {
        var on = o.dataset.t === type; o.classList.toggle("on", on);
        o.style.borderColor = on ? (type === "FANGO" ? "#8D6E63" : "#00E5FF") : "";
      });
      S.querySelector(".nd-colsec").style.display = type === "VERNICE" ? "block" : "none";
      S.querySelectorAll(".nd-col").forEach(function (c) { var on = c.dataset.c === color; c.classList.toggle("on", on); c.innerHTML = on ? ic("check", 22, "#000") : ""; });
      S.querySelector(".nd-spara").style.background = type === "FANGO" ? "#6D4C41" : color;
    }
    refresh();
    S.querySelectorAll(".nd-opt").forEach(function (o) { o.addEventListener("click", function () { type = o.dataset.t; if (type === "FANGO") color = "#5D4037"; else if (color === "#5D4037") color = "#00E5FF"; refresh(); }); });
    S.querySelectorAll(".nd-col").forEach(function (c) { c.addEventListener("click", function () { color = c.dataset.c; refresh(); }); });
    S.querySelector(".nd-x").addEventListener("click", function () { self.closeSheet(); });
    S.querySelector(".nd-spara").addEventListener("click", function () { self.closeSheet(); self.sendSchizzo(type, color); });
  };

  // Glow Draw: disegno al neon
  PP.openGlowSheet = function () {
    var self = this;
    var PAL = [["#00E5FF", "#00F0FF"], ["#FF4B6E", "#FF3366"], ["#FFB300", "#FFB703"], ["#00E676", "#00F5D4"], ["#A855F7", "#9D4EDD"]];
    var sel = PAL[0], strokes = [], cur = null;
    var S = this.openSheet('<div class="nd-sh" style="padding:18px 20px"><div class="nd-row nd-sb"><div class="nd-row"><div class="nd-gico2"></div><div><div class="nd-shT w17">Glow Draw ✨</div><div class="nd-shS s12">Disegna per ' + esc(this.partner) + ' • Svanirà in 6 secondi</div></div></div><button class="nd-x2">' + ic("close", 16, "#94A3B8") + "</button></div>" +
      '<div class="nd-row nd-se nd-pal">' + PAL.map(function (p, i) { return '<button class="nd-pc" data-i="' + i + '" style="background:' + p[1] + '"></button>'; }).join("") + "</div>" +
      '<div class="nd-dbox"><canvas></canvas><div class="nd-dh">Disegna qualcosa con il dito ✨<br>Un cuore, una parola o un simbolo</div></div>' +
      '<div class="nd-row nd-g10"><button class="nd-o3" data-k="clr" disabled>' + ic("del", 16) + '<span>Cancella</span></button><button class="nd-gsend" data-k="send" disabled>' + ic("send", 16, "#000") + "<span>Invia al Neon ✨</span></button></div></div>");
    var box = S.querySelector(".nd-dbox"), cv = box.querySelector("canvas"), g = cv.getContext("2d"), dpr = Math.min(3, window.devicePixelRatio || 1);
    var CW = PW - 40, CH = 290; cv.width = CW * dpr; cv.height = CH * dpr;
    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, CW, CH);
      var all = strokes.concat(cur ? [cur] : []);
      neon(g, all, CW, CH, sel[1], 1, [24 / DENS, 10 / DENS, 3.5 / DENS, 14 / DENS, 5 / DENS, 0.32, 0]);
      S.querySelector(".nd-dh").style.display = all.length ? "none" : "block";
      var has = strokes.reduce(function (a, s) { return a + s.length; }, 0) > 0;
      S.querySelectorAll("[data-k]").forEach(function (b) { b.disabled = !has; });
    }
    function refresh() {
      S.querySelectorAll(".nd-pc").forEach(function (b) { b.classList.toggle("on", PAL[b.dataset.i] === sel); });
      S.querySelector(".nd-gico2").style.background = hexA(sel[1], 0.2);
      S.querySelector(".nd-gico2").innerHTML = ic("sparkle", 20, sel[1]);
      box.style.borderColor = hexA(sel[1], 0.4);
      S.querySelector(".nd-gsend").style.background = sel[1];
      draw();
    }
    refresh();
    function pos(e) { var r = cv.getBoundingClientRect(); return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))]; }
    var lastTick = 0;
    cv.addEventListener("pointerdown", function (e) { e.preventDefault(); cv.setPointerCapture(e.pointerId); cur = [pos(e)]; draw(); });
    cv.addEventListener("pointermove", function (e) {
      if (!cur) return; cur.push(pos(e)); draw();
      var now = performance.now(); if (now - lastTick > 60) { lastTick = now; try { navigator.vibrate && navigator.vibrate(12); } catch (x) {} }
    });
    function end() { if (cur && cur.length) strokes.push(cur); cur = null; draw(); }
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    S.querySelectorAll(".nd-pc").forEach(function (b) { b.addEventListener("click", function () { sel = PAL[b.dataset.i]; refresh(); }); });
    S.querySelector(".nd-x2").addEventListener("click", function () { self.closeSheet(); });
    S.querySelector('[data-k="clr"]').addEventListener("click", function () { strokes = []; draw(); });
    S.querySelector('[data-k="send"]').addEventListener("click", function () {
      var ser = strokes.map(function (s) { return s.map(function (p) { return p[0].toFixed(3) + "," + p[1].toFixed(3); }).join(";"); }).join("|");
      self.closeSheet(); self.sendCanvas(ser, sel[0]);
    });
  };

  // ---------- Avvio ----------
  var alex = new Phone(slots[0], "Alex", "Sam", 0);
  var sam = new Phone(slots[1], "Sam", "Alex", 1);
  alex.other = sam; sam.other = alex;
  function fitAll() { alex.fit(); sam.fit(); }
  window.__ndFit = fitAll;
  window.addEventListener("resize", fitAll); fitAll();
  setInterval(function () { alex.renderHistory(); sam.renderHistory(); }, 60000);
})();
