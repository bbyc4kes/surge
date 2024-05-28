/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'subdomain',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.stripe.com',
        port: '',
      },
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
