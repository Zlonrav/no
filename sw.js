const CACHE = 'net-cards-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
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

  // Для навигации (HTML) — сеть первым, кэш как резерв
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

  // Для остальных — кэш первым, сеть в фоне
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
