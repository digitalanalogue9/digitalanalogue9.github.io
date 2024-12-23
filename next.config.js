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

const isDevelopment = process.env.NODE_ENV === 'development';
const isGitHubPages = process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET === 'github';
const isVercel = process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET === 'vercel';

const nextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? 'export' : undefined, // GitHub Pages needs static export
  distDir: isGitHubPages || isDevelopment ? 'out' : '.next', // Different output directories
  trailingSlash: isGitHubPages, // Trailing slashes for GitHub Pages
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_VERSION,
    DEBUG: process.env.DEBUG,
    CARDS_IN_GAME: process.env.CARDS_IN_GAME,
    DEFAULT_CORE_VALUES_TO_CHOOSE: process.env.DEFAULT_CORE_VALUES_TO_CHOOSE
  },
}

module.exports = withPWA(nextConfig);