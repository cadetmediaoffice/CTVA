/* CTVA visitor counter: counts each browser once per day and shows the total in the footer.
   Add ?debug=1 to any page address to see why the counter is not showing. */
(function () {
  var URL_ = 'https://script.google.com/macros/s/AKfycbxfTkqqjtjXLXekfT-fODrdU-F3SzroDSCogLnOcICh1ImtKeLKFJK7Xb6f2K4jsQ0/exec';
  var KEY = 'ctva_visit_day';
  var debug = /[?&]debug=1/.test(location.search);
  var today = new Date().toISOString().slice(0, 10);

  function make() {
    var el = document.createElement('div');
    el.id = 'visitCounter';
    el.style.cssText = 'margin-top:10px;font-size:13px;opacity:.85;text-align:center;';
    el.textContent = '\uD83D\uDC41 \u2026 visitors';
    var host = document.querySelector('footer') || document.body;
    host.appendChild(el);
    return el;
  }

  function call(action) {
    return fetch(URL_ + '?action=' + action)
      .then(function (r) { return r.text(); })
      .then(function (t) {
        var d;
        try { d = JSON.parse(t); } catch (e) { throw new Error('reply was not JSON: ' + t.slice(0, 80)); }
        if (!d || d.status !== 'ok') throw new Error((d && d.message) || 'backend said not ok');
        return d;
      });
  }

  function run() {
    var el = make();
    var already = false;
    try { already = localStorage.getItem(KEY) === today; } catch (e) {}

    var first = already ? call('getVisitCount') : call('countVisit').then(function (d) {
      try { localStorage.setItem(KEY, today); } catch (e) {}
      return d;
    });
    // if counting a new visit fails for any reason, still show the total
    first.catch(function () { return call('getVisitCount'); })
      .then(function (d) {
        el.textContent = '\uD83D\uDC41 ' + Number(d.total).toLocaleString('en-US') + ' visitors';
      })
      .catch(function (err) {
        if (debug) { el.style.color = '#ff9090'; el.textContent = 'Counter error: ' + (err && err.message || err); }
        else el.remove();
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();