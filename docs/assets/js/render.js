(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderIntro(card, person, onStart) {
    card.innerHTML =
      '<div class="badge">מכתב אישי</div>' +
      '<h1>היי <span class="name">' + escapeHtml(person.name) + "</span></h1>" +
      '<p class="sub">' + escapeHtml(person.intro || "לפני שאתה מגיע למכתב, יש לך פה משהו קטן ממני.") + "</p>" +
      '<button class="btn" id="startBtn">בואו נתחיל</button>';
    card.querySelector("#startBtn").addEventListener("click", onStart);
  }

  function renderGame(card, person, onComplete) {
    card.innerHTML =
      '<div class="badge">' + escapeHtml(person.gameTitle || "אתגר קטן") + "</div>" +
      '<div class="game-area" id="gameArea"></div>' +
      '<div class="hint">' + escapeHtml(person.gameHint || "") + "</div>";

    var gameArea = card.querySelector("#gameArea");
    var init = window.GAMES && window.GAMES[person.game];

    if (!init) {
      onComplete();
      return;
    }

    init(gameArea, person.gameConfig || {}, onComplete);
  }

  function renderLetter(card, person) {
    var lines = String(person.letter || "").split("\n");
    var html = lines.map(escapeHtml).join("<br>");
    var hasGroupLetter = person.groupLetter && String(person.groupLetter).trim();

    card.innerHTML =
      '<div class="badge">בשבילך</div>' +
      "<h1>" + escapeHtml(person.name) + "</h1>" +
      '<div class="letter">' + html + "</div>" +
      (person.signoff ? '<div class="letter-signoff">' + escapeHtml(person.signoff) + "</div>" : "") +
      (hasGroupLetter ? '<button class="btn" id="groupLetterBtn" style="margin-top:20px">יש עוד דבר אחד - לכולם ←</button>' : "");

    if (hasGroupLetter) {
      card.querySelector("#groupLetterBtn").addEventListener("click", function () {
        renderGroupLetter(card, person);
      });
    }
  }

  function renderGroupLetter(card, person) {
    var lines = String(person.groupLetter || "").split("\n");
    var html = lines.map(escapeHtml).join("<br>");

    card.innerHTML =
      '<div class="badge">לכולם</div>' +
      "<h1>עוד משהו קטן</h1>" +
      '<div class="letter">' + html + "</div>";
  }

  // Full flow: intro -> game -> letter (-> shared group letter). `card` is the container element.
  function run(card, person) {
    renderIntro(card, person, function () {
      renderGame(card, person, function () {
        renderLetter(card, person);
      });
    });
  }

  window.PersonRenderer = { run: run, escapeHtml: escapeHtml };
})();
