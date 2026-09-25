(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.redhead = function (container, config, onComplete) {
    var gridSizes = config.gridSizes && config.gridSizes.length ? config.gridSizes : [9, 16, 25, 36];
    var finalMessage = config.message || "נדיר כמו יהלום! 🔴";
    var targetEmoji = config.targetEmoji || "🧑‍🦰";
    var decoyEmojis = config.decoyEmojis && config.decoyEmojis.length
      ? config.decoyEmojis
      : ["🧑", "🧑‍🦱", "🧑‍🦳", "🧑‍🦲"];

    var round = 0;

    function renderRound() {
      var size = gridSizes[round];
      var cols = Math.max(3, Math.round(Math.sqrt(size)));
      var total = cols * cols;
      var targetIndex = Math.floor(Math.random() * total);

      container.innerHTML =
        '<div class="grow-counter">סבב ' + (round + 1) + " מתוך " + gridSizes.length + ' - מצא/י את הגינג\'י</div>' +
        '<div class="redhead-grid" id="redGrid" style="grid-template-columns: repeat(' + cols + ', 1fr);"></div>';

      var gridEl = container.querySelector("#redGrid");

      for (var i = 0; i < total; i++) {
        var isTarget = i === targetIndex;
        var cell = document.createElement("div");
        cell.className = "redhead-cell";
        cell.textContent = isTarget ? targetEmoji : decoyEmojis[Math.floor(Math.random() * decoyEmojis.length)];

        cell.addEventListener("click", (function (isTarget, cell) {
          return function () {
            if (isTarget) {
              round++;
              if (round >= gridSizes.length) {
                container.innerHTML = '<div class="grow-counter">' + finalMessage + "</div>";
                setTimeout(onComplete, 800);
              } else {
                renderRound();
              }
            } else {
              cell.classList.remove("miss");
              void cell.offsetWidth;
              cell.classList.add("miss");
            }
          };
        })(isTarget, cell));

        gridEl.appendChild(cell);
      }
    }

    renderRound();
  };
})();
