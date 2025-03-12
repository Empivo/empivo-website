/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['octal-dev.s3.ap-south-1.amazonaws.com'],
    unoptimized: true
  }
}

module.exports = {
  async redirects() {
    return [
      {
        source: "/pages/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};


module.exports = nextConfig
