import type { GlobalConfig } from 'payload'

const HeroSettings: GlobalConfig = {
  slug: 'hero-settings',
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
                description:
                  'Button text color. Accepts hex (#000000) or HSL (0 0% 0%).',
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
}

export default HeroSettings
