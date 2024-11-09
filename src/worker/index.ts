/// <reference lib="webworker" />
import { cacheNames, clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { registerRoute } from 'workbox-routing'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope

// Use the injected cache version from next.config.js
const CACHE_VERSION = process.env.CACHE_VERSION || Date.now().toString()

// Customize cache names with version
const customCacheNames = {
  runtime: `runtime-${CACHE_VERSION}`,
  static: `static-${CACHE_VERSION}`,
  image: `images-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`
}

clientsClaim()

// Cache static assets
registerRoute(
  ({ request }) => request.destination === 'style' || 
                   request.destination === 'script' || 
                   request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: customCacheNames.static,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: customCacheNames.image,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
)

// Cache API requests
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: customCacheNames.api,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
)

// Clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old versioned caches
          if (!Object.values(customCacheNames).includes(cacheName)) {
            return caches.delete(cacheName)
          }
          return Promise.resolve()
        })
      )
    })
  )
})

// Ensure TypeScript treats this as a module
export {}
