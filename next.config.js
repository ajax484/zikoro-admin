/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
