const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/digitalanalogue9.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/digitalanalogue9.github.io/' : '',
  trailingSlash: true,
  env: {
    BUILD_TIME: new Date().toISOString(),
    CACHE_VERSION: Date.now().toString()
  }
}

module.exports = withPWA(nextConfig);
