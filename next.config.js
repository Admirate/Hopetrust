/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
