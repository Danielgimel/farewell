(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.campaign = function (container, config, onComplete) {
    var frontNames = config.fronts && config.fronts.length
      ? config.fronts
      : ["חזית צפון", "חזית מרכז", "חזית דרום"];
    var duration = config.durationSec || 20;
    var decayPerSec = config.decayPerSec || 7;
    var boost = config.boost || 30;
    var breachPenaltyPerSec = config.breachPenaltyPerSec || 4;
    var finalMessage = config.message || "המלחמה הוכרעה - ניצחון! 🎖️";

    var defenses = frontNames.map(function () { return 70; });
    var barEls = [];
    var statusEls = [];

    var remaining = duration;
    var finished = false;
    var lastTime = null;
    var intervalHandle = null;

    container.innerHTML =
      '<div class="grow-counter" id="warTimer">זמן עד לניצחון: ' + duration.toFixed(1) + " שניות</div>" +
      '<div class="progress-bar"><div id="warProgress"></div></div>' +
      '<div class="war-fronts" id="warFronts"></div>' +
      '<div class="hint">תגבר את כל החזיתות לפני שהן נפרצות - זה לא ינוח לרגע</div>';

    var timerEl = container.querySelector("#warTimer");
    var progressEl = container.querySelector("#warProgress");
    var frontsEl = container.querySelector("#warFronts");

    frontNames.forEach(function (name, idx) {
      var card = document.createElement("div");
      card.className = "war-front";
      card.innerHTML =
        '<div class="war-front-name">' + name + "</div>" +
        '<div class="war-bar"><div class="war-bar-fill" id="warBar' + idx + '"></div></div>' +
        '<div class="war-front-status" id="warStatus' + idx + '"></div>' +
        '<button class="btn war-reinforce-btn" type="button">שלח תגבורת</button>';
      frontsEl.appendChild(card);

      barEls[idx] = card.querySelector("#warBar" + idx);
      statusEls[idx] = card.querySelector("#warStatus" + idx);

      var btn = card.querySelector(".war-reinforce-btn");
      btn.addEventListener("click", function () {
        if (finished) return;
        defenses[idx] = Math.min(100, defenses[idx] + boost);
        btn.classList.remove("bump");
        void btn.offsetWidth;
        btn.classList.add("bump");
      });
    });

    function tick() {
      if (finished) return;

      var now = performance.now();
      if (lastTime === null) lastTime = now;
      var dt = (now - lastTime) / 1000;
      lastTime = now;

      remaining -= dt;

      frontNames.forEach(function (_, idx) {
        defenses[idx] = Math.max(0, defenses[idx] - decayPerSec * dt);
        barEls[idx].style.width = defenses[idx] + "%";
        barEls[idx].classList.toggle("danger", defenses[idx] < 30);

        if (defenses[idx] <= 0) {
          statusEls[idx].textContent = "🚨 נפרצה!";
          remaining += breachPenaltyPerSec * dt;
        } else {
          statusEls[idx].textContent = "";
        }
      });

      if (remaining <= 0) {
        finished = true;
        clearInterval(intervalHandle);
        timerEl.textContent = finalMessage;
        progressEl.style.width = "100%";
        setTimeout(onComplete, 800);
        return;
      }

      timerEl.textContent = "זמן עד לניצחון: " + Math.max(0, remaining).toFixed(1) + " שניות";
      var ratio = Math.max(0, Math.min(1, 1 - remaining / duration));
      progressEl.style.width = Math.round(ratio * 100) + "%";
    }

    intervalHandle = setInterval(tick, 100);
  };
})();
