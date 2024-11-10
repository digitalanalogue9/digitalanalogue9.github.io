const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development'
})

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGitHubActions ? '/digitalanalogue9.github.io' : '';
const assetPrefix = isGitHubActions ? '.' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: assetPrefix,
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString(),
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  // Add explicit page mapping
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/history': { page: '/history' },
      '/replay': { page: '/replay' },
      '/about': { page: '/about' },
      '/404': { page: '/404' }
    };
  }
}

module.exports = withPWA(nextConfig);
