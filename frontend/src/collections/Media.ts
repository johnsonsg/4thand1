import type { CollectionConfig, PayloadRequest } from 'payload';
import { resolveTenantFromHeadersAsync } from '@/lib/tenancy/resolveTenant';

const resolveTenantId = async (req?: PayloadRequest) => {
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

  return resolveTenantFromHeadersAsync(headers);
};

const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: async ({ req }) => (req.user ? true : { tenantId: { equals: await resolveTenantId(req) } }),
    update: async ({ req }) => (req.user ? true : { tenantId: { equals: await resolveTenantId(req) } }),
    delete: async ({ req }) => (req.user ? true : { tenantId: { equals: await resolveTenantId(req) } }),
    create: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        const tenantId = await resolveTenantId(req);
        return { ...data, tenantId };
      },
    ],
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
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
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};

export default Media;
