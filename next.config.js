/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["s.gravatar.com"],
  },
};

module.exports = nextConfig;
