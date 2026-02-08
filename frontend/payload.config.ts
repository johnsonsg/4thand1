import path from 'node:path';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import Users from './src/collections/Users.ts';
import Media from './src/collections/Media.ts';
import HeroSettings from './src/globals/HeroSettings.ts';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  routes: {
    api: '/cms-api',
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  editor: lexicalEditor({}),
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  globals: [HeroSettings],
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src', 'payload-types.ts'),
  },
});
