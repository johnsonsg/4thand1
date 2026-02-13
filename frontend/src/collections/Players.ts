import type { CollectionConfig } from 'payload';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'number', 'position', 'spotlight', 'updatedAt'],
  },
  hooks: {
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
  },
  access: {
    read: () => true,
  },
  fields: [
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
