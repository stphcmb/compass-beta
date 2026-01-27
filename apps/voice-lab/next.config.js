/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@compass/ui',
    '@compass/utils',
    '@compass/database',
    '@compass/auth',
    '@compass/ai',
  ],
}

module.exports = nextConfig
