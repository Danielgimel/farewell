(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.run = function (container, config, onComplete) {
    var target = config.target || 40;
    var label = config.label || "רוץ!";
    var finalMessage = config.message || "שיא אישי!";

    var steps = 0;
    var finished = false;
    var tapTimes = [];

    container.innerHTML =
      '<div class="run-wrap">' +
      '<div class="run-track" id="runTrack">' +
      '<span class="run-flag">🏁</span>' +
      '<span class="run-runner" id="runRunner">🏃</span>' +
      "</div>" +
      '<div class="progress-bar"><div id="runProgress"></div></div>' +
      '<div class="grow-counter" id="runCounter">0 / ' + target + " צעדים</div>" +
      '<div class="grow-counter" id="runPace">קצב: -</div>' +
      '<button class="btn grow-tap-btn" id="runBtn" type="button">' + label + "</button>" +
      "</div>";

    var runnerEl = container.querySelector("#runRunner");
    var progressEl = container.querySelector("#runProgress");
    var counterEl = container.querySelector("#runCounter");
    var paceEl = container.querySelector("#runPace");
    var btn = container.querySelector("#runBtn");

    function updatePace() {
      var now = performance.now();
      tapTimes.push(now);
      tapTimes = tapTimes.filter(function (t) { return now - t <= 1000; });
      var rate = tapTimes.length;
      if (rate <= 2) {
        paceEl.textContent = "קצב: " + rate + " צעדים/שנייה - תאיץ!";
      } else if (rate <= 5) {
        paceEl.textContent = "קצב: " + rate + " צעדים/שנייה - יופי";
      } else {
        paceEl.textContent = "קצב: " + rate + " צעדים/שנייה - מהיר!";
      }
    }

    btn.addEventListener("click", function () {
      if (finished) return;
      steps++;
      updatePace();

      var ratio = Math.min(1, steps / target);
      runnerEl.style.left = (ratio * 82) + "%";
      progressEl.style.width = Math.round(ratio * 100) + "%";
      counterEl.textContent = steps + " / " + target + " צעדים";

      btn.classList.remove("bump");
      void btn.offsetWidth;
      btn.classList.add("bump");

      if (steps >= target) {
        finished = true;
        runnerEl.textContent = "🏆";
        paceEl.textContent = finalMessage;
        btn.disabled = true;
        setTimeout(onComplete, 800);
      }
    });
  };
})();
