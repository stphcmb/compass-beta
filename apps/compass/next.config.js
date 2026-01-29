/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable experimental optimizations
  experimental: {
    // Optimize package imports for faster builds and smaller bundles
    optimizePackageImports: ['lucide-react', '@/components'],
  },

  async redirects() {
    return [
      {
        source: '/results',
        destination: '/explore',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

