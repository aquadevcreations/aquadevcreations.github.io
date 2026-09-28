// Lingua: italiano se il browser è in italiano, altrimenti inglese. Forzabile con ?lang=it / ?lang=en
(function () {
  var q = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  var lang = q || saved || ((navigator.language || "en").toLowerCase().indexOf("it") === 0 ? "it" : "en");
  function set(l) {
    document.body.dataset.lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll(".lang").forEach(function (b) { b.textContent = l === "it" ? "EN" : "IT"; });
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  set(lang);
  document.querySelectorAll(".lang").forEach(function (b) {
    b.addEventListener("click", function () { set(document.body.dataset.lang === "it" ? "en" : "it"); });
  });
  document.querySelectorAll(".year").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();

// Pulsante "Copia indirizzo"
document.querySelectorAll("[data-copy]").forEach(function (b) {
  b.addEventListener("click", function () {
    var txt = b.getAttribute("data-copy");
    var done = function () {
      var old = b.innerHTML;
      b.textContent = document.body.dataset.lang === "it" ? "Copiato ✓" : "Copied ✓";
      setTimeout(function () { b.innerHTML = old; }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { prompt("Email:", txt); });
    else prompt("Email:", txt);
  });
});

// Contatore visite (GoatCounter). Resta nascosto finché il contatore pubblico non è attivo.
(function () {
  var s = document.querySelector("script[data-goatcounter]");
  var els = document.querySelectorAll(".visits");
  if (!s || !els.length) return;
  var base = s.getAttribute("data-goatcounter").replace(/\/count$/, "");
  fetch(base + "/counter/TOTAL.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d || !d.count) return;
    els.forEach(function (el) { el.querySelector(".visits-n").textContent = d.count; el.hidden = false; });
  }).catch(function () {});
})();

// Su telefono porta in vista la voce di menu attiva
(function () {
  var a = document.querySelector(".side nav a.active");
  if (a && window.innerWidth <= 820) a.scrollIntoView({ inline: "center", block: "nearest" });
})();
