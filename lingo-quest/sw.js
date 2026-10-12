/* Lingo Quest service worker: works offline after the first visit.
   Bump VERSION whenever any file changes so phones pick up the update. */
var VERSION = 'lingo-quest-v3';
var FILES = [
  './', 'manifest.webmanifest', 'css/app.css',
  'vendor/react.production.min.js', 'vendor/react-dom.production.min.js', 'vendor/babel.min.js',
  'js/boot.js', 'js/data/languages.js', 'js/data/pictures.js',
  'js/core/tones.js', 'js/core/content.js', 'js/core/srs.js', 'js/core/storage.js', 'js/core/questions.js', 'js/core/speech.js',
  'js/ui/common.jsx', 'js/ui/lesson.jsx', 'js/ui/home.jsx', 'js/ui/parent.jsx', 'js/app.jsx',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Pages: network first, so updates arrive and hosting redirects never get
   replayed from cache. App files: cache first. Google Fonts: cached on first load. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(function (res) {
      if (res && res.ok && !res.redirected) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put('./', copy); }); }
      return res;
    }).catch(function () { return caches.match('./'); }));
    return;
  }
  var isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !isFont) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: !isFont }).then(function (hit) {
    if (hit) return hit;
    return fetch(e.request).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () { return Response.error(); });
  }));
});
