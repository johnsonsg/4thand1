import type { GlobalConfig } from 'payload'

const BrandSettings: GlobalConfig = {
  slug: 'brand-settings',
  label: 'Brand Settings',
  fields: [
    { name: 'brandName', label: 'Brand Name', type: 'text' },
    { name: 'brandSubtitle', label: 'Brand Subtitle', type: 'text' },
    { name: 'brandMark', label: 'Brand Mark (letter)', type: 'text' },
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
