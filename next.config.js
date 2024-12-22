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

const isGitHubPages = process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET === 'github';
const isVercel = process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET === 'vercel';

const nextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? 'export' : undefined, // GitHub Pages needs static export
  distDir: isGitHubPages ? 'out' : '.next', // Different output directories
  trailingSlash: isGitHubPages, // Trailing slashes for GitHub Pages
  assetPrefix: isGitHubPages ? '/digitalanalogue9.github.io/' : undefined, // GitHub Pages asset prefix
}

module.exports = withPWA(nextConfig);