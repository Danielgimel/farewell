(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.grow = function (container, config, onComplete) {
    var target = config.target || 20;
    var label = config.label || "תתעצם!";
    var stages = config.stages && config.stages.length ? config.stages : ["🌱", "🌿", "🌳", "💪"];
    var messages = config.messages && config.messages.length ? config.messages : [
      "בואו נתחיל",
      "יפה, ממשיכים",
      "עוד קצת",
      "כמעט שם"
    ];

    var count = 0;
    var finished = false;

    container.innerHTML =
      '<div class="grow-wrap">' +
      '<span class="grow-emoji" id="growEmoji">' + stages[0] + "</span>" +
      '<div class="progress-bar"><div id="growProgress"></div></div>' +
      '<div class="grow-counter" id="growCounter">0 / ' + target + "</div>" +
      '<div class="grow-counter" id="growMsg">' + messages[0] + "</div>" +
      '<button class="btn grow-tap-btn" id="growBtn" type="button">' + label + "</button>" +
      "</div>";

    var emojiEl = container.querySelector("#growEmoji");
    var progressEl = container.querySelector("#growProgress");
    var counterEl = container.querySelector("#growCounter");
    var msgEl = container.querySelector("#growMsg");
    var btn = container.querySelector("#growBtn");

    function stageFor(ratio) {
      var idx = Math.min(stages.length - 1, Math.floor(ratio * stages.length));
      return stages[idx];
    }

    function msgFor(ratio) {
      var idx = Math.min(messages.length - 1, Math.floor(ratio * messages.length));
      return messages[idx];
    }

    btn.addEventListener("click", function () {
      if (finished) return;
      count++;

      var ratio = Math.min(1, count / target);
      progressEl.style.width = Math.round(ratio * 100) + "%";
      counterEl.textContent = count + " / " + target;
      emojiEl.textContent = stageFor(ratio);
      emojiEl.style.transform = "scale(" + (1 + ratio * 0.9) + ")";
      msgEl.textContent = msgFor(ratio);

      btn.classList.remove("bump");
      void btn.offsetWidth;
      btn.classList.add("bump");

      if (count >= target) {
        finished = true;
        emojiEl.textContent = stages[stages.length - 1];
        msgEl.textContent = config.message || "התעצמת!";
        btn.disabled = true;
        setTimeout(onComplete, 800);
      }
    });
  };
})();
