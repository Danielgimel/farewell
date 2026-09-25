(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.selfie = function (container, config, onComplete) {
    var target = config.target || 3;
    var zoneWidth = config.zoneWidth || 22;
    var speedMs = config.speedMs || 1300;
    var label = config.label || "📸 צלם!";
    var finalMessage = config.message || "ויראלי! 🔥";

    var score = 0;
    var finished = false;
    var currentPos = 0;
    var zoneLeft = 50 - zoneWidth / 2;
    var startTime = null;

    container.innerHTML =
      '<div class="selfie-wrap">' +
      '<div class="selfie-emoji" id="selfieEmoji">🤳</div>' +
      '<div class="selfie-track" id="selfieTrack">' +
      '<div class="selfie-zone" id="selfieZone"></div>' +
      '<div class="selfie-marker" id="selfieMarker"></div>' +
      "</div>" +
      '<div class="grow-counter" id="selfieCounter">0 / ' + target + " 📸</div>" +
      '<div class="grow-counter" id="selfieMsg">חכה שהסמן ייכנס לאזור המסומן, ואז תצלם</div>' +
      '<button class="btn" id="selfieBtn" type="button">' + label + "</button>" +
      "</div>";

    var zoneEl = container.querySelector("#selfieZone");
    var markerEl = container.querySelector("#selfieMarker");
    var counterEl = container.querySelector("#selfieCounter");
    var msgEl = container.querySelector("#selfieMsg");
    var btn = container.querySelector("#selfieBtn");
    var emojiEl = container.querySelector("#selfieEmoji");

    function placeZone() {
      zoneLeft = 8 + Math.random() * (92 - zoneWidth - 8);
      zoneEl.style.left = zoneLeft + "%";
      zoneEl.style.width = zoneWidth + "%";
    }
    placeZone();

    function loop(now) {
      if (finished) return;
      if (startTime === null) startTime = now;
      var t = (now - startTime) % speedMs;
      var phase = t / speedMs;
      currentPos = phase < 0.5 ? phase * 2 * 100 : (1 - phase) * 2 * 100;
      markerEl.style.left = currentPos + "%";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    btn.addEventListener("click", function () {
      if (finished) return;
      var hit = currentPos >= zoneLeft && currentPos <= zoneLeft + zoneWidth;

      if (hit) {
        score++;
        msgEl.textContent = "🔥 מושלם! זה הולך ישר לסטורי";
        emojiEl.classList.remove("flash");
        void emojiEl.offsetWidth;
        emojiEl.classList.add("flash");
        placeZone();
      } else {
        msgEl.textContent = "📷 כמעט... נסה שוב";
      }

      counterEl.textContent = score + " / " + target + " 📸";

      if (score >= target) {
        finished = true;
        msgEl.textContent = finalMessage;
        btn.disabled = true;
        setTimeout(onComplete, 800);
      }
    });
  };
})();
