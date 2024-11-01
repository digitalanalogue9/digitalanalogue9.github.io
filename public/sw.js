const CACHE_NAME = 'core-values-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/history',
  '/manifest.json',
  '/images/core-values.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Dynamic cache for API responses and other runtime data
const DYNAMIC_CACHE = 'core-values-dynamic-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
    .then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event - network first with cache fallback for API requests
// Cache first with network fallback for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests (adjust the path according to your API endpoints)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching it
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Cache hit - return the response from cache
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response before caching it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncGameState') {
    event.waitUntil(syncGameState());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png'
    };

    event.waitUntil(
      self.registration.showNotification('Core Values', options)
    );
  }
});

// Function to sync game state
async function syncGameState() {
  // Implement your sync logic here
  const syncData = await getSyncData();
  if (syncData) {
    try {
      // Sync with your backend
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(syncData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Sync failed:', error);
      // Retry later
      throw error;
    }
  }
}
