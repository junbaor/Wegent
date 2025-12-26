// SPDX-FileCopyrightText: 2025 Weibo, Inc.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Service Worker for Wegent PWA
 * Handles offline caching, notification clicks, and background sync
 */

const CACHE_NAME = 'wegent-v1';
const RUNTIME_CACHE = 'wegent-runtime';
const IMAGE_CACHE = 'wegent-images';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return (
                cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE
              );
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API requests - always fetch from network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline - API unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Handle images - cache first, then network
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(response => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(IMAGE_CACHE).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle navigation requests - network first, then cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match('/offline');
          });
        })
    );
    return;
  }

  // Handle other requests - cache first, then network
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Update cache in background
        fetch(request)
          .then(response => {
            if (response.status === 200) {
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, response);
              });
            }
          })
          .catch(() => {
            // Silently fail background updates
          });
        return cachedResponse;
      }

      return fetch(request).then(response => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});

// Handle notification click events
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.targetUrl;

  if (!targetUrl) {
    return;
  }

  event.waitUntil(
    (async () => {
      // Get all window clients
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      // Try to find an existing tab with exact URL match
      for (const client of clients) {
        if (client.url === targetUrl) {
          // Found matching tab, focus it
          await client.focus();
          return;
        }
      }

      // No matching tab found, open new window
      await self.clients.openWindow(targetUrl);
    })()
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');

  const data = event.data?.json() || {};
  const title = data.title || 'Wegent AI';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      targetUrl: data.url || '/',
    },
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle messages from client
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      })
    );
  }
});

// Helper function to sync tasks when back online
async function syncTasks() {
  try {
    const response = await fetch('/api/tasks/sync', {
      method: 'POST',
    });

    if (response.ok) {
      console.log('[SW] Tasks synced successfully');
    } else {
      console.error('[SW] Failed to sync tasks');
    }
  } catch (error) {
    console.error('[SW] Error syncing tasks:', error);
    throw error;
  }
}

console.log('[SW] Service worker loaded');
