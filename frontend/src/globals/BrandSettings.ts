import type { GlobalConfig } from 'payload'

const BrandSettings: GlobalConfig = {
  slug: 'brand-settings',
  label: 'Brand Settings',
  fields: [
    { name: 'brandName', label: 'Brand Name', type: 'text' },
    { name: 'brandSubtitle', label: 'Brand Subtitle', type: 'text' },
    {
      name: 'brandMark',
      label: 'Brand Mark (letter)',
      type: 'text',
      admin: {
        description:
          'Single letter or short mark (e.g., "W" for Westfield)',
      },
    },
    {
      name: 'brandMoto',
      label: 'Brand Motto',
      type: 'textarea',
      admin: {
        description:
          'Team motto or tagline displayed in the footer',
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
}

export default BrandSettings
