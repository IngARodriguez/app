const CACHE_NAME = 'nequiglitch-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/assets/css/tokens.css',
  '/assets/fonts/manrope_regular.ttf',
  '/assets/fonts/manrope_medium.ttf',
  '/assets/fonts/manrope_bold.ttf',
  '/assets/img/fondo.png',
  '/assets/img/clavefondopage.png',
  '/assets/img/homenequifondo.png',
  '/assets/img/tu_plata.png',
  '/assets/img/tres_botones.png',
  '/assets/img/bre_b_icon.png',
  '/assets/img/mi_negocio_icon.png',
  '/assets/img/tigo_icon.png',
  '/assets/img/wom_icon.png',
  '/assets/img/tienda_virtual_icon.png',
  '/assets/img/bolsillos_icon.png',
  '/assets/img/claro_icon.png',
  '/assets/img/mas_servicios_icon.png',
  '/assets/img/heart.png',
  '/assets/img/edit.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: pre-cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets');
      // addAll fails if any single fetch fails, so catch individual errors
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url =>
          cache.add(url).catch(e => console.warn('[SW] Could not cache:', url, e))
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate: delete outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first with network fallback
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback: return index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
