(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.amen = function (container, config, onComplete) {
    var target = config.rounds || 5;
    var minDelay = config.minDelay || 800;
    var maxDelay = config.maxDelay || 2200;
    var validWindow = config.validWindow || 1300;
    var label = config.label || "אמן!";
    var finalMessage = config.message || "אמן אמן! 🙏";

    var hits = 0;
    var finished = false;
    var waitingForTap = false;
    var timer = null;

    container.innerHTML =
      '<div class="amen-wrap">' +
      '<div class="amen-prompt" id="amenPrompt">🤫 מחכים לברכה...</div>' +
      '<div class="progress-bar"><div id="amenProgress"></div></div>' +
      '<div class="grow-counter" id="amenCounter">0 / ' + target + "</div>" +
      '<button class="btn grow-tap-btn" id="amenBtn" type="button">' + label + "</button>" +
      "</div>";

    var promptEl = container.querySelector("#amenPrompt");
    var progressEl = container.querySelector("#amenProgress");
    var counterEl = container.querySelector("#amenCounter");
    var btn = container.querySelector("#amenBtn");

    function scheduleRound() {
      if (finished) return;
      waitingForTap = false;
      promptEl.classList.remove("amen-ready");
      promptEl.textContent = "🤫 מחכים לברכה...";

      var delay = minDelay + Math.random() * (maxDelay - minDelay);
      timer = setTimeout(function () {
        if (finished) return;
        waitingForTap = true;
        promptEl.classList.add("amen-ready");
        promptEl.textContent = "🙏 ברכה! עכשיו!";

        timer = setTimeout(function () {
          if (finished || !waitingForTap) return;
          waitingForTap = false;
          promptEl.classList.remove("amen-ready");
          promptEl.textContent = "פספסת... בואו שוב";
          setTimeout(scheduleRound, 500);
        }, validWindow);
      }, delay);
    }

    btn.addEventListener("click", function () {
      if (finished) return;

      if (!waitingForTap) {
        promptEl.classList.add("amen-early");
        promptEl.textContent = "מוקדם מדי... 😅";
        setTimeout(function () { promptEl.classList.remove("amen-early"); }, 300);
        return;
      }

      clearTimeout(timer);
      waitingForTap = false;
      hits++;

      progressEl.style.width = Math.round((hits / target) * 100) + "%";
      counterEl.textContent = hits + " / " + target;
      promptEl.classList.remove("amen-ready");
      promptEl.textContent = "✅ אמן!";

      if (hits >= target) {
        finished = true;
        promptEl.textContent = finalMessage;
        btn.disabled = true;
        setTimeout(onComplete, 800);
      } else {
        setTimeout(scheduleRound, 600);
      }
    });

    scheduleRound();
  };
})();
