(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  window.GAMES.tiramisu = function (container, config, onComplete) {
    var dipsTarget = config.dips || 2;
    var dipZoneWidth = config.dipZoneWidth || 24;
    var dipSpeedMs = config.dipSpeedMs || 1200;

    var whiskTarget = config.whiskTarget || 16;
    var whiskTimeMs = config.whiskTimeMs || 4000;

    var layersTarget = config.layers || 6;

    var finalMessage = config.message || "בתאבון! 🍰";

    var cleanupFns = [];
    function cleanup() {
      cleanupFns.forEach(function (fn) { fn(); });
      cleanupFns = [];
    }

    // ---------- phase 1: dip the ladyfinger ----------
    function renderDip() {
      cleanup();
      var dips = 0;
      var stopped = false;
      var currentPos = 0;
      var startTime = null;
      var zoneLeft = 50 - dipZoneWidth / 2;

      container.innerHTML =
        '<div class="cook-step">שלב 1 מתוך 3 - טבילת הביסקוויט</div>' +
        '<div class="selfie-emoji" id="dipEmoji">🍪</div>' +
        '<div class="selfie-track" id="dipTrack">' +
        '<div class="selfie-zone" id="dipZone"></div>' +
        '<div class="selfie-marker" id="dipMarker"></div>' +
        "</div>" +
        '<div class="grow-counter" id="dipCounter">0 / ' + dipsTarget + " טבילות</div>" +
        '<div class="grow-counter" id="dipMsg">חכה שהביסקוויט ייכנס לאזור הקפה ואז תטבול</div>' +
        '<button class="btn" id="dipBtn" type="button">☕ טבול!</button>';

      var zoneEl = container.querySelector("#dipZone");
      var markerEl = container.querySelector("#dipMarker");
      var counterEl = container.querySelector("#dipCounter");
      var msgEl = container.querySelector("#dipMsg");
      var btn = container.querySelector("#dipBtn");
      var emojiEl = container.querySelector("#dipEmoji");

      function placeZone() {
        zoneLeft = 8 + Math.random() * (92 - dipZoneWidth - 8);
        zoneEl.style.left = zoneLeft + "%";
        zoneEl.style.width = dipZoneWidth + "%";
      }
      placeZone();

      function loop(now) {
        if (stopped) return;
        if (startTime === null) startTime = now;
        var t = (now - startTime) % dipSpeedMs;
        var phase = t / dipSpeedMs;
        currentPos = phase < 0.5 ? phase * 2 * 100 : (1 - phase) * 2 * 100;
        markerEl.style.left = currentPos + "%";
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
      cleanupFns.push(function () { stopped = true; });

      btn.addEventListener("click", function () {
        if (stopped) return;
        var hit = currentPos >= zoneLeft && currentPos <= zoneLeft + dipZoneWidth;

        if (hit) {
          dips++;
          msgEl.textContent = "👌 טבילה מושלמת";
          emojiEl.classList.remove("flash");
          void emojiEl.offsetWidth;
          emojiEl.classList.add("flash");
          placeZone();
        } else {
          msgEl.textContent = "💧 יותר מדי / פחות מדי... נסה שוב";
        }

        counterEl.textContent = dips + " / " + dipsTarget + " טבילות";

        if (dips >= dipsTarget) {
          stopped = true;
          setTimeout(renderWhisk, 500);
        }
      });
    }

    // ---------- phase 2: whisk the cream ----------
    function renderWhisk() {
      cleanup();
      var taps = 0;
      var stopped = false;
      var deadline = performance.now() + whiskTimeMs;
      var timerHandle = null;

      container.innerHTML =
        '<div class="cook-step">שלב 2 מתוך 3 - ערבוב הקרם</div>' +
        '<div class="selfie-emoji" id="whiskEmoji">🥣</div>' +
        '<div class="progress-bar"><div id="whiskProgress"></div></div>' +
        '<div class="grow-counter" id="whiskCounter">0 / ' + whiskTarget + "</div>" +
        '<div class="grow-counter" id="whiskTimer"></div>' +
        '<button class="btn grow-tap-btn" id="whiskBtn" type="button">ערבב!</button>';

      var progressEl = container.querySelector("#whiskProgress");
      var counterEl = container.querySelector("#whiskCounter");
      var timerEl = container.querySelector("#whiskTimer");
      var btn = container.querySelector("#whiskBtn");
      var emojiEl = container.querySelector("#whiskEmoji");

      function tick() {
        if (stopped) return;
        var remaining = Math.max(0, deadline - performance.now());
        timerEl.textContent = "זמן: " + (remaining / 1000).toFixed(1) + " שניות";

        if (remaining <= 0) {
          taps = 0;
          counterEl.textContent = "0 / " + whiskTarget;
          progressEl.style.width = "0%";
          deadline = performance.now() + whiskTimeMs;
          timerEl.textContent = "הקרם לא הספיק להסמיך... עוד פעם!";
        }
      }
      timerHandle = setInterval(tick, 100);
      cleanupFns.push(function () { stopped = true; clearInterval(timerHandle); });

      btn.addEventListener("click", function () {
        if (stopped) return;
        taps++;
        counterEl.textContent = taps + " / " + whiskTarget;
        progressEl.style.width = Math.round((taps / whiskTarget) * 100) + "%";

        emojiEl.classList.remove("bump");
        void emojiEl.offsetWidth;
        emojiEl.classList.add("bump");

        if (taps >= whiskTarget) {
          stopped = true;
          clearInterval(timerHandle);
          timerEl.textContent = "קרם משי!";
          btn.disabled = true;
          setTimeout(renderLayers, 500);
        }
      });
    }

    // ---------- phase 3: layer the cake ----------
    function renderLayers() {
      cleanup();
      var count = 0;
      var finished = false;
      var layerHeight = Math.max(6, Math.min(20, 150 / layersTarget));
      var kinds = [
        { cls: "tira-layer-biscuit", icon: "☕" },
        { cls: "tira-layer-cream", icon: "🧀" },
        { cls: "tira-layer-cocoa", icon: "🍫" }
      ];

      container.innerHTML =
        '<div class="cook-step">שלב 3 מתוך 3 - בניית השכבות</div>' +
        '<div class="tira-glass" id="tiraGlass"></div>' +
        '<div class="progress-bar"><div id="tiraProgress"></div></div>' +
        '<div class="grow-counter" id="tiraCounter">0 / ' + layersTarget + " שכבות</div>" +
        '<button class="btn grow-tap-btn" id="tiraBtn" type="button">עוד שכבה!</button>';

      var glassEl = container.querySelector("#tiraGlass");
      var progressEl = container.querySelector("#tiraProgress");
      var counterEl = container.querySelector("#tiraCounter");
      var btn = container.querySelector("#tiraBtn");

      btn.addEventListener("click", function () {
        if (finished) return;
        count++;

        var kind = kinds[(count - 1) % kinds.length];
        var layer = document.createElement("div");
        layer.className = "tira-layer " + kind.cls;
        layer.style.height = layerHeight + "px";
        if (layerHeight >= 14) layer.textContent = kind.icon;
        glassEl.appendChild(layer);

        var ratio = Math.min(1, count / layersTarget);
        progressEl.style.width = Math.round(ratio * 100) + "%";
        counterEl.textContent = count + " / " + layersTarget + " שכבות";

        btn.classList.remove("bump");
        void btn.offsetWidth;
        btn.classList.add("bump");

        if (count >= layersTarget) {
          finished = true;
          counterEl.textContent = finalMessage;
          btn.disabled = true;
          setTimeout(onComplete, 900);
        }
      });
    }

    renderDip();
  };
})();
