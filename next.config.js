const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development'
})

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: isGitHubActions ? '/digitalanalogue9.github.io' : '',
  assetPrefix: isGitHubActions ? '.' : '', // Changed to relative path
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString()
  }
}

module.exports = withPWA(nextConfig);
