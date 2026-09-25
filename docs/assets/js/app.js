(function () {
  "use strict";

  var card = document.getElementById("card");

  function getId() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("id") || "").trim();
  }

  function getKey() {
    var hash = window.location.hash || "";
    if (hash.indexOf("#") === 0) hash = hash.slice(1);
    var params = new URLSearchParams(hash);
    return (params.get("k") || "").trim();
  }

  function renderMissing() {
    card.innerHTML =
      '<div class="badge">מכתב אישי</div>' +
      "<h1>אין כאן כלום להציג</h1>" +
      '<p class="state-message">לא נמצא קוד אישי בקישור. סרקו שוב את הברקוד שקיבלתם.</p>';
  }

  function renderNotFound() {
    card.innerHTML =
      '<div class="badge">מכתב אישי</div>' +
      "<h1>הקישור לא נמצא</h1>" +
      '<p class="state-message">ייתכן שהקישור שגוי או שפג תוקפו. אם קיבלתם את זה ישירות ממני, תבדקו איתי.</p>';
  }

  function renderNoKey() {
    card.innerHTML =
      '<div class="badge">מכתב אישי</div>' +
      "<h1>חסר מפתח בקישור</h1>" +
      '<p class="state-message">הקישור הזה חסר חלק חיוני (אחרי ה-#). תוודאו שסרקתם את הברקוד המלא ולא העתקתם רק חלק מהכתובת.</p>';
  }

  function renderDecryptError() {
    card.innerHTML =
      '<div class="badge">מכתב אישי</div>' +
      "<h1>לא הצלחתי לפתוח את המכתב</h1>" +
      '<p class="state-message">הקישור נראה פגום או לא שלם. נסו לסרוק את הברקוד שוב.</p>';
  }

  function boot() {
    var id = getId();
    if (!id) {
      renderMissing();
      return;
    }

    var safeId = id.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeId) {
      renderMissing();
      return;
    }

    var key = getKey();
    if (!key) {
      renderNoKey();
      return;
    }

    fetch("data/people/" + safeId + ".json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(function (payload) {
        return window.CryptoUtils.decryptPerson(payload, key);
      })
      .then(function (person) {
        window.PersonRenderer.run(card, person);
      })
      .catch(function (err) {
        if (err && err.message === "not found") {
          renderNotFound();
        } else {
          renderDecryptError();
        }
      });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
