const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development'
})

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'digitalanalogue9.github.io';
const basePath = isGitHubActions ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: basePath,
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString(),
    NEXT_PUBLIC_BASE_PATH: basePath
  }
}

module.exports = withPWA(nextConfig);
