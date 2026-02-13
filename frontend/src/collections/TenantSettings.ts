import type { CollectionConfig, Field, PayloadRequest } from 'payload';
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
          })
      );

  return resolveTenantFromHeaders(headers);
};

const tokenFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'primary',
        type: 'text',
        label: 'Primary',
        admin: {
          description: 'Main brand color. Accepts hex (#EBBA3C) or HSL (43 90% 55%).',
          components: { Field: '/src/components/ColorPickerField#default' },
          width: '50%',
        },
      },
      {
        name: 'secondary',
        type: 'text',
        label: 'Secondary',
        admin: {
          description: 'Accent color. Accepts hex (#030712) or HSL (43 90% 55%).',
          components: { Field: '/src/components/ColorPickerField#default' },
          width: '50%',
        },
      },
    ],
  },
];

const TenantSettings: CollectionConfig = {
  slug: 'tenant-settings',
  admin: {
    useAsTitle: 'tenantId',
    description: 'Per-tenant settings for brand, hero, theme, stats, and schedule.',
  },
  access: {
    read: ({ req }) => ({ tenantId: { equals: resolveTenantId(req) } }),
    update: ({ req }) => ({ tenantId: { equals: resolveTenantId(req) } }),
    delete: ({ req }) => ({ tenantId: { equals: resolveTenantId(req) } }),
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
  fields: [
    {
      name: 'tenantId',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'brand',
      type: 'group',
      label: 'Brand Settings',
      fields: [
        { name: 'brandName', label: 'Brand Name', type: 'text' },
        { name: 'brandSubtitle', label: 'Brand Subtitle', type: 'text' },
        {
          name: 'brandMark',
          label: 'Brand Mark (letter)',
          type: 'text',
          admin: {
            description: 'Single letter or short mark (e.g., "W" for Westfield)',
          },
        },
        {
          name: 'brandMoto',
          label: 'Brand Motto',
          type: 'textarea',
          admin: {
            description: 'Team motto or tagline displayed in the footer',
          },
        },
        {
          name: 'brandLogo',
          label: 'Brand Logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Settings',
      fields: [
        { name: 'season', type: 'text', label: 'Season Label' },
        { name: 'headline', type: 'text', label: 'Headline' },
        { name: 'heroDescription', type: 'textarea', label: 'Description' },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
        {
          type: 'collapsible',
          label: 'Primary CTA',
          admin: { initCollapsed: false },
          fields: [
            { name: 'primaryCtaLabel', type: 'text', label: 'Button Label' },
            { name: 'primaryCtaHref', type: 'text', label: 'Button Link' },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryCtaBackgroundColor',
                  type: 'text',
                  label: 'Background Color',
                  admin: {
                    description: 'Button background color. Accepts hex (#EBBA3C) or HSL (43 90% 55%).',
                    components: { Field: '/src/components/ColorPickerField#default' },
                    width: '50%',
                  },
                },
                {
                  name: 'primaryCtaTextColor',
                  type: 'text',
                  label: 'Text Color',
                  admin: {
                    description: 'Button text color. Accepts hex (#000000) or HSL (0 0% 0%).',
                    components: { Field: '/src/components/ColorPickerField#default' },
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Secondary CTA',
          admin: { initCollapsed: true },
          fields: [
            { name: 'secondaryCtaLabel', type: 'text', label: 'Button Label' },
            { name: 'secondaryCtaHref', type: 'text', label: 'Button Link' },
          ],
        },
        {
          type: 'collapsible',
          label: 'Tertiary CTA',
          admin: { initCollapsed: true },
          fields: [
            { name: 'tertiaryCtaLabel', type: 'text', label: 'Button Label' },
            { name: 'tertiaryCtaHref', type: 'text', label: 'Button Link' },
          ],
        },
        {
          type: 'collapsible',
          label: 'Quaternary CTA',
          admin: { initCollapsed: true },
          fields: [
            { name: 'quaternaryCtaLabel', type: 'text', label: 'Button Label' },
            { name: 'quaternaryCtaHref', type: 'text', label: 'Button Link' },
          ],
        },
      ],
    },
    {
      name: 'theme',
      type: 'group',
      label: 'Theme Settings',
      fields: [
        {
          type: 'ui',
          name: 'teamColorsHeader',
          admin: {
            components: {
              Field: '/src/components/admin/TeamColorsHeader#default',
            },
          },
        },
        {
          name: 'light',
          type: 'group',
          label: 'Light Mode',
          fields: tokenFields(),
        },
        {
          name: 'dark',
          type: 'group',
          label: 'Dark Mode',
          fields: tokenFields(),
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Stats Bar',
      fields: [
        {
          name: 'items',
          label: 'Stats',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: 'value', label: 'Value', type: 'text', required: true },
            { name: 'label', label: 'Label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      label: 'Schedule Settings',
      fields: [
        { name: 'seasonLabel', type: 'text', label: 'Season Label' },
        { name: 'title', type: 'text', label: 'Section Title' },
        { name: 'record', type: 'text', label: 'Team Record' },
        {
          type: 'collapsible',
          label: 'Win Chip Styling',
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'winChipBackgroundColor',
                  type: 'text',
                  label: 'Background Color',
                  admin: {
                    description: 'Background color for Win (W) outcome chips. Accepts hex or HSL.',
                    components: { Field: '/src/components/ColorPickerField#default' },
                    width: '50%',
                  },
                },
                {
                  name: 'winChipTextColor',
                  type: 'text',
                  label: 'Text Color',
                  admin: {
                    description: 'Text color for Win (W) outcome chips. Accepts hex or HSL.',
                    components: { Field: '/src/components/ColorPickerField#default' },
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'games',
          type: 'array',
          label: 'Games',
          fields: [
            {
              name: 'dateTime',
              type: 'text',
              label: 'Date & Time',
              required: true,
              admin: {
                components: {
                  Field: './src/components/admin/DateTimePickerField',
                },
              },
            },
            { name: 'opponent', type: 'text', required: true },
            {
              name: 'location',
              type: 'select',
              required: true,
              options: ['Home', 'Away'],
            },
            { name: 'status', type: 'select', required: true, options: ['final', 'upcoming'] },
            { name: 'result', type: 'text' },
            {
              name: 'outcome',
              type: 'select',
              options: ['W', 'L', 'T', 'BYE'],
            },
          ],
        },
      ],
    },
  ],
};

export default TenantSettings;
