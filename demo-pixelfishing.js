/* Pixel Fishing — il gioco Unity vero (build WebGL), caricato solo quando l'utente preme Play. */
(function () {
  var root = document.getElementById("demo-pixelfishing");
  if (!root) return;
  var it = function () { return document.body.dataset.lang === "it"; };
  root.innerHTML =
    '<div class="pf-frame">' +
      '<button class="pf-start" type="button">' +
        '<img src="pixelfishing-cover.jpg" alt="Pixel Fishing">' +
        '<span class="pf-play">▶ <b class="pf-lbl"></b></span>' +
        '<span class="pf-size"></span>' +
      '</button>' +
    '</div>' +
    '<a class="pf-full" href="pixel-fishing-play/" target="_blank" rel="noopener"></a>';
  function texts() {
    var lbl = root.querySelector(".pf-lbl"), size = root.querySelector(".pf-size");
    if (lbl) lbl.textContent = it() ? "Gioca" : "Play";
    if (size) size.textContent = it() ? "circa 40 MB" : "about 40 MB";
    var full = root.querySelector(".pf-full");
    full.textContent = it() ? "Apri a schermo intero ↗" : "Open fullscreen ↗";
    full.href = "pixel-fishing-play/?lang=" + (it() ? "it" : "en");
  }
  texts();
  document.querySelectorAll(".lang").forEach(function (b) { b.addEventListener("click", function () { setTimeout(texts, 0); }); });
  root.querySelector(".pf-start").addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "pixel-fishing-play/";
    f.title = "Pixel Fishing";
    f.allow = "fullscreen; autoplay";
    root.querySelector(".pf-frame").innerHTML = "";
    root.querySelector(".pf-frame").appendChild(f);
  });
})();
