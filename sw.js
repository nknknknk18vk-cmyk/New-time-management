const cacheName = 'studysync-v8'; // Changed the name to force an update
const appFiles = [
  './index.html',
  './manifest.json'
];

// Install and cache files
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forces the new service worker to activate immediately
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(appFiles);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          return caches.delete(key); // Deletes the old broken cache
        }
      }));
    })
  );
});

// Network-First Strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // If we get a valid response from the internet, update the cache
        if (response && response.status === 200) {
            let responseClone = response.clone();
            caches.open(cacheName).then((cache) => cache.put(e.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // If the internet is down, fall back to the cache
        return caches.match(e.request);
      })
  );
});
