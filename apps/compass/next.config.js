/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

