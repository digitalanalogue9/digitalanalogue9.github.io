const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development'
})

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'digitalanalogue9.github.io';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: isGitHubActions ? `/${repoName}` : '',
  assetPrefix: isGitHubActions ? `/${repoName}/` : '', // Note the trailing slash
  distDir: 'dist',
  cleanDistDir: true,
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString()
  },
  // Add static page generation config
  generateStaticParams: async () => {
    return {
      '/': { page: '/' },
      '/history': { page: '/history' },
      '/replay': { page: '/replay' },
      '/about': { page: '/about' }
    }
  }
}

module.exports = withPWA(nextConfig);
