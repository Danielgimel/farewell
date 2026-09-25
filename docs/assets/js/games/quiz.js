(function () {
  "use strict";
  window.GAMES = window.GAMES || {};

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  window.GAMES.quiz = function (container, config, onComplete) {
    var questions = config.questions && config.questions.length ? config.questions : [
      { q: "מה נקנה?", options: ["קפה", "אינפוזיה"], correct: 1 }
    ];

    var current = 0;
    var locked = false;

    function renderQuestion() {
      locked = false;
      var item = questions[current];

      container.innerHTML =
        '<div class="progress-bar"><div style="width:' +
        Math.round((current / questions.length) * 100) +
        '%"></div></div>' +
        '<div class="quiz-question">' + escapeHtml(item.q) + "</div>" +
        '<div class="quiz-options" id="opts"></div>';

      var opts = container.querySelector("#opts");
      item.options.forEach(function (optionText, index) {
        var btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.type = "button";
        btn.textContent = optionText;
        btn.addEventListener("click", function () {
          onAnswer(btn, index, item.correct);
        });
        opts.appendChild(btn);
      });
    }

    function onAnswer(btn, index, correctIndex) {
      if (locked) return;

      if (index === correctIndex) {
        locked = true;
        btn.classList.add("correct");
        setTimeout(function () {
          current++;
          if (current >= questions.length) {
            onComplete();
          } else {
            renderQuestion();
          }
        }, 500);
      } else {
        btn.classList.add("wrong");
        setTimeout(function () {
          btn.classList.remove("wrong");
        }, 500);
      }
    }

    renderQuestion();
  };
})();
