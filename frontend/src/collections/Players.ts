import type { CollectionConfig, PayloadRequest } from 'payload';
import { resolveTenantFromHeaders } from '@/lib/tenancy/resolveTenant';

const resolveTenantId = (req?: PayloadRequest) => {
  if (!req?.headers) return process.env.DEFAULT_TENANT_ID ?? 'default';

  const headers = req.headers instanceof Headers
    ? req.headers
    : new Headers(
        Object.entries(req.headers as Record<string, string | string[] | undefined>)
          .flatMap(([key, value]) => {
            if (!value) return [] as [string, string][];
            const resolved = Array.isArray(value) ? value[0] : value;
            if (!resolved) return [] as [string, string][];
            return [[key, resolved]] as [string, string][];
          }),
      );

  return resolveTenantFromHeaders(headers);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const processPlayerImage = async (data: any, req: any) => {
  // Only run if image is present and is a new upload
  if (!data.image || typeof data.image !== 'object' || !data.image.filename) return data;
  const mediaDoc = data.image;
  const imageUrl = `/media/${mediaDoc.filename}`;
  try {
    // Download the uploaded image
    const res = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}${imageUrl}`);
    if (!res.ok) throw new Error('Failed to fetch uploaded image');
    const buffer = Buffer.from(await res.arrayBuffer());
    // Call Photoroom API
    const prRes = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.PHOTOROOM_API_KEY!,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });
    if (!prRes.ok) throw new Error('Photoroom API failed');
    const processedBuffer = Buffer.from(await prRes.arrayBuffer());
    // Save processed image to disk (overwrite original)
    const fs = require('fs');
    const path = require('path');
    const mediaPath = path.join(process.cwd(), 'frontend', 'public', 'media', mediaDoc.filename);
    fs.writeFileSync(mediaPath, processedBuffer);
    // Optionally, update a flag or field if needed
    return data;
  } catch (err) {
    console.error('AI headshot processing failed:', err);
    return data;
  }
};

const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'number', 'position', 'spotlight', 'updatedAt'],
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        const tenantId = resolveTenantId(req);
        return { ...data, tenantId };
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        const name = data?.name ? String(data.name) : '';
        const number = data?.number ? String(data.number) : '';
        if (name && number) {
          data.slug = slugify(`${name}-${number}`);
        }
        return data;
      },
    ],
    afterChange: [async ({ doc, req }) => {
      await processPlayerImage(doc, req);
    }],
  },
  access: {
    read: ({ req }) => ({ tenantId: { equals: resolveTenantId(req) } }),
    update: ({ req }) => ({ tenantId: { equals: resolveTenantId(req) } }),
    delete: ({ req }) => ({ tenantId: { equals: resolveTenantId(req) } }),
    create: () => true,
  },
  fields: [
    {
      name: 'tenantId',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug, e.g. "marcus-johnson"',
        readOnly: true,
        condition: (_data, siblingData) => Boolean(siblingData?.slug),
      },
    },
    { name: 'name', label: 'Player Name', type: 'text', required: true },
    { name: 'number', label: 'Number', type: 'text' },
    {
      name: 'position',
      label: 'Position',
      type: 'text',
    },
    {
      name: 'positionGroup',
      label: 'Position Group',
      type: 'select',
      hasMany: true,
      options: ['Offense', 'Defense', 'Special Teams'],
    },
    {
      name: 'spotlight',
      label: 'Show in Player Spotlight',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include this player in the home page spotlight section.',
        components: {
          Cell: '/src/components/admin/SpotlightCell#default',
        },
      },
    },
    {
      name: 'year',
      label: 'Year',
      type: 'text',
      admin: {
        description: 'Graduation year (e.g., 2026).',
      },
    },
    { name: 'height', label: 'Height', type: 'text' },
    { name: 'weight', label: 'Weight', type: 'text' },
    {
      name: 'image',
      label: 'Player Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    { name: 'stats', label: 'Stats', type: 'text' },
    {
      name: 'hudlUrl',
      label: 'Hudl Profile URL',
      type: 'text',
      admin: {
        description: 'Link to the player Hudl profile (e.g., https://www.hudl.com/...).',
      },
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
    },
    {
      name: 'accolades',
      label: 'Accolades',
      type: 'array',
      fields: [{ name: 'title', label: 'Accolade', type: 'text', required: true }],
    },
    {
      name: 'sortOrder',
      label: 'Sort Order',
      type: 'number',
      admin: {
        description: 'Optional ordering value (lower comes first).',
      },
    },
  ],
};

export default Players;
