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

const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: ({ req }) => (req.user ? true : { tenantId: { equals: resolveTenantId(req) } }),
    update: ({ req }) => (req.user ? true : { tenantId: { equals: resolveTenantId(req) } }),
    delete: ({ req }) => (req.user ? true : { tenantId: { equals: resolveTenantId(req) } }),
    create: () => true,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        const tenantId = resolveTenantId(req);
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
