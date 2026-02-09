import type { GlobalConfig } from 'payload'

const HeroSettings: GlobalConfig = {
  slug: 'hero-settings',
  label: 'Hero Settings',
  fields: [
    { name: 'season', label: 'Season', type: 'text' },
    { name: 'headline', type: 'text' },
    { name: 'heroDescription', type: 'textarea' },

    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    // CTAs
    { name: 'primaryCtaLabel', type: 'text' },
    { name: 'primaryCtaHref', type: 'text' },

    { name: 'secondaryCtaLabel', type: 'text' },
    { name: 'secondaryCtaHref', type: 'text' },

    { name: 'tertiaryCtaLabel', type: 'text' },
    { name: 'tertiaryCtaHref', type: 'text' },

    { name: 'quaternaryCtaLabel', type: 'text' },
    { name: 'quaternaryCtaHref', type: 'text' },
  ],
}

export default HeroSettings
