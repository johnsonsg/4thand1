import type { Field, GlobalConfig } from 'payload'

const tokenFields = (): Field[] => [
  {
    name: 'primary',
    type: 'text',
    admin: { description: 'Accepts hex (#030712) or HSL (43 90% 55%).' },
  },
  {
    name: 'secondary',
    type: 'text',
    admin: { description: 'Accepts hex (#030712) or HSL (43 90% 55%).' },
  },
]

const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme Settings',
  fields: [
    {
      name: 'light',
      type: 'group',
      fields: tokenFields(),
    },
    {
      name: 'dark',
      type: 'group',
      fields: tokenFields(),
    },
  ],
}

export default ThemeSettings
