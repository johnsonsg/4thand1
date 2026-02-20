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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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
        const players = Array.isArray((data as any)?.players)
          ? (data as any).players.map((player: any) => {
              if (!player) return player;
              const name = player?.name ? String(player.name) : '';
              const number = player?.number ? String(player.number) : '';
              const slugBase = [name, number].filter(Boolean).join('-');
              const slug = player?.slug || (slugBase ? slugify(slugBase) : undefined);
              const image = player?.image;
              const imageValue = image && typeof image === 'object' && 'id' in image ? image : image;
              const normalizedImage = imageValue === '' || imageValue == null ? null : imageValue;
              return { ...player, slug, ...(normalizedImage === null ? { image: null } : { image: normalizedImage }) };
            })
          : (data as any)?.players;
        const news = Array.isArray((data as any)?.news)
          ? (data as any).news.map((item: any) => {
              if (!item) return item;
              const title = item?.title ? String(item.title) : '';
              const slug = item?.slug || (title ? slugify(title) : undefined);
              const image = item?.image;
              const imageValue = image && typeof image === 'object' && 'id' in image ? image : image;
              const normalizedImage = imageValue === '' || imageValue == null ? null : imageValue;
              return { ...item, slug, ...(normalizedImage === null ? { image: null } : { image: normalizedImage }) };
            })
          : (data as any)?.news;
        return { ...data, tenantId, ...(players ? { players } : {}), ...(news ? { news } : {}) };
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
      type: 'tabs',
      admin: {
        components: {
          Field: '/src/components/admin/TenantSettingsTabs#default',
        },
      },
      tabs: [
        {
          label: 'Brand Settings',
          fields: [
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
          ],
        },
        {
          label: 'Tickets',
          fields: [
            {
              name: 'nav',
              type: 'group',
              label: 'Tickets',
              fields: [
                {
                  name: 'ticketsUrl',
                  label: 'Tickets URL',
                  type: 'text',
                  admin: {
                    description: 'External link for the Tickets icon button in the navbar.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Metadata',
          fields: [
            {
              name: 'metadata',
              type: 'group',
              label: 'Metadata (SEO)',
              fields: [
                {
                  name: 'teamName',
                  label: 'Team Name',
                  type: 'text',
                  admin: {
                    description: 'School or program name (e.g., Westfield).',
                  },
                },
                {
                  name: 'mascot',
                  label: 'Mascot',
                  type: 'text',
                  admin: {
                    description: 'Mascot or nickname (e.g., Eagles).',
                  },
                },
                {
                  name: 'sport',
                  label: 'Sport',
                  type: 'text',
                  admin: {
                    description: 'Sport name for SEO (e.g., Football).',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  admin: {
                    description:
                      'Used as the meta description for pages when no page-specific description is provided.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Contact Info',
              fields: [
                {
                  name: 'contactSnippet',
                  label: 'Intro Text',
                  type: 'textarea',
                  admin: {
                    description: 'Short intro paragraph shown under the Contact heading.',
                  },
                },
                {
                  name: 'addressLine1',
                  label: 'Address Line 1',
                  type: 'text',
                },
                {
                  name: 'addressLine2',
                  label: 'Address Line 2',
                  type: 'text',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      label: 'City',
                      type: 'text',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'state',
                      label: 'State',
                      type: 'text',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'zip',
                      label: 'ZIP',
                      type: 'text',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  name: 'email',
                  label: 'Email',
                  type: 'text',
                },
                {
                  name: 'phone',
                  label: 'Phone',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Hero Settings',
          fields: [
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
                            description:
                              'Button background color. Accepts hex (#EBBA3C) or HSL (43 90% 55%).',
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
          ],
        },
        {
          label: 'Theme Settings',
          fields: [
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
          ],
        },
        {
          label: 'Stats Bar',
          fields: [
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
          ],
        },
        {
          label: 'Schedule Settings',
          fields: [
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
        },
        {
          label: 'Players',
          fields: [
            {
              type: 'ui',
              name: 'playersRosterPreview',
              label: 'Team Roster',
              admin: {
                components: {
                  Field: '/src/components/admin/TenantRosterTable#default',
                },
              },
            },
            {
              name: 'players',
              label: 'Add/Manage Players',
              type: 'array',
              admin: {
                description: 'Manage your roster here. Each row represents a player for this tenant.',
                hidden: true,
              },
              fields: [
                {
                  name: 'slug',
                  label: 'Slug',
                  type: 'text',
                  admin: {
                    readOnly: true,
                    description: 'Auto-generated from name and number.',
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
            },
          ],
        },
        {
          label: 'News',
          fields: [
            {
              name: 'news',
              label: 'News Articles',
              type: 'array',
              admin: {
                description: 'Articles for the News section and news detail pages.',
              },
              fields: [
                {
                  name: 'slug',
                  label: 'Slug',
                  type: 'text',
                  admin: {
                    readOnly: true,
                    description: 'Auto-generated from title.',
                  },
                },
                { name: 'title', label: 'Title', type: 'text', required: true },
                {
                  name: 'category',
                  label: 'Category',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'author',
                  label: 'Author',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'excerpt',
                  label: 'Excerpt',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'publishedAt',
                  label: 'Published At',
                  type: 'date',
                  required: true,
                  defaultValue: () => new Date().toISOString(),
                },
                {
                  name: 'image',
                  label: 'Featured Image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                },
                {
                  name: 'body',
                  label: 'Body',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'paragraph',
                      label: 'Paragraph',
                      type: 'textarea',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default TenantSettings;
