/* CTVA visitor counter: counts each browser once per day and shows the total in the footer */
(function () {
  var URL_ = 'https://script.google.com/macros/s/AKfycbxfTkqqjtjXLXekfT-fODrdU-F3SzroDSCogLnOcICh1ImtKeLKFJK7Xb6f2K4jsQ0/exec';
  var KEY = 'ctva_visit_day';
  var today = new Date().toISOString().slice(0, 10);

  var footer = document.querySelector('footer');
  if (!footer) return;
  var el = document.createElement('div');
  el.id = 'visitCounter';
  el.style.cssText = 'margin-top:10px;font-size:13px;opacity:.8;';
  el.textContent = '\uD83D\uDC41 \u2026 visitors';
  footer.appendChild(el);

  var already = false;
  try { already = localStorage.getItem(KEY) === today; } catch (e) {}
  var action = already ? 'getVisitCount' : 'countVisit';

  fetch(URL_ + '?action=' + action)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d && d.status === 'ok') {
        el.textContent = '\uD83D\uDC41 ' + Number(d.total).toLocaleString('en-US') + ' visitors';
        if (!already) { try { localStorage.setItem(KEY, today); } catch (e) {} }
      } else { el.remove(); }
    })
    .catch(function () { el.remove(); });
})();
