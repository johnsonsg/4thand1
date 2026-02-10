import type { GlobalConfig } from 'payload'

const StatsSettings: GlobalConfig = {
  slug: 'stats-settings',
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
}

export default StatsSettings
