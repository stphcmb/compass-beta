/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@compass/ui',
    '@compass/utils',
    '@compass/database',
    '@compass/auth',
    '@compass/ai',
  ],
}

export default nextConfig
