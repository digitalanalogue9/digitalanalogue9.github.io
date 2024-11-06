const CACHE_NAME = 'core-values-cache-v2'; // Increment version to force update
const DYNAMIC_CACHE = 'core-values-dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/history',
  '/replay',
  '/manifest.json',
  '/images/core-values.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets like CSS, JS bundles
];

// Helper function to handle network requests with timeout
const timeoutFetch = (request, timeout = 5000) => {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

// Install event handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Creating dynamic cache');
      })
    ])
    .then(() => self.skipWaiting())
  );
});

// Activate event handler
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return (
                name !== CACHE_NAME &&
                name !== DYNAMIC_CACHE
              );
            })
            .map((name) => {
              console.log('Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event handler with improved strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      handleAPIRequest(request)
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      handleNavigationRequest(request)
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    handleStaticAsset(request)
  );
});

// Handle API requests - Network first, cache fallback
async function handleAPIRequest(request) {
  try {
    const response = await timeoutFetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle navigation requests - Network first with cache fallback
async function handleNavigationRequest(request) {
  try {
    const response = await timeoutFetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return cached index.html as fallback for client-side routing
    return caches.match('/');
  }
}

// Handle static assets - Cache first, network fallback
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Return cached response immediately
    return cachedResponse;
  }

  try {
    const response = await timeoutFetch(request);
    if (!response || response.status !== 200) {
      return response;
    }

    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('Error fetching static asset:', error);
    // You might want to return a default fallback here
    return new Response('Network error occurred', { status: 408 });
  }
}

// Handle sync events
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
      badge: '/icons/icon-192x192.png',
      data: data
    };

    event.waitUntil(
      self.registration.showNotification('Core Values', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});

// Helper function to get sync data
async function getSyncData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const syncRequest = new Request('/api/pending-syncs');
    const response = await cache.match(syncRequest);
    if (!response) return null;
    return response.json();
  } catch (error) {
    console.error('Error getting sync data:', error);
    return null;
  }
}

// Sync game state implementation
async function syncGameState() {
  const syncData = await getSyncData();
  if (!syncData) return;

  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(syncData),
    });

    if (!response.ok) {
      throw new Error('Sync failed');
    }

    // Clear synced data from cache
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.delete('/api/pending-syncs');

  } catch (error) {
    console.error('Sync failed:', error);
    throw error; // Retry later
  }
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
