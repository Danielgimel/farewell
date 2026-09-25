(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.economy = function (container, config, onComplete) {
    var target = config.cycles || 4;
    var zoneWidth = config.zoneWidth || 24;
    var speedMs = config.speedMs || 1500;
    var finalMessage = config.message || "המשק פורח! 📈";

    var phase = "buy";
    var cycles = 0;
    var finished = false;
    var currentPos = 0;
    var startTime = null;

    container.innerHTML =
      '<div class="selfie-emoji" id="ecoEmoji">💹</div>' +
      '<div class="selfie-track" id="ecoTrack">' +
      '<div class="selfie-zone" id="ecoZone"></div>' +
      '<div class="selfie-marker" id="ecoMarker"></div>' +
      "</div>" +
      '<div class="grow-counter" id="ecoCounter">0 / ' + target + " עסקאות רווחיות</div>" +
      '<div class="grow-counter" id="ecoMsg">המחיר בשפל - חכו לאזור הירוק ואז קנו</div>' +
      '<button class="btn" id="ecoBtn" type="button">💵 קנה!</button>';

    var zoneEl = container.querySelector("#ecoZone");
    var markerEl = container.querySelector("#ecoMarker");
    var counterEl = container.querySelector("#ecoCounter");
    var msgEl = container.querySelector("#ecoMsg");
    var btn = container.querySelector("#ecoBtn");
    var emojiEl = container.querySelector("#ecoEmoji");

    function applyZone() {
      if (phase === "buy") {
        zoneEl.style.left = "0%";
        zoneEl.style.width = zoneWidth + "%";
        btn.textContent = "💵 קנה!";
        msgEl.textContent = "המחיר בשפל - חכו לאזור הירוק ואז קנו";
      } else {
        zoneEl.style.left = (100 - zoneWidth) + "%";
        zoneEl.style.width = zoneWidth + "%";
        btn.textContent = "💰 מכור!";
        msgEl.textContent = "המחיר בשיא - חכו לאזור הירוק ואז מכרו";
      }
    }
    applyZone();

    function loop(now) {
      if (finished) return;
      if (startTime === null) startTime = now;
      var t = (now - startTime) % speedMs;
      var p = t / speedMs;
      currentPos = p < 0.5 ? p * 2 * 100 : (1 - p) * 2 * 100;
      markerEl.style.left = currentPos + "%";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    btn.addEventListener("click", function () {
      if (finished) return;

      var inZone = phase === "buy" ? currentPos <= zoneWidth : currentPos >= 100 - zoneWidth;

      if (!inZone) {
        msgEl.textContent = phase === "buy" ? "עוד לא מספיק זול..." : "עוד לא מספיק גבוה...";
        return;
      }

      emojiEl.classList.remove("flash");
      void emojiEl.offsetWidth;
      emojiEl.classList.add("flash");

      if (phase === "buy") {
        phase = "sell";
        applyZone();
        msgEl.textContent = "✅ קניתם בזול! עכשיו חכו למכירה";
      } else {
        cycles++;
        counterEl.textContent = cycles + " / " + target + " עסקאות רווחיות";
        phase = "buy";

        if (cycles >= target) {
          finished = true;
          msgEl.textContent = finalMessage;
          btn.disabled = true;
          setTimeout(onComplete, 800);
          return;
        }

        applyZone();
        msgEl.textContent = "💰 מכרתם ברווח! עכשיו חכו לקנייה הבאה";
      }
    });
  };
})();
