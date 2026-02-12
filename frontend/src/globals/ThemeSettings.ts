import type { Field, GlobalConfig } from 'payload'

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
]

const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme Settings',
  admin: {
    description: 'Configure theme colors for light and dark modes.',
  },
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
}

export default ThemeSettings
