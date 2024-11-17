const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true, // Changed to true
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!manifest.webmanifest'],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'core-values-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        networkTimeoutSeconds: 10,
        backgroundSync: {
          name: 'core-values-queue',
          options: {
            maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
          }
        }
      }
    }
  ]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
    };
    return config;
  },
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString(),
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION || require('./package.json').version
  }
}

module.exports = withPWA(nextConfig);