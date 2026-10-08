const CACHE = 'net-cards-v2.17';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',

  './css/styles.css',
  './css/dashboard.css',

  './js/theme-init.js',
  './js/sober.js',
  './js/app.js',
  './js/dashboard.js',
  './js/counter.js',
  './js/trgz.js',

  './pages/alcohol.html',
  './pages/vape.html',
  './pages/trgz.html',
  './pages/rumination.html',
  './pages/counter.html',
  './pages/stress.html',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return resp;
        })
        .catch(() =>
          caches.match(e.request).then((r) => r || caches.match('./index.html'))
        )
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then((cached) => {
        const fetched = fetch(e.request)
          .then((resp) => {
            if (resp && resp.ok) cache.put(e.request, resp.clone());
            return resp;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    )
  );
});
