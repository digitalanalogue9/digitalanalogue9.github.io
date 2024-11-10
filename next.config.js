const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development',
  // Add these PWA configurations
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!**/*'],
  runtimeCaching: []
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
  assetPrefix: isGitHubActions ? '.' : '',
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString(),
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  // Add these configurations
  experimental: {
    appDir: true,
    serverActions: false
  },
  // Ensure these files are treated as static
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  }
}

module.exports = withPWA(nextConfig);
