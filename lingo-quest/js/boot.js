/* Lingo Quest — loading screen and error reporting.
   Runs first, so a failed load shows a message instead of a blank page. */
(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  function show(text) {
    var box = el('boot-msg');
    if (box) { box.textContent = text; box.className = 'boot-msg bad'; }
  }
  function describe(msg, src) {
    if (location.protocol === 'file:') return 'Lingo Quest has to be opened from its web address (your pages.dev link), not as a file.';
    return 'Lingo Quest could not start: ' + msg + (src ? ' (' + String(src).split('/').pop() + ')' : '');
  }
  window.LQBoot = { fail: function (msg, src) { show(describe(msg, src)); } };
  window.addEventListener('error', function (e) {
    if (!el('boot')) return; // app already running; it handles its own errors
    var t = e.target;
    if (t && t !== window && (t.src || t.href)) show(describe('a file did not load', t.src || t.href));
    else show(describe(e.message || 'script error', e.filename));
  }, true);
  window.addEventListener('unhandledrejection', function (e) {
    if (el('boot')) show(describe(String((e.reason && e.reason.message) || e.reason)));
  });
  setTimeout(function () {
    var box = el('boot-msg');
    if (el('boot') && box && box.className.indexOf('bad') < 0) {
      box.textContent = 'Still loading. The first visit needs internet; after that it works offline. Pull down to reload if this stays.';
    }
  }, 12000);
})();
