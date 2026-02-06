/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prevent Next.js from guessing the repo root based on lockfiles outside this folder.
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
