(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  window.GAMES.memory = function (container, config, onComplete) {
    var defaults = ["🎖️", "☕", "🪖", "🌵", "🎸", "⚽"];
    var symbols = (config.pairs && config.pairs.length ? config.pairs : defaults).slice(0, 8);
    var deck = shuffle(symbols.concat(symbols));

    var totalPairs = symbols.length;
    var matchedPairs = 0;
    var locked = false;
    var first = null;

    container.innerHTML =
      '<div class="progress-bar"><div id="memProgress"></div></div>' +
      '<div class="memory-grid" id="memGrid"></div>';

    var grid = container.querySelector("#memGrid");
    var progress = container.querySelector("#memProgress");

    deck.forEach(function (symbol, index) {
      var cell = document.createElement("div");
      cell.className = "memory-card";
      cell.dataset.symbol = symbol;
      cell.dataset.index = index;
      cell.innerHTML = '<span class="face">' + symbol + "</span>";
      cell.addEventListener("click", function () {
        onCardClick(cell);
      });
      grid.appendChild(cell);
    });

    function onCardClick(cell) {
      if (locked) return;
      if (cell.classList.contains("flipped") || cell.classList.contains("matched")) return;

      cell.classList.add("flipped");

      if (!first) {
        first = cell;
        return;
      }

      if (first.dataset.symbol === cell.dataset.symbol) {
        first.classList.add("matched");
        cell.classList.add("matched");
        first = null;
        matchedPairs++;
        progress.style.width = Math.round((matchedPairs / totalPairs) * 100) + "%";

        if (matchedPairs === totalPairs) {
          locked = true;
          setTimeout(onComplete, 500);
        }
        return;
      }

      locked = true;
      var second = cell;
      setTimeout(function () {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        first = null;
        locked = false;
      }, 700);
    }
  };
})();
