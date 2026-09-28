/* Pixel Fishing — il gioco Unity vero (build WebGL), caricato solo quando l'utente preme Play. */
(function () {
  var root = document.getElementById("demo-pixelfishing");
  if (!root) return;
  var it = function () { return document.body.dataset.lang === "it"; };
  root.innerHTML =
    '<div class="pf-frame">' +
      '<button class="pf-start" type="button">' +
        '<img src="pixelfishing-1.jpg" alt="Pixel Fishing">' +
        '<span class="pf-play">▶ <b class="pf-lbl"></b></span>' +
        '<span class="pf-size"></span>' +
      '</button>' +
    '</div>' +
    '<a class="pf-full" href="pixel-fishing-play/" target="_blank" rel="noopener"></a>';
  function texts() {
    root.querySelector(".pf-lbl").textContent = it() ? "Gioca" : "Play";
    root.querySelector(".pf-size").textContent = it() ? "circa 40 MB" : "about 40 MB";
    root.querySelector(".pf-full").textContent = it() ? "Apri a schermo intero ↗" : "Open fullscreen ↗";
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
