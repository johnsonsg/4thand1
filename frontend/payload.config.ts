import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import Users from './src/collections/Users'
import Media from './src/collections/Media'
import HeroSettings from './src/globals/HeroSettings'
import BrandSettings from './src/globals/BrandSettings'
import ThemeSettings from './src/globals/ThemeSettings'
import StatsSettings from './src/globals/StatsSettings'
import ScheduleSettings from './src/globals/ScheduleSettings'
import TenantSettings from './src/collections/TenantSettings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  routes: {
    admin: '/admin',
    api: '/cms-api',
  },

  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  editor: lexicalEditor({}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: __dirname
    }
  },
  collections: [Users, Media, TenantSettings],
  globals: [HeroSettings, BrandSettings, ThemeSettings, StatsSettings, ScheduleSettings],
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src', 'payload-types.ts'),
  },
})
