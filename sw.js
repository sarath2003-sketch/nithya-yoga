/**
 * NITHYA Yoga & Wellness - Production PWA Service Worker
 * Conforms to PWABuilder & W3C Service Worker Specifications
 * 
 * Features:
 * - Robust cache versioning & automatic cleanup of obsolete caches
 * - Offline navigation fallback to index.html
 * - Stale-while-revalidate for core assets, CSS, JS, and UI images
 * - Direct network passthrough for all /api/* backend & LiveKit calls
 * - Immediate activation via skipWaiting & clients.claim
 * - Client messaging for smooth update notification
 */

const CACHE_VERSION = 'v5.1.0';
const PRECACHE_NAME = `nithya-yoga-precache-${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `nithya-yoga-runtime-${CACHE_VERSION}`;

// Core assets required for complete offline application startup
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './dist/bundle.js',
  './assets/yoga-ui.css',
  './assets/yoga-ui.js',
  './src/styles.css',
  './assets/icons/icon-96.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-192-maskable.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.png',
  './assets/images/logo.png',
  './assets/images/chakra-meditation.jpg',
  './assets/screenshots/screenshot-desktop.png',
  './assets/screenshots/screenshot-mobile.png'
];

// -------------------------------------------------------------
// 1. INSTALLATION EVENT
// -------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE_NAME).then(async (cache) => {
      // Use individual caching to prevent one non-critical file failure from breaking PWA install
      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (response && response.status === 200) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn(`[ServiceWorker] Precache skipped for ${url}:`, err);
          }
        })
      );
    })
  );

  // Force active state without waiting for old workers
  self.skipWaiting();
});

// -------------------------------------------------------------
// 2. ACTIVATION EVENT & OBSOLETE CACHE PURGE
// -------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== PRECACHE_NAME && name !== RUNTIME_CACHE_NAME) {
            console.log(`[ServiceWorker] Removing outdated cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Take immediate control of all open pages
      return self.clients.claim();
    })
  );
});

// -------------------------------------------------------------
// 3. FETCH EVENT HANDLING
// -------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // RULE A: Strictly bypass non-GET requests (POST, PUT, DELETE)
  if (request.method !== 'GET') {
    return;
  }

  // RULE B: Strictly bypass all /api/* backend endpoints & WebSocket/LiveKit protocols
  if (url.pathname.includes('/api/') || url.protocol === 'ws:' || url.protocol === 'wss:') {
    return;
  }

  // RULE B2: Strictly bypass version.json and APK files (always fetch fresh, never cache 22MB binaries)
  if (url.pathname.endsWith('version.json') || url.pathname.endsWith('.apk')) {
    return;
  }

  // RULE C: Navigation Requests (HTML / SPA page transitions)
  // Strategy: Network-First with fallback to cached index.html for complete offline support
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedNavigate = await caches.match(request);
          if (cachedNavigate) return cachedNavigate;
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // RULE D1: Core Application Scripts & Stylesheets (bundle.js, styles.css, yoga-ui.css, yoga-ui.js)
  // Strategy: Network-First with Cache Fallback (Guarantees instant updates upon deployment)
  const isCoreCode = url.pathname.includes('bundle.js') || 
                     url.pathname.includes('styles.css') || 
                     url.pathname.includes('yoga-ui.css') || 
                     url.pathname.includes('yoga-ui.js');

  if (isCoreCode) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response('Offline and core asset not cached', { status: 503 });
        })
    );
    return;
  }

  // RULE D2: Other Static Assets (Images, Fonts, Audio, Icons)
  // Strategy: Stale-While-Revalidate (Instant load from cache, silent background refresh)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed; offline mode in effect
          return null;
        });

      // If cached response exists, return it immediately while fetching fresh in background
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise await network response
      return fetchPromise.then((response) => {
        if (response) return response;
        // If image request failed offline, fallback
        if (request.destination === 'image') {
          return caches.match('./assets/images/logo.png');
        }
        return new Response('Network unavailable (Offline)', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      });
    })
  );
});

// -------------------------------------------------------------
// 4. CLIENT MESSAGING & LIFECYCLE HOOKS
// -------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  } else if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => caches.delete(name)));
    });
  } else if (event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version: CACHE_VERSION });
    }
  }
});

// -------------------------------------------------------------
// 5. BACKGROUND PUSH & NOTIFICATION CLICK HANDLING
// -------------------------------------------------------------
self.addEventListener('push', (event) => {
  let data = {
    title: 'NITHYA Yoga Reminder',
    body: 'Time for your daily mindful yoga practice!',
    icon: './assets/images/logo.png',
    badge: './assets/images/logo.png'
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (_) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: data.icon || './assets/images/logo.png',
    badge: data.badge || './assets/images/logo.png',
    vibrate: [250, 100, 250],
    data: data.url || './',
    tag: 'nithya-yoga-reminder',
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawData = event.notification?.data;
  let targetUrl = './?tab=reminders';
  if (typeof rawData === 'string' && rawData.startsWith('http')) {
    targetUrl = rawData;
  } else if (rawData && typeof rawData === 'object' && rawData.url) {
    targetUrl = rawData.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          try {
            client.postMessage({ type: 'NAVIGATE_TAB', tab: 'reminders' });
          } catch (_) {}
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
