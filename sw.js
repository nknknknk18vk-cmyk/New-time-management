const cacheName = 'studysync-v7-cache';
const appFiles = [
  './index.html',
  './manifest.json'
];

// Install the service worker and cache the files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(appFiles);
    })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

