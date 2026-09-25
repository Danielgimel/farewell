(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.calories = function (container, config, onComplete) {
    var good = config.good && config.good.length ? config.good : ["🥦", "🍎", "🥕", "🥗", "🍇"];
    var bad = config.bad && config.bad.length ? config.bad : ["🍕", "🍔", "🍰", "🍟", "🍩"];
    var target = config.target || 12;
    var badRatio = config.badRatio != null ? config.badRatio : 0.4;
    var spawnMs = config.spawnMs || 700;
    var fallMs = config.fallMs || 3200;
    var finalMessage = config.message || "יום מושלם של תזונה! 🎉";

    var score = 0;
    var finished = false;
    var spawnTimer = null;

    container.innerHTML =
      '<div class="catch-stage" id="stage">' +
      '<div class="catch-score" id="scoreLabel">0 / ' + target + " 🥗</div>" +
      "</div>" +
      '<div class="hint">תפוס/י רק את האוכל הבריא - התחמק/י מהג\'אנק פוד</div>';

    var stage = container.querySelector("#stage");
    var scoreLabel = container.querySelector("#scoreLabel");

    function spawnItem() {
      if (finished) return;

      var isBad = Math.random() < badRatio;
      var pool = isBad ? bad : good;
      var emoji = pool[Math.floor(Math.random() * pool.length)];

      var item = document.createElement("div");
      item.className = "catch-item";
      item.textContent = emoji;

      var stageWidth = stage.clientWidth;
      var startX = 24 + Math.random() * Math.max(1, stageWidth - 48);
      item.style.left = startX + "px";
      item.style.top = "-30px";

      stage.appendChild(item);

      var startTime = performance.now();
      var duration = fallMs * (0.8 + Math.random() * 0.4);
      var stageHeight = stage.clientHeight;

      function step(now) {
        if (!item.isConnected) return;
        var t = (now - startTime) / duration;
        if (t >= 1) {
          item.remove();
          return;
        }
        item.style.top = (t * (stageHeight + 30) - 30) + "px";
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      item.addEventListener("click", function () {
        if (finished) return;

        if (isBad) {
          item.remove();
          scoreLabel.classList.add("catch-bad-flash");
          scoreLabel.textContent = "אופס, זה לא בתפריט 😅";
          setTimeout(function () {
            scoreLabel.classList.remove("catch-bad-flash");
            scoreLabel.textContent = score + " / " + target + " 🥗";
          }, 500);
          return;
        }

        score++;
        scoreLabel.textContent = score + " / " + target + " 🥗";
        item.remove();

        if (score >= target) {
          finished = true;
          clearInterval(spawnTimer);
          Array.prototype.forEach.call(stage.querySelectorAll(".catch-item"), function (el) {
            el.remove();
          });
          scoreLabel.textContent = finalMessage;
          setTimeout(onComplete, 700);
        }
      });
    }

    spawnTimer = setInterval(spawnItem, spawnMs);
    spawnItem();
  };
})();
