/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.google.com', 'images.unsplash.com', 'source.unsplash.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
