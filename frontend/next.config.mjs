import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },

  images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      pathname: '/cms-api/**',
    },
    {
      protocol: 'https',
      hostname: '4thand1.s3.us-east-005.backblazeb2.com',
      pathname: '/**',
    },
  ],
},
}

export default withPayload(nextConfig)
