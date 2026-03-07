import type { CollectionConfig } from 'payload';

const normalizeDomain = (value: string) => {
  let domain = value.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0] ?? domain;
  domain = domain.split(':')[0] ?? domain;
  return domain.replace(/\.+$/, '');
};

const TenantDomains: CollectionConfig = {
  slug: 'tenant-domains',
  admin: {
    useAsTitle: 'domain',
    defaultColumns: ['domain', 'tenantId', 'status'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (typeof (data as any).domain === 'string') {
          (data as any).domain = normalizeDomain((data as any).domain);
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Custom domain (e.g., manchesterlancers.com).',
      },
    },
    {
      name: 'tenantId',
      type: 'text',
      required: true,
      admin: {
        description: 'Tenant ID to route this domain to.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'active', 'disabled'],
      defaultValue: 'pending',
      admin: {
        description: 'Use active once DNS is verified.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};

export default TenantDomains;
