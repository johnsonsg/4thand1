const path = require('path');
const { withPayload } = require('@payloadcms/next/withPayload');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace boundary for Turbopack.
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
};

module.exports = withPayload(nextConfig);
