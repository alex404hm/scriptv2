const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.min.css',
  '/main.min.js',
  '/favicon.ico',
  '/src/png/htmllogo.png',
  '/src/png/csslogo.png',
  '/src/png/jslogo.png',
  '/src/png/githublogo.png',
  '/fonts.googleapis.com/css2?family=Passions+Conflict&family=Orbitron&family=Fira+Code&family=Six+Caps'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch and Cache Resources
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          fetchResponse => {
            if (!fetchResponse || fetchResponse.status !== 200) {
              return fetchResponse;
            }
            let responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return fetchResponse;
          }
        );
      })
  );
});

// Activate the Service Worker and remove old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
