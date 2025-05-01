/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['octal-dev.s3.ap-south-1.amazonaws.com'],
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: "/pages/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
  // Add this to ignore ESLint during builds if needed
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig