/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export', // For GitHub Pages static export
    images: {
      unoptimized: true
    },
    basePath: process.env.NODE_ENV === 'production' ? '/digitalanalogue9.github.io' : '',
    webpack: (config) => {
      // Add any necessary webpack configurations
      return config;
    }
  }
  
  module.exports = nextConfig
  