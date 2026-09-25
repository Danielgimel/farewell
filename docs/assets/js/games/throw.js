(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.throw = function (container, config, onComplete) {
    var target = config.target || 10;
    var label = config.label || "זרוק!";
    var finalMessage = config.message || "קלעת ישר בפרצוף! 😂";
    var targetImg = config.targetImg || "";
    var projectileImg = config.projectileImg || "";

    var count = 0;
    var finished = false;

    container.innerHTML =
      '<div class="throw-wrap">' +
      '<div class="throw-stage" id="throwStage">' +
      '<img src="' + targetImg + '" class="throw-target" id="throwTarget" alt="">' +
      "</div>" +
      '<div class="progress-bar"><div id="throwProgress"></div></div>' +
      '<div class="grow-counter" id="throwCounter">0 / ' + target + " זריקות</div>" +
      '<button class="btn grow-tap-btn" id="throwBtn" type="button">' + label + "</button>" +
      "</div>";

    var stage = container.querySelector("#throwStage");
    var targetEl = container.querySelector("#throwTarget");
    var counterEl = container.querySelector("#throwCounter");
    var progressEl = container.querySelector("#throwProgress");
    var btn = container.querySelector("#throwBtn");

    btn.addEventListener("click", function () {
      if (finished) return;

      var proj = document.createElement("img");
      proj.src = projectileImg;
      proj.className = "throw-projectile";

      var stageRect = stage.getBoundingClientRect();
      var targetRect = targetEl.getBoundingClientRect();
      var startX = stageRect.width / 2;
      var startY = stageRect.height - 6;
      var endX = (targetRect.left - stageRect.left) + targetRect.width / 2 + (Math.random() * 50 - 25);
      var endY = (targetRect.top - stageRect.top) + targetRect.height / 2 + (Math.random() * 40 - 20);

      proj.style.left = startX + "px";
      proj.style.top = startY + "px";
      stage.appendChild(proj);

      requestAnimationFrame(function () {
        proj.style.transition = "left 0.45s ease-out, top 0.45s ease-out, transform 0.45s ease-out";
        proj.style.left = endX + "px";
        proj.style.top = endY + "px";
        proj.style.transform = "rotate(" + Math.round(Math.random() * 360) + "deg) scale(0.7)";
      });

      setTimeout(function () {
        proj.remove();

        targetEl.classList.remove("hit");
        void targetEl.offsetWidth;
        targetEl.classList.add("hit");

        count++;
        counterEl.textContent = count + " / " + target + " זריקות";
        progressEl.style.width = Math.round((count / target) * 100) + "%";

        if (count >= target) {
          finished = true;
          counterEl.textContent = finalMessage;
          btn.disabled = true;
          setTimeout(onComplete, 700);
        }
      }, 450);
    });
  };
})();
