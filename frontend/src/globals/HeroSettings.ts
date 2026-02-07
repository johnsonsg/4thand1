import type { GlobalConfig } from 'payload';

const HeroSettings: GlobalConfig = {
  slug: 'hero-settings',
  label: 'Hero Settings',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
};

export default HeroSettings;
